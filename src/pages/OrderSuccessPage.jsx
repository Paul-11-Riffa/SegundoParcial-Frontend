import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from '../styles/OrderStatusPage.module.css'; // Usaremos un estilo común
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Opcional: Podrías usar el sessionId para verificar el estado
  // de la sesión con tu backend si quisieras una doble confirmación,
  // pero el webhook ya debería haber actualizado el estado.
  useEffect(() => {
    // Aquí podrías hacer una llamada a tu backend si necesitas verificar
    // console.log("Stripe Session ID:", sessionId);
  }, [sessionId]);

  return (
    <div className={styles.statusPage}>
      <div className={styles.statusCard}>
        <div className={`${styles.iconWrapper} ${styles.success}`}>
          <FaCheckCircle />
        </div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order is being processed.</p>
        <p className={styles.subtleText}>Order details should be updated shortly.</p>
        <div className={styles.actions}>
          <Link to="/shop" className={styles.button}>Continue Shopping</Link>
          {/* Podrías añadir un enlace al historial de órdenes si lo tuvieras */}
          {/* <Link to="/orders" className={styles.buttonSecondary}>View Orders</Link> */}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;