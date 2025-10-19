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
            setError('Error al cargar usuarios.');
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
        setSuccessMessage(`¡Usuario ${isEdit ? 'actualizado' : 'creado'} exitosamente!`);
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            handleCloseModals();
            fetchUsers(); // Volvemos a cargar los usuarios
            setSuccessMessage(`Usuario '${userToDelete.username}' eliminado exitosamente.`);
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            setError('Error al eliminar usuario.');
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <>
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1>Gestión de Usuarios</h1>
                    <button className={styles.addButton} onClick={handleOpenAddModal}>
                        <FaPlus/> Agregar Usuario
                    </button>
                </header>

                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        {/* ... (el thead de la tabla sigue igual) ... */}
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
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
                                    ) : ('Sin Rol')}
                                </td>
                                <td>
                    <span className={user.is_active ? styles.active : styles.inactive}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.editButton} onClick={() => handleOpenEditModal(user)}>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleOpenDeleteModal(user)}
                                            className={styles.deleteButton}
                                        >
                                            Eliminar
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