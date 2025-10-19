import React, { useState } from 'react';
import styles from '../../styles/ProductCard.module.css';
import { FaCartPlus, FaHeart, FaEye, FaRegHeart, FaCheck } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, onProductClick, viewMode = 'grid' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const imageUrl = product.image || 'https://via.placeholder.com/400x400.png?text=No+Image';
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const cardClass = viewMode === 'list' ? `${styles.card} ${styles.listView}` : styles.card;

  const handleAddToCartClick = async (e) => {
    e.stopPropagation(); // Prevent card click event
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    await onAddToCart(product.id);
    setIsAdding(false);
    setJustAdded(true);

    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
      onClick={handleCardClick}
      style={{ cursor: onProductClick ? 'pointer' : 'default' }}
    >
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} className={styles.image} />

        {/* Badges */}
        <div className={styles.badges}>
          {isOutOfStock && (
            <span className={`${styles.badge} ${styles.outOfStockBadge}`}>Sin Stock</span>
          )}
          {isLowStock && (
            <span className={`${styles.badge} ${styles.lowStockBadge}`}>Solo {product.stock} disponibles</span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        {showQuickView && !isOutOfStock && (
          <div className={styles.quickActions}>
            <button
              className={styles.quickActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              title="Agregar a favoritos"
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        )}

        {/* Category Badge */}
        <div className={styles.categoryBadge}>
          {product.category_name}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>
          {product.description?.substring(0, viewMode === 'list' ? 150 : 80)}
          {product.description?.length > (viewMode === 'list' ? 150 : 80) ? '...' : ''}
        </p>

        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
            {isLowStock && <span className={styles.stockWarning}>Stock bajo</span>}
          </div>

          <button
            className={`${styles.addButton} ${isAdding ? styles.adding : ''} ${justAdded ? styles.added : ''}`}
            onClick={handleAddToCartClick}
            disabled={isOutOfStock || isAdding}
          >
            {justAdded ? (
              <>
                <FaCheck />
                <span>{viewMode === 'list' ? '¡Agregado!' : ''}</span>
              </>
            ) : (
              <>
                <FaCartPlus />
                <span>{viewMode === 'list' ? (isAdding ? 'Agregando...' : 'Agregar al Carrito') : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;