import React, { useState, useEffect } from 'react';
import { getMyOrders, downloadMyOrderReceipt } from '../services/api';
import styles from '../styles/MyOrdersPage.module.css'; // Crearemos este archivo
import { FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle, FaFileDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingReceipt, setDownloadingReceipt] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

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

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <FaClock className={styles.pendingIcon} />;
      case 'COMPLETED': return <FaCheckCircle className={styles.completedIcon} />;
      case 'CANCELLED': return <FaTimesCircle className={styles.cancelledIcon} />;
      default: return <FaShoppingBag />;
    }
  };

  const handleDownloadReceipt = async (orderId) => {
    try {
      setDownloadingReceipt(orderId);
      const response = await downloadMyOrderReceipt(orderId);
      
      // Crear un blob URL y descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante_orden_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar comprobante:', err);
      alert('Error al descargar el comprobante. Intenta nuevamente.');
    } finally {
      setDownloadingReceipt(null);
    }
  };

  if (loading) return <div className={styles.centerMessage}>Cargando tus órdenes...</div>;
  if (error) return <div className={`${styles.centerMessage} ${styles.error}`}>{error}</div>;

  return (
    <div className={styles.myOrdersPage}>
      <div className={styles.pageHeader}>
        <h1><FaShoppingBag /> Mis Órdenes</h1>
        <p className={styles.subtitle}>Historial completo de tus compras</p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.noOrders}>
          <FaShoppingBag className={styles.emptyIcon} />
          <p>Aún no has realizado ningún pedido.</p>
          <a href="/shop" className={styles.shopLink}>Comenzar a Comprar</a>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.filter(order => order.status !== 'PENDING').map(order => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className={`${styles.orderCard} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.orderHeader} onClick={() => toggleOrderExpanded(order.id)}>
                  <div className={styles.headerLeft}>
                    <div className={styles.orderId}>Orden #{order.id}</div>
                    <div className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.orderTotal}>${parseFloat(order.total_price).toFixed(2)}</div>
                    <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                      {getStatusIcon(order.status)} {order.status === 'PENDING' ? 'PENDIENTE' : order.status === 'COMPLETED' ? 'COMPLETADA' : 'CANCELADA'}
                    </div>
                    <button className={styles.toggleButton}>
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.orderContent}>
                    <div className={styles.orderInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Fecha completa:</span>
                        <span className={styles.infoValue}>
                          {new Date(order.created_at).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Artículos:</span>
                        <span className={styles.infoValue}>{order.items.length} producto(s)</span>
                      </div>
                    </div>
                    
                    {/* Detalles de productos */}
                    <div className={styles.orderItems}>
                      <h4>Productos:</h4>
                      <div className={styles.itemsTable}>
                        {order.items.map((item, index) => (
                          <div key={index} className={styles.orderItem}>
                            <span className={styles.itemName}>{item.product.name}</span>
                            <span className={styles.itemQuantity}>x{item.quantity}</span>
                            <span className={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</span>
                            <span className={styles.itemSubtotal}>
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botón para descargar comprobante solo si la orden está COMPLETED */}
                    {order.status === 'COMPLETED' && (
                      <div className={styles.receiptSection}>
                        <button 
                          onClick={() => handleDownloadReceipt(order.id)}
                          className={styles.downloadButton}
                          disabled={downloadingReceipt === order.id}
                        >
                          <FaFileDownload /> 
                          {downloadingReceipt === order.id ? 'Descargando...' : 'Descargar Comprobante'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;