
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/OrderStatusPage.module.css'; // Reutilizamos estilos
import { FaTimesCircle } from 'react-icons/fa';

const OrderCancelPage = () => {
  return (
    <div className={styles.statusPage}>
      <div className={styles.statusCard}>
        <div className={`${styles.iconWrapper} ${styles.cancel}`}>
          <FaTimesCircle />
        </div>
        <h1>Payment Cancelled</h1>
        <p>Your payment process was cancelled. Your cart has been saved.</p>
        <p className={styles.subtleText}>You can return to your cart anytime to complete the purchase.</p>
        <div className={styles.actions}>
          <Link to="/cart" className={styles.button}>Return to Cart</Link>
          <Link to="/shop" className={styles.buttonSecondary}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelPage;