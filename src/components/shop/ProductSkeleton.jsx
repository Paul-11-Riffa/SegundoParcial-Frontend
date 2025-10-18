import React from 'react';
import styles from '../../styles/ProductSkeleton.module.css';

const ProductSkeleton = ({ viewMode = 'grid' }) => {
  const skeletonClass = viewMode === 'list' ? `${styles.skeleton} ${styles.listView}` : styles.skeleton;

  return (
    <div className={skeletonClass}>
      <div className={styles.imageContainer}>
        <div className={`${styles.shimmer} ${styles.image}`}></div>
      </div>
      <div className={styles.content}>
        <div className={`${styles.shimmer} ${styles.category}`}></div>
        <div className={`${styles.shimmer} ${styles.title}`}></div>
        <div className={`${styles.shimmer} ${styles.description}`}></div>
        <div className={styles.footer}>
          <div className={`${styles.shimmer} ${styles.price}`}></div>
          <div className={`${styles.shimmer} ${styles.button}`}></div>
        </div>
      </div>
    </div>
  );
};

// Grid de skeletons
export const ProductSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductSkeleton;