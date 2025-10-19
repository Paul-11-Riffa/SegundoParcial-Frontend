import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from '../styles/OrderStatusPage.module.css'; // Usaremos un estilo común
import { FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshCart } = useCart();
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Completar la orden cuando el usuario regresa de Stripe
  useEffect(() => {
    const completeOrder = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Cambiado de 'token' a 'authToken'
        if (!token) return;

        await axios.post(
          'http://127.0.0.1:8000/api/orders/complete-order/',
          {},
          {
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        );
        
        setOrderCompleted(true);
        // Refrescar el carrito después de completar la orden
        setTimeout(() => {
          refreshCart();
        }, 500);
      } catch (error) {
        console.error('Error al completar la orden:', error);
        // Aún así refrescamos el carrito
        refreshCart();
      }
    };

    if (sessionId) {
      completeOrder();
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
        <div className={styles.actions}>
          <Link to="/shop" className={styles.button}>Continuar Comprando</Link>
          <Link to="/my-orders" className={styles.buttonSecondary}>Ver Mis Órdenes</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;