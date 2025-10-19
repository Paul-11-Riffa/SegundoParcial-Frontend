import React from 'react';
import styles from '../styles/Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.section}>
          <h3 className={styles.brand}>SmartSales365</h3>
          <p className={styles.tagline}>
            Tu destino para productos de calidad premium y una experiencia de compra excepcional.
          </p>
          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaLinkedinIn />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className={styles.section}>
          <h4 className={styles.heading}>Tienda</h4>
          <ul className={styles.links}>
            <li><Link to="/shop">Todos los Productos</Link></li>
            <li><Link to="/shop">Nuevos Ingresos</Link></li>
            <li><Link to="/shop">Más Vendidos</Link></li>
            <li><Link to="/my-orders">Rastrear Orden</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className={styles.section}>
          <h4 className={styles.heading}>Servicio al Cliente</h4>
          <ul className={styles.links}>
            <li><Link to="/profile">Mi Cuenta</Link></li>
            <li><Link to="/cart">Carrito de Compras</Link></li>
            <li><Link to="/my-orders">Historial de Órdenes</Link></li>
            <li><a href="#">Centro de Ayuda</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className={styles.section}>
          <h4 className={styles.heading}>Compañía</h4>
          <ul className={styles.links}>
            <li><a href="#">Acerca de Nosotros</a></li>
            <li><a href="#">Carreras</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Términos de Servicio</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {currentYear} SmartSales365. Todos los derechos reservados.
        </p>
        <p className={styles.madeWith}>
          Hecho con <span className={styles.heart}>♥</span> para una gran experiencia de compra
        </p>
      </div>
    </footer>
  );
};

export default Footer;