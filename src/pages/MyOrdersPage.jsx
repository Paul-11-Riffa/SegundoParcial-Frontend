import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import styles from '../styles/MyOrdersPage.module.css'; // Crearemos este archivo
import { FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError('Error al cargar tus órdenes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <FaClock className={styles.pendingIcon} />;
      case 'COMPLETED': return <FaCheckCircle className={styles.completedIcon} />;
      case 'CANCELLED': return <FaTimesCircle className={styles.cancelledIcon} />;
      default: return <FaShoppingBag />;
    }
  };

  if (loading) return <div className={styles.centerMessage}>Cargando tus órdenes...</div>;
  if (error) return <div className={`${styles.centerMessage} ${styles.error}`}>{error}</div>;

  return (
    <div className={styles.myOrdersPage}>
      <h1><FaShoppingBag /> Mis Órdenes</h1>

      {orders.length === 0 ? (
        <div className={styles.noOrders}>
          <p>Aún no has realizado ningún pedido.</p>
          <a href="/shop" className={styles.shopLink}>Comenzar a Comprar</a>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.filter(order => order.status !== 'PENDING').map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderId}>Orden #{order.id}</div>
                <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                  {getStatusIcon(order.status)} {order.status === 'PENDING' ? 'PENDIENTE' : order.status === 'COMPLETED' ? 'COMPLETADA' : 'CANCELADA'}
                </div>
              </div>
              <div className={styles.orderDetails}>
                <div>
                  <strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div>
                  <strong>Total:</strong> ${parseFloat(order.total_price).toFixed(2)}
                </div>
                <div>
                  <strong>Artículos:</strong> {order.items.length}
                </div>
              </div>
              
              {/* Detalles de productos */}
              <div className={styles.orderItems}>
                <h4>Productos:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.product.name}</span>
                    <span className={styles.itemQuantity}>x{item.quantity}</span>
                    <span className={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</span>
                    <span className={styles.itemSubtotal}>
                      Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;