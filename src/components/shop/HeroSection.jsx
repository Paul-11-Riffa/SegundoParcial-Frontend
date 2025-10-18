import React from 'react';
import styles from '../../styles/HeroSection.module.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.badge}>NEW COLLECTION</span>
          <h1 className={styles.title}>
            Discover Your <br />
            Perfect Style
          </h1>
          <p className={styles.subtitle}>
            Premium quality products curated just for you. Shop the latest trends and timeless classics.
          </p>
          <div className={styles.ctaButtons}>
            <a href="#products" className={styles.primaryBtn}>
              Shop Now
            </a>
            <Link to="/my-orders" className={styles.secondaryBtn}>
              View Orders
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