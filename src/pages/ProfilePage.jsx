import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/api';
import styles from '../styles/ProfilePage.module.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();

  // 1. Usamos estados separados para cada campo editable
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 2. Usamos useEffect para llenar los campos cuando los datos del usuario cargan
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);


  const handleInfoSubmit = async (e) => {
    e.preventDefault();

    // 3. Lógica inteligente: Construimos un objeto solo con los datos que cambiaron
    const payload = {};
    if (username !== user.username) {
      payload.username = username;
    }
    if (email !== user.email) {
      payload.email = email;
    }

    // Si no hay cambios, no hacemos nada
    if (Object.keys(payload).length === 0) {
      setMessage('No hay cambios para guardar.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      await updateUserProfile(payload); // Enviamos solo el payload con los cambios
      setMessage('¡Detalles del perfil actualizados exitosamente!');
      // Idealmente, aquí deberíamos refrescar los datos del usuario en el estado global
    } catch (err) {
      const serverErrors = err.response?.data;
      let errorMessage = 'Error al actualizar el perfil.';
      if (serverErrors) {
        if (serverErrors.username) errorMessage = `Usuario: ${serverErrors.username[0]}`;
        else if (serverErrors.email) errorMessage = `Correo: ${serverErrors.email[0]}`;
        else if (serverErrors.detail) errorMessage = serverErrors.detail;
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
      setTimeout(() => { setMessage(''); setError(''); }, 4000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setTimeout(() => setError(''), 4000);
      return;
    }
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      await updateUserProfile({ password: passwordData.password });
      setMessage('¡Contraseña cambiada exitosamente!');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      setError('Error al cambiar la contraseña.');
    } finally {
      setIsSaving(false);
      setTimeout(() => { setMessage(''); setError(''); }, 4000);
    }
  };

  if (isLoading) return <div>Cargando perfil...</div>;

  return (
    <div className={styles.profilePage}>
      <h1>Mi Perfil</h1>

      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.grid}>
        {/* Tarjeta de Información del Perfil */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Información del Perfil</h3>
            <p>Actualiza la información de tu cuenta.</p>
          </div>
          <div className={styles.cardBody}>
            <form onSubmit={handleInfoSubmit}>
              <div className={styles.readonlyField}>
                <span>Nombre Completo</span>
                <p>{user?.first_name} {user?.last_name}</p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="username"><FaUser /> Usuario</label>
                <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email"><FaEnvelope /> Correo Electrónico</label>
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className={styles.cardFooter}>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tarjeta de Cambio de Contraseña */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Actualizar Contraseña</h3>
            <p>Asegúrate de que tu cuenta use una contraseña larga y segura.</p>
          </div>
          <div className={styles.cardBody}>
            <form onSubmit={handlePasswordSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="password"><FaLock /> Nueva Contraseña</label>
                <input id="password" name="password" type="password" value={passwordData.password} onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword"><FaLock /> Confirmar Contraseña</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
              </div>
               <div className={styles.cardFooter}>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;