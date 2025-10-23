import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import styles from '../../styles/AdminDashboard.module.css';

const PERIOD_COLORS = {
  '7d': '#3B82F6',   // Azul
  '14d': '#8B5CF6',  // Púrpura
  '30d': '#10B981',  // Verde
  '90d': '#F59E0B'   // Naranja
};

function SalesPredictionChart({ data, period }) {
  if (!data) return null;

  const chartData = data.daily_chart || data.daily_predictions || [];
  const summary = data.summary || data;

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const formatGrowthRate = (rate) => {
    if (!rate && rate !== 0) return 'N/A';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h2>Predicción de Ventas - {data.period_label}</h2>
        <div className={styles.chartStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total:</span>
            <span className={styles.statValue}>
              ${summary.total_sales?.toLocaleString() || '0'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Promedio Diario:</span>
            <span className={styles.statValue}>
              ${summary.average_daily?.toLocaleString() || '0'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Crecimiento:</span>
            <span 
              className={styles.statValue}
              style={{ 
                color: summary.growth_rate >= 0 ? '#10B981' : '#EF4444' 
              }}
            >
              {formatGrowthRate(summary.growth_rate)}
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`colorValue-${period}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PERIOD_COLORS[period]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={PERIOD_COLORS[period]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={formatDate}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas Predichas']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          
          {/* Área de confianza si está disponible */}
          {chartData[0]?.upper_bound && (
            <>
              <Area
                type="monotone"
                dataKey="upper_bound"
                stroke="none"
                fill={`${PERIOD_COLORS[period]}20`}
                name="Límite Superior"
              />
              <Area
                type="monotone"
                dataKey="lower_bound"
                stroke="none"
                fill={`${PERIOD_COLORS[period]}20`}
                name="Límite Inferior"
              />
            </>
          )}
          
          <Area
            type="monotone"
            dataKey="value"
            stroke={PERIOD_COLORS[period]}
            strokeWidth={3}
            fill={`url(#colorValue-${period})`}
            name="Ventas Predichas"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesPredictionChart;
