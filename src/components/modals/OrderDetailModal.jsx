import React from 'react';
import styles from './OrderDetailModal.module.css';
import { FaTimes, FaUser, FaCalendar, FaCreditCard, FaBox } from 'react-icons/fa';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: { label: 'Completado', color: '#28a745' },
      PENDING: { label: 'Pendiente', color: '#ffc107' },
      CANCELLED: { label: 'Cancelado', color: '#dc3545' },
      PROCESSING: { label: 'Procesando', color: '#007bff' }
    };

    const config = statusConfig[status] || { label: status, color: '#6c757d' };

    return (
      <span 
        className={styles.statusBadge} 
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Detalle de Orden #{order.order_number || order.id}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          {/* Información General */}
          <div className={styles.section}>
            <h3>Información General</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <FaCalendar className={styles.icon} />
                <div>
                  <span className={styles.label}>Fecha de Orden</span>
                  <span className={styles.value}>{formatDate(order.created_at)}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <FaCreditCard className={styles.icon} />
                <div>
                  <span className={styles.label}>Estado</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          {order.customer && (
            <div className={styles.section}>
              <h3>
                <FaUser className={styles.sectionIcon} /> 
                Cliente
              </h3>
              <div className={styles.customerInfo}>
                <p><strong>Nombre:</strong> {order.customer.first_name} {order.customer.last_name}</p>
                <p><strong>Usuario:</strong> @{order.customer.username}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
              </div>
            </div>
          )}

          {/* Productos */}
          <div className={styles.section}>
            <h3>
              <FaBox className={styles.sectionIcon} /> 
              Productos ({order.items?.length || 0})
            </h3>
            <div className={styles.itemsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name || item.product?.name || 'Producto'}</td>
                      <td className={styles.centered}>{item.quantity}</td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td className={styles.subtotal}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total de la Orden:</span>
              <span className={styles.totalAmount}>${parseFloat(order.total || order.total_price || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
