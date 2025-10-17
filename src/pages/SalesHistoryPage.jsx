import React, { useState, useEffect } from 'react';
import { getSalesHistory, downloadReceipt } from '../services/api';
import styles from '../styles/SalesHistoryPage.module.css';
import { FaFilePdf, FaFilter, FaTimes } from 'react-icons/fa'; // Añadimos iconos

const SalesHistoryPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- ESTADOS PARA LOS FILTROS ---
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
  });
  // --------------------------------

  // Función para cargar las ventas (ahora usa los filtros)
  const fetchSales = async (currentFilters) => {
    try {
      setLoading(true);
      // Limpia los filtros vacíos antes de enviar
      const activeFilters = {};
      if (currentFilters.start_date) activeFilters.start_date = currentFilters.start_date;
      if (currentFilters.end_date) activeFilters.end_date = currentFilters.end_date;

      const response = await getSalesHistory(activeFilters);
      setSales(response.data);
      setError(''); // Limpia errores previos si la carga es exitosa
    } catch (err) {
      setError('Failed to fetch sales history.');
      setSales([]); // Limpia las ventas si hay error
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchSales(filters);
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
    const clearedFilters = { start_date: '', end_date: '' };
    setFilters(clearedFilters);
    fetchSales(clearedFilters); // Carga todas las ventas de nuevo
  };
  // ----------------------------------

  const handleDownloadReceipt = async (orderId) => {
    // ... (esta función queda igual)
    try {
      const response = await downloadReceipt(orderId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to download receipt for order ${orderId}.`);
      setTimeout(() => setError(''), 4000); // Limpia el error después de un tiempo
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Sales History</h1>
      </header>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="start_date">From Date:</label>
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
          <label htmlFor="end_date">To Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className={styles.dateInput}
          />
        </div>
        <button className={styles.filterButton} onClick={handleApplyFilters}>
          <FaFilter /> Apply Filters
        </button>
        <button className={styles.clearButton} onClick={handleClearFilters}>
          <FaTimes /> Clear
        </button>
      </div>
      {/* --------------------------- */}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : sales.length === 0 ? (
           <p className={styles.noResults}>No sales found matching your criteria.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {order.customer.first_name} {order.customer.last_name}
                    <span className={styles.username}> (@{order.customer.username})</span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>${parseFloat(order.total_price).toFixed(2)}</td>
                  <td>
                    <button
                      className={styles.receiptButton}
                      onClick={() => handleDownloadReceipt(order.id)}
                      title="Download Receipt PDF"
                    >
                      <FaFilePdf /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesHistoryPage;