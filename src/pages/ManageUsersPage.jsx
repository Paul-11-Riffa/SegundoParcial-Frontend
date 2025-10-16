import React, {useState, useEffect} from 'react';
import {getAllUsers, deleteUser} from '../services/api';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import UserFormModal from '../components/admin/UserFormModal';
import styles from '../styles/ManageUsersPage.module.css';
import {FaPlus} from 'react-icons/fa';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para los modales
    const [userToEdit, setUserToEdit] = useState(null); // Guarda el usuario a editar
    const [isFormModalOpen, setFormModalOpen] = useState(false); // Abre/cierra el modal de formulario

    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- Lógica para abrir los modales ---
    const handleOpenAddModal = () => {
        setUserToEdit(null); // Nos aseguramos de que no haya un usuario para editar
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setUserToEdit(user); // Guardamos el usuario que se va a editar
        setFormModalOpen(true);
    };

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // --- Lógica para cerrar los modales ---
    const handleCloseModals = () => {
        setFormModalOpen(false);
        setShowDeleteModal(false);
        setUserToEdit(null);
        setUserToDelete(null);
    };

    // --- Lógica de acciones ---
    const handleUserSaved = (isEdit) => {
        handleCloseModals();
        fetchUsers();
        setSuccessMessage(`User ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            handleCloseModals();
            fetchUsers(); // Volvemos a cargar los usuarios
            setSuccessMessage(`User '${userToDelete.username}' deleted successfully.`);
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            setError('Failed to delete user.');
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <>
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1>User Management</h1>
                    <button className={styles.addButton} onClick={handleOpenAddModal}>
                        <FaPlus/> Add User
                    </button>
                </header>

                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        {/* ... (el thead de la tabla sigue igual) ... */}
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.avatar}>
                                            {user.first_name?.charAt(0) || user.username?.charAt(0) || '?'}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{user.first_name} {user.last_name}</span>
                                            <span className={styles.username}>@{user.username}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.email || 'N/A'}</td>
                                <td>
                                    {user.profile?.role ? (
                                        <span className={`${styles.role} ${styles[user.profile.role.toLowerCase()]}`}>
                        {user.profile.role}
                      </span>
                                    ) : ('No Role')}
                                </td>
                                <td>
                    <span className={user.is_active ? styles.active : styles.inactive}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.editButton} onClick={() => handleOpenEditModal(user)}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleOpenDeleteModal(user)}
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                onUserSaved={handleUserSaved}
                editingUser={userToEdit} // Pasamos el usuario a editar
            />

            {showDeleteModal && (
                <ConfirmationModal
                    title="Confirm Deletion"
                    onConfirm={handleDeleteUser}
                    onCancel={handleCloseModals}
                    confirmText="Yes, Delete User"
                >
                    {/* Usamos 'children' para un mensaje más rico y descriptivo */}
                    Are you sure you want to permanently delete the user{' '}
                    <strong>{userToDelete?.username}</strong>? This action cannot be undone.
                </ConfirmationModal>
            )}
        </>
    );
};

export default ManageUsersPage;