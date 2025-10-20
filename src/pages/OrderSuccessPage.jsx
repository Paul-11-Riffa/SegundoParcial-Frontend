import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from '../styles/OrderStatusPage.module.css'; // Usaremos un estilo común
import { FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { completeOrder } from '../services/api';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshCart } = useCart();
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [error, setError] = useState(null);

  // Completar la orden cuando el usuario regresa de Stripe
  useEffect(() => {
    const finishOrder = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No estás autenticado');
          return;
        }

        const response = await completeOrder();
        
        if (response.data.success) {
          setOrderCompleted(true);
          // Refrescar el carrito después de completar la orden
          setTimeout(() => {
            refreshCart();
          }, 500);
        }
      } catch (error) {
        console.error('Error al completar la orden:', error);
        setError('Hubo un error al completar tu orden, pero el pago fue exitoso.');
        // Aún así refrescamos el carrito
        refreshCart();
      }
    };

    if (sessionId) {
      finishOrder();
    }
  }, [sessionId, refreshCart]);

  return (
    <div className={styles.statusPage}>
      <div className={styles.statusCard}>
        <div className={`${styles.iconWrapper} ${styles.success}`}>
          <FaCheckCircle />
        </div>
        <h1>¡Pago Exitoso!</h1>
        <p>Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
        {orderCompleted && <p className={styles.subtleText}>Tu orden ha sido confirmada.</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        <div className={styles.actions}>
          <Link to="/shop" className={styles.button}>Continuar Comprando</Link>
          <Link to="/my-orders" className={styles.buttonSecondary}>Ver Mis Órdenes</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;