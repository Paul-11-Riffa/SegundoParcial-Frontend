import React from 'react';
import styles from '../../styles/HeroSection.module.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.badge}>NUEVA COLECCIÓN</span>
          <h1 className={styles.title}>
            Descubre Tu <br />
            Estilo Perfecto
          </h1>
          <p className={styles.subtitle}>
            Productos de calidad premium seleccionados especialmente para ti. Compra las últimas tendencias y clásicos atemporales.
          </p>
          <div className={styles.ctaButtons}>
            <a href="#products" className={styles.primaryBtn}>
              Comprar Ahora
            </a>
            <Link to="/my-orders" className={styles.secondaryBtn}>
              Ver Órdenes
            </Link>
          </div>
        </div>
        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.circle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;