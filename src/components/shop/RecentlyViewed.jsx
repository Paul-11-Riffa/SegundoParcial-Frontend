import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import styles from '../../styles/RecentlyViewed.module.css';
import { FaClock, FaTimes } from 'react-icons/fa';

const RecentlyViewed = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const navigate = useNavigate();

  if (recentlyViewed.length === 0) {
    return null;
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <FaClock className={styles.icon} />
          <h2 className={styles.title}>Recently Viewed</h2>
          <span className={styles.count}>{recentlyViewed.length}</span>
        </div>
        <button className={styles.clearButton} onClick={clearRecentlyViewed}>
          <FaTimes /> Clear All
        </button>
      </div>

      <div className={styles.scrollContainer}>
        <div className={styles.productList}>
          {recentlyViewed.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => handleProductClick(product.id)}
            >
              <div className={styles.imageContainer}>
                <img 
                  src={product.image_url || product.image || 'https://via.placeholder.com/200x200.png?text=No+Image'}
                  alt={product.name}
                  className={styles.image}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200.png?text=No+Image'; }}
                />
                {product.stock <= 0 && (
                  <div className={styles.outOfStockOverlay}>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.category}>{product.category_name}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className={styles.lowStock}>Only {product.stock} left</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;