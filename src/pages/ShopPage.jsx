import React, { useState, useEffect } from 'react';
import { getProducts, addToCart } from '../services/api';
import ProductCard from '../components/shop/ProductCard';
import styles from '../styles/ShopPage.module.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(''); // Mensajes para el usuario

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setFeedback(''); // Limpia mensajes anteriores
    try {
      await addToCart(productId, 1);
      setFeedback('Product added to cart!');
      setTimeout(() => setFeedback(''), 3000); // Oculta el mensaje después de 3 seg
    } catch (err) {
      setError('Could not add product to cart.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className={styles.centerMessage}>Loading products...</div>;
  if (error) return <div className={`${styles.centerMessage} ${styles.error}`}>{error}</div>;

  return (
    <div className={styles.shopPage}>
      <h1>Our Products</h1>

      {feedback && <div className={styles.feedbackMessage}>{feedback}</div>}

      <div className={styles.productGrid}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;