import React, { useState } from 'react';
import styles from '../../styles/ProductImage.module.css';

/**
 * Componente para mostrar imágenes de productos con manejo de errores
 * Usa los nuevos campos del backend: image_url y has_valid_image
 * 
 * @param {Object} product - Objeto del producto con image_url y has_valid_image
 * @param {string} className - Clases CSS adicionales
 * @param {string} size - Tamaño de la imagen ('small', 'medium', 'large')
 * @param {string} placeholderText - Texto del placeholder
 */
const ProductImage = ({ 
  product, 
  className = '', 
  size = 'medium',
  placeholderText = 'Sin imagen'
}) => {
  const [imageError, setImageError] = useState(false);
  
  // ✅ Usar image_url del backend (URL completa y validada)
  const imageUrl = product?.image_url || product?.image;
  const hasValidImage = product?.has_valid_image && !imageError;
  
  // Tamaños de placeholder según el tamaño
  const placeholderSizes = {
    small: '100x100',
    medium: '200x200',
    large: '400x400'
  };
  
  const placeholderSize = placeholderSizes[size] || placeholderSizes.medium;
  const placeholderUrl = `https://via.placeholder.com/${placeholderSize}.png?text=${encodeURIComponent(placeholderText)}`;
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Si no hay imagen válida, mostrar placeholder
  if (!hasValidImage || !imageUrl) {
    return (
      <div className={`${styles.placeholder} ${styles[size]} ${className}`}>
        <img 
          src={placeholderUrl}
          alt={placeholderText}
          className={styles.placeholderImage}
        />
      </div>
    );
  }
  
  return (
    <img 
      src={imageUrl}
      alt={product?.name || 'Producto'}
      className={`${styles.productImage} ${styles[size]} ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default ProductImage;
