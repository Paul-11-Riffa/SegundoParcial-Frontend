
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
        <h1>Pago Cancelado</h1>
        <p>Tu proceso de pago fue cancelado. Tu carrito ha sido guardado.</p>
        <p className={styles.subtleText}>Puedes regresar a tu carrito en cualquier momento para completar la compra.</p>
        <div className={styles.actions}>
          <Link to="/cart" className={styles.button}>Regresar al Carrito</Link>
          <Link to="/shop" className={styles.buttonSecondary}>Continuar Comprando</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelPage;