import React from 'react';
import styles from '../../styles/ProductCard.module.css';
import { FaCartPlus } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart }) => {
  // Imagen placeholder si no hay imagen real
  const imageUrl = product.image || 'https://via.placeholder.com/300x200.png?text=No+Image';

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{product.category_name}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>
          {product.description?.substring(0, 60)}{product.description?.length > 60 ? '...' : ''}
        </p>
        <div className={styles.footer}>
          <span className={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
          <button
            className={styles.addButton}
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock <= 0} // Deshabilita si no hay stock
          >
            {product.stock > 0 ? <FaCartPlus /> : 'Out'}
          </button>
        </div>
         {product.stock <= 0 && <span className={styles.outOfStock}>Out of Stock</span>}
      </div>
    </div>
  );
};

export default ProductCard;