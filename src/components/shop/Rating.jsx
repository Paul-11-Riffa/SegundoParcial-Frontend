import React from 'react';
import styles from '../../styles/Rating.module.css';

/**
 * Rating Component - Premium Style
 * Sin estrellas amarillas genéricas, usa la paleta de DOMUS
 */
const Rating = ({ rating = 0, reviewCount = 0, size = 'medium', showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  }[size];

  return (
    <div className={`${styles.rating} ${sizeClass}`}>
      <div className={styles.stars}>
        {/* Estrellas llenas */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className={`${styles.star} ${styles.filled}`}>
            ★
          </span>
        ))}
        
        {/* Media estrella */}
        {hasHalfStar && (
          <span className={`${styles.star} ${styles.half}`}>
            ★
          </span>
        )}
        
        {/* Estrellas vacías */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className={`${styles.star} ${styles.empty}`}>
            ★
          </span>
        ))}
      </div>
      
      {showCount && reviewCount > 0 && (
        <span className={styles.count}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default Rating;
