// src/pages/AdvancedReportsPage.jsx
/**
 * Página para reportes avanzados: RFM, ABC, Comparativo, Dashboard, Inventario
 */

import { useState } from 'react';
import { 
  FaUsers, 
  FaBoxOpen, 
  FaChartLine, 
  FaTachometerAlt, 
  FaWarehouse,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import { 
  getCustomerAnalysis, 
  getProductABCAnalysis, 
  getComparativeReport,
  getExecutiveDashboard,
  getInventoryAnalysis
} from '../services/api';
import '../styles/AdvancedReportsPage.css';

const AdvancedReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [error, setError] = useState(null);

  // Formulario de parámetros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comparison, setComparison] = useState('previous_month');
  const [format, setFormat] = useState('json');

  const reportOptions = [
    {
      id: 'rfm',
      title: 'Análisis RFM de Clientes',
      description: 'Segmenta clientes en VIP, Regular, Nuevo, En Riesgo, Inactivo',
      icon: <FaUsers />,
      color: '#3b82f6'
    },
    {
      id: 'abc',
      title: 'Análisis ABC de Productos',
      description: 'Clasifica productos según el principio de Pareto (80/20)',
      icon: <FaBoxOpen />,
      color: '#10b981'
    },
    {
      id: 'comparative',
      title: 'Reporte Comparativo',
      description: 'Compara métricas entre dos períodos de tiempo',
      icon: <FaChartLine />,
      color: '#f59e0b'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Ejecutivo',
      description: 'Panel con KPIs, tops y alertas del negocio',
      icon: <FaTachometerAlt />,
      color: '#8b5cf6'
    },
    {
      id: 'inventory',
      title: 'Análisis de Inventario',
      description: 'Análisis inteligente del estado del inventario',
      icon: <FaWarehouse />,
      color: '#ef4444'
    }
  ];

  const handleGenerateReport = async (type) => {
    setLoading(true);
    setError(null);
    setReportData(null);
    setReportType(type);

    try {
      let response;
      const params = { format };

      if (type !== 'inventory' && type !== 'dashboard') {
        if (!startDate || !endDate) {
          setError('Por favor, selecciona las fechas de inicio y fin.');
          setLoading(false);
          return;
        }
        params.start_date = startDate;
        params.end_date = endDate;
      }

      switch (type) {
        case 'rfm':
          response = await getCustomerAnalysis(params);
          break;
        case 'abc':
          response = await getProductABCAnalysis(params);
          break;
        case 'comparative':
          params.comparison = comparison;
          response = await getComparativeReport(params);
          break;
        case 'dashboard':
          if (startDate && endDate) {
            response = await getExecutiveDashboard({ start_date: startDate, end_date: endDate });
          } else {
            setError('Por favor, selecciona las fechas para el dashboard.');
            setLoading(false);
            return;
          }
          break;
        case 'inventory':
          response = await getInventoryAnalysis(params);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      if (response.downloaded) {
        setReportData({ success: true, message: '✅ Archivo descargado exitosamente' });
      } else {
        setReportData(response.data);
      }
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setError(err.response?.data?.detail || 'Error al generar el reporte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const renderReportData = () => {
    if (!reportData || reportData.success) return null;

    if (reportType === 'dashboard') {
      return <DashboardReport data={reportData} />;
    }

    return <GenericTableReport data={reportData} type={reportType} />;
  };

  return (
    <div className="advanced-reports-page">
      <div className="reports-header">
        <h1>📊 Reportes Avanzados</h1>
        <p>Análisis inteligente y reportes especializados para toma de decisiones</p>
      </div>

      {/* Parámetros de fecha */}
      <div className="date-filters">
        <div className="filter-group">
          <label>Fecha Inicio:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="filter-group">
          <label>Fecha Fin:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="filter-group">
          <label>Formato:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} disabled={loading}>
            <option value="json">En Pantalla</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>
        {reportType === 'comparative' && (
          <div className="filter-group">
            <label>Comparar con:</label>
            <select value={comparison} onChange={(e) => setComparison(e.target.value)} disabled={loading}>
              <option value="previous_month">Mes Anterior</option>
              <option value="previous_period">Período Anterior</option>
            </select>
          </div>
        )}
      </div>

      {/* Opciones de reportes */}
      <div className="report-options">
        {reportOptions.map((option) => (
          <div 
            key={option.id} 
            className="report-card"
            style={{ borderColor: option.color }}
            onClick={() => !loading && handleGenerateReport(option.id)}
          >
            <div className="report-icon" style={{ color: option.color }}>
              {option.icon}
            </div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
            <button 
              className="generate-btn"
              disabled={loading}
              style={{ backgroundColor: option.color }}
            >
              {loading && reportType === option.id ? (
                <>
                  <FaSpinner className="spinner" />
                  Generando...
                </>
              ) : (
                <>
                  <FaDownload />
                  Generar
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {reportData && reportData.success && (
        <div className="success-message">
          {reportData.message}
        </div>
      )}

      {/* Reporte generado */}
      {renderReportData()}
    </div>
  );
};

// Componente para mostrar reportes en tabla
const GenericTableReport = ({ data, type }) => {
  if (!data) return null;

  return (
    <div className="report-viewer">
      <div className="report-header">
        <h2>{data.title}</h2>
        {data.subtitle && <p className="subtitle">{data.subtitle}</p>}
      </div>

      {/* KPIs o totales */}
      {data.kpis && (
        <div className="kpis-grid">
          {Object.entries(data.kpis).map(([key, value]) => (
            <div key={key} className="kpi-card">
              <span className="kpi-label">{key.replace(/_/g, ' ')}</span>
              <span className="kpi-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {data.totals && (
        <div className="totals-section">
          <h3>Totales</h3>
          <div className="totals-grid">
            {Object.entries(data.totals).map(([key, value]) => (
              <div key={key} className="total-item">
                <span>{key.replace(/_/g, ' ')}:</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de datos */}
      {data.rows && data.rows.length > 0 && (
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                {data.headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Alertas */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Alertas</h3>
          <ul>
            {data.alerts.map((alert, idx) => (
              <li key={idx} className="alert-item">{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Componente para Dashboard Ejecutivo
const DashboardReport = ({ data }) => {
  if (!data) return null;

  return (
    <div className="dashboard-report">
      <h2>📊 Dashboard Ejecutivo</h2>

      {/* KPIs principales */}
      {data.kpis && (
        <div className="dashboard-kpis">
          {Object.entries(data.kpis).map(([key, value]) => (
            <div key={key} className="dashboard-kpi-card">
              <span className="kpi-label">{key.replace(/_/g, ' ')}</span>
              <span className="kpi-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tops */}
      <div className="tops-grid">
        {data.top_products && (
          <div className="top-section">
            <h3>🏆 Top Productos</h3>
            <ul>
              {data.top_products.map((product, idx) => (
                <li key={idx}>
                  <strong>{product.name}</strong>
                  <span>Cantidad: {product.quantity} | Ingresos: {product.revenue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.top_customers && (
          <div className="top-section">
            <h3>👥 Top Clientes</h3>
            <ul>
              {data.top_customers.map((customer, idx) => (
                <li key={idx}>
                  <strong>{customer.username}</strong>
                  <span>Gastado: {customer.total_spent} | Órdenes: {customer.orders}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.top_categories && (
          <div className="top-section">
            <h3>📦 Top Categorías</h3>
            <ul>
              {data.top_categories.map((category, idx) => (
                <li key={idx}>
                  <strong>{category.name}</strong>
                  <span>Ingresos: {category.revenue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Alertas */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="dashboard-alerts">
          <h3>⚠️ Alertas del Sistema</h3>
          <ul>
            {data.alerts.map((alert, idx) => (
              <li key={idx} className="alert-item">{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedReportsPage;
