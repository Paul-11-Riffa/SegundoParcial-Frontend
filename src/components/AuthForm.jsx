import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import styles from '../styles/AuthForm.module.css';
import {FaEye, FaEyeSlash, FaPlusSquare} from 'react-icons/fa';
import {loginUser, getUserProfile} from '../services/api';

const AuthForm = ({formType, onSubmit, title, subtitle}) => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const isSignUp = formType === 'signup';

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignUp) {
                await onSubmit(formData);
                navigate('/login');
            } else {
                const credentials = {username: formData.username, password: formData.password};
                // 1. Iniciar sesión para obtener el token
                const loginResponse = await loginUser(credentials);
                localStorage.setItem('authToken', loginResponse.data.token);

                // 2. Usar el token para obtener el perfil del usuario
                const profileResponse = await getUserProfile();
                // 3. Guardar los datos del usuario en localStorage
                localStorage.setItem('user', JSON.stringify(profileResponse.data));

                // 4. Redirigir al dashboard
                navigate('/dashboard'); // Redirigimos a una nueva ruta /dashboard
            }
        } catch (err) {
            // Limpiamos cualquier dato guardado si hay un error
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            const errorMessage = err.response?.data?.error || err.response?.data?.detail || 'Ocurrió un error. Inténtalo de nuevo.';
            setError(errorMessage);
        }
    };

    return (
        <>
            <div className={styles.header}>
                <FaPlusSquare size={32} className={styles.logo}/>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>

            <div className={styles.toggleContainer}>
                <Link to="/login" className={`${styles.toggleButton} ${!isSignUp ? styles.active : ''}`}>
                    Sign In
                </Link>
                <Link to="/signup" className={`${styles.toggleButton} ${isSignUp ? styles.active : ''}`}>
                    Sign Up
                </Link>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {isSignUp && (
                    <>
                        <div className={styles.inputGroup}>
                            <input
                                type="text" name="first_name" placeholder="First Name"
                                value={formData.first_name} onChange={handleChange} required
                                className={styles.input}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="text" name="last_name" placeholder="Last Name"
                                value={formData.last_name} onChange={handleChange} required
                                className={styles.input}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="email" name="email" placeholder="Email Address"
                                value={formData.email} onChange={handleChange} required
                                className={styles.input}/>
                        </div>
                    </>
                )}

                <div className={styles.inputGroup}>
                    <input
                        type="text" name="username" placeholder="Username or Email"
                        value={formData.username} onChange={handleChange} required
                        className={styles.input}/>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="password" placeholder="Password"
                        value={formData.password} onChange={handleChange} required
                        className={styles.input}
                    />
                    <span className={styles.eyeIcon} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {isPasswordVisible ? <FaEyeSlash/> : <FaEye/>}
          </span>
                </div>

                {!isSignUp && (
                    <div className={styles.options}>
                        <label className={styles.rememberMe}>
                            <input type="checkbox"/>
                            Remember me
                        </label>
                        <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
                    </div>
                )}

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.submitButton}>
                    {isSignUp ? 'Sign Up' : 'Login'}
                </button>
            </form>
        </>
    );
};

export default AuthForm;