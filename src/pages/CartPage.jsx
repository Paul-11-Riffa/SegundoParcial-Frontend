import React, { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem, initiateCheckout } from '../services/api';
import styles from '../styles/CartPage.module.css';
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Importa Link

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null); // Para mostrar carga en un item específico

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      setError('Could not load your cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setUpdatingItemId(itemId); // Muestra indicador de carga
    try {
      const response = await updateCartItem(itemId, newQuantity);
      setCart(response.data);
      setFeedback('Cart updated.');
      setTimeout(() => setFeedback(''), 2000);
    } catch (err) {
      setError('Could not update quantity.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingItemId(null); // Oculta indicador de carga
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItemId(itemId);
    try {
      const response = await removeCartItem(itemId);
      setCart(response.data);
      setFeedback('Item removed.');
      setTimeout(() => setFeedback(''), 2000);
    } catch (err) {
      setError('Could not remove item.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleCheckout = async () => {
    setLoading(true); // Usamos el loading general para el checkout
    setError('');
    try {
      const response = await initiateCheckout();
      // Redirige al usuario a la URL de pago de Stripe
      window.location.href = response.data.checkout_url;
    } catch (err) {
      setError(err.response?.data?.error || 'Could not initiate checkout. Is your cart empty?');
      setLoading(false);
    }
    // No ponemos setLoading(false) en el 'try' porque la redirección debe ocurrir
  };

  const calculateSubtotal = (item) => {
    return (parseFloat(item.price) * item.quantity).toFixed(2);
  };

  if (loading && cart === null) return <div className={styles.centerMessage}>Loading your cart...</div>;
  if (error) return <div className={`${styles.centerMessage} ${styles.error}`}>{error}</div>;

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className={styles.cartPage}>
      <h1><FaShoppingCart /> Your Shopping Cart</h1>

      {feedback && <div className={styles.feedbackMessage}>{feedback}</div>}

      {isEmpty ? (
        <div className={styles.emptyCart}>
          <p>Your cart is currently empty.</p>
          <Link to="/shop" className={styles.shopLink}>Continue Shopping</Link>
        </div>
      ) : (
        <div className={styles.cartGrid}>
          {/* Columna de Items */}
          <div className={styles.itemsList}>
            {cart.items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.product.image || 'https://via.placeholder.com/100x100.png?text=No+Image'}
                  alt={item.product.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.product.name}</span>
                  <span className={styles.itemPrice}>${parseFloat(item.product.price).toFixed(2)} each</span>
                  <div className={styles.quantityControl}>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={updatingItemId === item.id || item.quantity <= 1}>
                      <FaMinus />
                    </button>
                    <span>{updatingItemId === item.id ? '...' : item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={updatingItemId === item.id}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <span className={styles.itemSubtotal}>${calculateSubtotal(item)}</span>
                  <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton} disabled={updatingItemId === item.id}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Columna de Resumen */}
          <div className={styles.summary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryLine}>
              <span>Subtotal</span>
              <span>${parseFloat(cart.total_price).toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className={`${styles.summaryLine} ${styles.total}`}>
              <span>Total</span>
              <span>${parseFloat(cart.total_price).toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton} onClick={handleCheckout} disabled={loading}>
              {loading ? 'Processing...' : <><FaCreditCard /> Proceed to Checkout</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;