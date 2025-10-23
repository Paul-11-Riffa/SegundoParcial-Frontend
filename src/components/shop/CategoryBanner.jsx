import React from 'react';
import styles from '../../styles/CategoryBanner.module.css';
import { getCategoryBanner } from '../../config/visualAssets';

/**
 * CategoryBanner - Banner Contextual Estilo Nike
 * 
 * Establece el "mood" de la categoría antes de mostrar productos.
 * Usa imágenes de las carpetas hero-banners para crear ambiente premium.
 */
const CategoryBanner = ({ category, productCount }) => {
  // Obtener configuración de banner desde el archivo de configuración
  const categorySlug = category?.slug || category?.toLowerCase() || 'default';
  const bannerConfig = getCategoryBanner(categorySlug);

  return (
    <section className={styles.categoryBanner}>
      <div className={styles.imageContainer}>
        <img 
          src={bannerConfig.image} 
          alt={bannerConfig.title} 
          className={styles.bannerImage}
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{bannerConfig.title}</h1>
          <p className={styles.subtitle}>{bannerConfig.subtitle}</p>
          {productCount && (
            <span className={styles.productCount}>
              {productCount} {productCount === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
