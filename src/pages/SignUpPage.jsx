import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import signupImage from '../assets/hielo.jpg';

const SignUpPage = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.splitScreen}>
        {/* LADO B - LA IMAGEN (La Emoción) */}
        <div className={styles.imageSide}>
          <img src={signupImage} alt="" className={styles.aspirationalImage} />
        </div>

        {/* LADO A - EL FORMULARIO (La Acción) */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            <AuthForm
              formType="signup"
              onSubmit={registerUser}
              title="Crea tu cuenta"
              subtitle="Únete a la familia DOMUS"
            />
            
            <div className={styles.footerLinks}>
              <p>¿Ya tienes cuenta? <Link to="/login" className={styles.linkText}>Inicia sesión aquí</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;