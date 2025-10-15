import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AuthForm.module.css';

const AuthForm = ({ formType, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isSignUp = formType === 'signup';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await onSubmit(formData);
      // Guardamos el token para futuras peticiones
      localStorage.setItem('authToken', response.data.token);
      // Redirigimos al home
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Ocurrió un error. Inténtalo de nuevo.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {isSignUp && (
        <>
          <input
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={formData.first_name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Apellido"
            value={formData.last_name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </>
      )}
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        value={formData.username}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default AuthForm;