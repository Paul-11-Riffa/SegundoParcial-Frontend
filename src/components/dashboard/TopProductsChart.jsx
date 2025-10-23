import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import styles from '../../styles/AdminDashboard.module.css';

const RANK_COLORS = {
  1: '#FFD700', // Oro
  2: '#C0C0C0', // Plata
  3: '#CD7F32', // Bronce
  default: '#3B82F6' // Azul
};

const STOCK_STATUS_BADGES = {
  'CRITICAL': { color: '#DC2626', label: 'Crítico', icon: '🔴' },
  'WARNING': { color: '#F59E0B', label: 'Bajo', icon: '⚠️' },
  'CAUTION': { color: '#FBBF24', label: 'Moderado', icon: '⚡' },
  'OK': { color: '#10B981', label: 'OK', icon: '✅' }
};

function StockBadge({ status, stock }) {
  const badge = STOCK_STATUS_BADGES[status] || STOCK_STATUS_BADGES['OK'];
  
  return (
    <div 
      className={styles.stockBadge}
      style={{ 
        backgroundColor: `${badge.color}20`,
        color: badge.color 
      }}
    >
      <span>{badge.icon}</span>
      <span>{stock}</span>
    </div>
  );
}

function TopProductsChart({ data, period }) {
  if (!data || !data.products) return null;

  const chartData = data.products.slice(0, 5).map(product => ({
    name: product.name || product.product_name,
    value: product.predicted_sales,
    rank: product.rank
  }));

  const getRankColor = (rank) => RANK_COLORS[rank] || RANK_COLORS.default;

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h2>Top Productos Más Vendidos - {data.period_label}</h2>
        <div className={styles.chartStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Unidades:</span>
            <span className={styles.statValue}>
              {data.period_summary?.total_predicted_sales?.toFixed(1) || 'N/A'}
            </span>
          </div>
          {data.period_summary?.products_with_low_stock > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>⚠️ Stock Bajo:</span>
              <span className={styles.statValue} style={{ color: '#F59E0B' }}>
                {data.period_summary.products_with_low_stock} productos
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Barras */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={150}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(value) => `${value.toFixed(1)} unidades`} />
          <Bar dataKey="value" name="Unidades Predichas">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRankColor(entry.rank)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Tabla Detallada */}
      <div className={styles.productsTable}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Producto</th>
              <th>Unidades</th>
              <th>Crecimiento</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => {
              const name = product.name || product.product_name;
              const category = product.category;
              
              return (
                <tr key={product.product_id}>
                  <td>
                    <div className={styles.rankCell}>
                      {product.rank === 1 && <span className={styles.rankIcon}>🥇</span>}
                      {product.rank === 2 && <span className={styles.rankIcon}>🥈</span>}
                      {product.rank === 3 && <span className={styles.rankIcon}>🥉</span>}
                      <span>#{product.rank}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productName}>{name}</div>
                      {category && (
                        <div className={styles.productCategory}>{category}</div>
                      )}
                    </div>
                  </td>
                  <td>{product.predicted_sales.toFixed(1)}</td>
                  <td>
                    <span 
                      className={styles.growthBadge}
                      style={{ 
                        color: product.growth_rate >= 0 ? '#10B981' : '#EF4444' 
                      }}
                    >
                      {product.growth_rate >= 0 ? '↗' : '↘'} {Math.abs(product.growth_rate).toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <StockBadge 
                      status={product.stock_status} 
                      stock={product.current_stock} 
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProductsChart;
