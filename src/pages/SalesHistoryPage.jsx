import React, { useState, useEffect } from 'react';
import { getSalesHistory, downloadReceipt, getOrderDetail, getAllUsers } from '../services/api';
import styles from '../styles/SalesHistoryPage.module.css';
import { FaFilePdf, FaFilter, FaTimes, FaEye, FaDollarSign, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import OrderDetailModal from '../components/modals/OrderDetailModal';

const SalesHistoryPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrder: 0,
    completedOrders: 0
  });

  // --- ESTADOS PARA LOS FILTROS ---
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    customer: '',
    status: '',
    min_price: '',
    max_price: ''
  });
  // --------------------------------

  // Función para cargar las ventas (ahora usa los filtros)
  const fetchSales = async (currentFilters) => {
    try {
      setLoading(true);
      // Limpia los filtros vacíos antes de enviar (excepto precio, lo filtraremos en frontend)
      const activeFilters = {};
      if (currentFilters.start_date) activeFilters.start_date = currentFilters.start_date;
      if (currentFilters.end_date) activeFilters.end_date = currentFilters.end_date;
      if (currentFilters.customer) activeFilters.customer = currentFilters.customer;
      if (currentFilters.status) activeFilters.status = currentFilters.status;
      
      // NO enviamos min_price y max_price al backend porque no los procesa correctamente
      // Los filtraremos en el frontend

      const response = await getSalesHistory(activeFilters);
      let ordersData = response.data.results || response.data;
      
      // FILTRAR POR PRECIO EN EL FRONTEND
      if (currentFilters.min_price) {
        const minPrice = parseFloat(currentFilters.min_price);
        ordersData = ordersData.filter(order => {
          const orderTotal = parseFloat(order.total || order.total_price || 0);
          return orderTotal >= minPrice;
        });
      }
      
      if (currentFilters.max_price) {
        const maxPrice = parseFloat(currentFilters.max_price);
        ordersData = ordersData.filter(order => {
          const orderTotal = parseFloat(order.total || order.total_price || 0);
          return orderTotal <= maxPrice;
        });
      }
      
      setSales(ordersData);
      
      // Calcular estadísticas
      calculateStatistics(ordersData);
      
      setError(''); // Limpia errores previos si la carga es exitosa
    } catch (err) {
      console.error('Error al cargar ventas:', err);
      setError('Error al cargar el historial de ventas.');
      setSales([]); // Limpia las ventas si hay error
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular estadísticas
  const calculateStatistics = (ordersData) => {
    const totalRevenue = ordersData.reduce((sum, order) => 
      sum + parseFloat(order.total || order.total_price || 0), 0
    );
    const totalOrders = ordersData.length;
    const completedOrders = ordersData.filter(order => order.status === 'COMPLETED').length;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStatistics({
      totalRevenue,
      totalOrders,
      averageOrder,
      completedOrders
    });
  };

  // Cargar clientes para el filtro
  const fetchClients = async () => {
    try {
      const response = await getAllUsers();
      const usersData = response.data.results || response.data;
      // Filtrar solo clientes si es necesario
      const clientsList = Array.isArray(usersData) ? usersData : [];
      setClients(clientsList);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchSales(filters);
    fetchClients();
  }, []); // Se ejecuta solo una vez al montar

  // --- MANEJADORES PARA LOS FILTROS ---
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    fetchSales(filters); // Vuelve a cargar las ventas con los filtros actuales
  };

  const handleClearFilters = () => {
    const clearedFilters = { 
      start_date: '', 
      end_date: '', 
      customer: '', 
      status: '', 
      min_price: '', 
      max_price: '' 
    };
    setFilters(clearedFilters);
    fetchSales(clearedFilters); // Carga todas las ventas de nuevo
  };
  // ----------------------------------

  // Ver detalle de una orden
  const handleViewDetail = async (orderId) => {
    try {
      const response = await getOrderDetail(orderId);
      setSelectedOrder(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      setError('Error al cargar el detalle de la orden.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await downloadReceipt(orderId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante_orden_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar comprobante:', err);
      setError(`Error al descargar el comprobante de la orden ${orderId}.`);
      setTimeout(() => setError(''), 4000); // Limpia el error después de un tiempo
    }
  };

  // Función para obtener badge de estado
  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: { label: 'Completado', className: styles.statusCompleted },
      PENDING: { label: 'Pendiente', className: styles.statusPending },
      CANCELLED: { label: 'Cancelado', className: styles.statusCancelled },
      PROCESSING: { label: 'Procesando', className: styles.statusProcessing }
    };

    const config = statusConfig[status] || { label: status, className: styles.statusDefault };

    return (
      <span className={`${styles.statusBadge} ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Historial de Ventas</h1>
      </header>

      {/* --- TARJETAS DE ESTADÍSTICAS --- */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e7f3ff' }}>
            <FaDollarSign style={{ color: '#007bff' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Ingresos Totales</span>
            <span className={styles.statValue}>${statistics.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e8f5e9' }}>
            <FaShoppingCart style={{ color: '#28a745' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Órdenes</span>
            <span className={styles.statValue}>{statistics.totalOrders}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fff3e0' }}>
            <FaChartLine style={{ color: '#ff9800' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Ticket Promedio</span>
            <span className={styles.statValue}>${statistics.averageOrder.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f3e5f5' }}>
            <FaShoppingCart style={{ color: '#9c27b0' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Completadas</span>
            <span className={styles.statValue}>{statistics.completedOrders}</span>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="start_date">Fecha Desde:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="end_date">Fecha Hasta:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="customer">Cliente:</label>
          <select
            id="customer"
            name="customer"
            value={filters.customer}
            onChange={handleFilterChange}
            className={styles.selectInput}
          >
            <option value="">Todos los clientes</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.first_name} {client.last_name} (@{client.username})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={styles.selectInput}
          >
            <option value="">Todos los estados</option>
            <option value="COMPLETED">Completado</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSING">Procesando</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="min_price">Precio Mín:</label>
          <input
            type="number"
            id="min_price"
            name="min_price"
            value={filters.min_price}
            onChange={handleFilterChange}
            className={styles.priceInput}
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="max_price">Precio Máx:</label>
          <input
            type="number"
            id="max_price"
            name="max_price"
            value={filters.max_price}
            onChange={handleFilterChange}
            className={styles.priceInput}
            placeholder="9999.99"
            step="0.01"
          />
        </div>
        <button className={styles.filterButton} onClick={handleApplyFilters}>
          <FaFilter /> Aplicar
        </button>
        <button className={styles.clearButton} onClick={handleClearFilters}>
          <FaTimes /> Limpiar
        </button>
      </div>
      {/* --------------------------- */}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando ventas...</p>
          </div>
        ) : sales.length === 0 ? (
          <p className={styles.noResults}>No se encontraron ventas que coincidan con los filtros.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(order => (
                <tr key={order.id}>
                  <td className={styles.orderNumber}>
                    {order.order_number || `#${order.id}`}
                  </td>
                  <td>
                    {order.customer ? (
                      <>
                        {order.customer.first_name} {order.customer.last_name}
                        <span className={styles.username}> (@{order.customer.username})</span>
                      </>
                    ) : (
                      'Cliente no disponible'
                    )}
                  </td>
                  <td>{new Date(order.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td className={styles.price}>
                    ${parseFloat(order.total || order.total_price || 0).toFixed(2)}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewDetail(order.id)}
                        title="Ver Detalle"
                      >
                        <FaEye /> Ver
                      </button>
                      <button
                        className={styles.receiptButton}
                        onClick={() => handleDownloadReceipt(order.id)}
                        title="Descargar Comprobante PDF"
                      >
                        <FaFilePdf /> PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalle */}
      {showDetailModal && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </div>
  );
};

export default SalesHistoryPage;