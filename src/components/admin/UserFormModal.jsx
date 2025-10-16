import React, { useState, useEffect } from 'react';
import styles from '../../styles/UserFormModal.module.css';
import { createUser, updateUser } from '../../services/api';

// El modal ahora acepta un 'editingUser' para saber si está en modo edición
const UserFormModal = ({ isOpen, onClose, onUserSaved, editingUser }) => {
  const isEditMode = Boolean(editingUser);

  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Este efecto llena el formulario con los datos del usuario cuando abrimos el modal para editar
  useEffect(() => {
    if (isEditMode && editingUser) {
      setFormData({
        first_name: editingUser.first_name || '',
        last_name: editingUser.last_name || '',
        username: editingUser.username || '',
        email: editingUser.email || '',
        password: '', // La contraseña se deja en blanco por seguridad
        profile: {
          role: editingUser.profile?.role || 'CLIENT',
        },
        is_active: editingUser.is_active,
      });
    } else {
      // Estado inicial para crear un nuevo usuario
      setFormData({
        first_name: '', last_name: '', username: '', email: '', password: '',
        profile: { role: 'CLIENT' },
        is_active: true,
      });
    }
  }, [isOpen, editingUser, isEditMode]);


  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, role: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Filtramos los datos que no queremos enviar si están vacíos (ej. la contraseña)
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      if (isEditMode) {
        await updateUser(editingUser.id, dataToSend);
      } else {
        await createUser(dataToSend);
      }
      onUserSaved(isEditMode); // Llama a la función del padre para cerrar y refrescar
    } catch (err) {
      const serverError = err.response?.data;
      const errorMessage =
        serverError?.username?.[0] ||
        serverError?.email?.[0] ||
        `Failed to ${isEditMode ? 'update' : 'create'} user.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="first_name">First Name</label>
              <input type="text" id="first_name" name="first_name" value={formData.first_name} required onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="last_name">Last Name</label>
              <input type="text" id="last_name" name="last_name" value={formData.last_name} required onChange={handleChange} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} required onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} required onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder={isEditMode ? 'Leave blank to keep current password' : ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.profile?.role} onChange={handleChange}>
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;