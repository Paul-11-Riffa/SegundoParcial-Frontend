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
      setMessage('No changes to save.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      await updateUserProfile(payload); // Enviamos solo el payload con los cambios
      setMessage('Profile details updated successfully!');
      // Idealmente, aquí deberíamos refrescar los datos del usuario en el estado global
    } catch (err) {
      const serverErrors = err.response?.data;
      let errorMessage = 'Failed to update profile.';
      if (serverErrors) {
        if (serverErrors.username) errorMessage = `Username: ${serverErrors.username[0]}`;
        else if (serverErrors.email) errorMessage = `Email: ${serverErrors.email[0]}`;
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
      setError('Passwords do not match.');
      setTimeout(() => setError(''), 4000);
      return;
    }
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      await updateUserProfile({ password: passwordData.password });
      setMessage('Password changed successfully!');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to change password.');
    } finally {
      setIsSaving(false);
      setTimeout(() => { setMessage(''); setError(''); }, 4000);
    }
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className={styles.profilePage}>
      <h1>My Profile</h1>

      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.grid}>
        {/* Tarjeta de Información del Perfil */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Profile Information</h3>
            <p>Update your account's profile information.</p>
          </div>
          <div className={styles.cardBody}>
            <form onSubmit={handleInfoSubmit}>
              <div className={styles.readonlyField}>
                <span>Full Name</span>
                <p>{user?.first_name} {user?.last_name}</p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="username"><FaUser /> Username</label>
                <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email"><FaEnvelope /> Email Address</label>
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className={styles.cardFooter}>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tarjeta de Cambio de Contraseña */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Update Password</h3>
            <p>Ensure your account is using a long, random password to stay secure.</p>
          </div>
          <div className={styles.cardBody}>
            <form onSubmit={handlePasswordSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="password"><FaLock /> New Password</label>
                <input id="password" name="password" type="password" value={passwordData.password} onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
              </div>
               <div className={styles.cardFooter}>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Change Password'}
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