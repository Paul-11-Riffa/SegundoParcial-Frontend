import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/api';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import styles from '../styles/ManageUsersPage.module.css';
import { FaPlus } from 'react-icons/fa';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete user.');
      closeDeleteModal();
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>User Management</h1>
          <button className={styles.addButton}>
            <FaPlus /> Add User
          </button>
        </header>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* --- SECCIÓN CORREGIDA CON CÓDIGO SEGURO --- */}
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  {/* Columna 1: Nombre */}
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
                  {/* Columna 2: Email */}
                  <td>{user.email || 'N/A'}</td>
                  {/* Columna 3: Rol */}
                  <td>
                    {user.profile?.role ? (
                      <span className={`${styles.role} ${styles[user.profile.role.toLowerCase()]}`}>
                        {user.profile.role}
                      </span>
                    ) : (
                      'No Role'
                    )}
                  </td>
                  {/* Columna 4: Status */}
                  <td>
                    <span className={user.is_active ? styles.active : styles.inactive}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* Columna 5: Acciones */}
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editButton}>Edit</button>
                      <button
                        onClick={() => openDeleteModal(user)}
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

      {showDeleteModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete ${userToDelete?.first_name || userToDelete?.username}? This action cannot be undone.`}
          onConfirm={handleDeleteUser}
          onCancel={closeDeleteModal}
        />
      )}
    </>
  );
};

export default ManageUsersPage;