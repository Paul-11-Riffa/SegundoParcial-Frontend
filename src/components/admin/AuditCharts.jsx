import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styles from '../../styles/AuditCharts.module.css';

const AuditCharts = ({ statistics }) => {
  if (!statistics) return null;

  // Colores para las gráficas
  const ACTION_TYPE_COLORS = {
    AUTH: '#667eea',
    CREATE: '#10b981',
    READ: '#3b82f6',
    UPDATE: '#f59e0b',
    DELETE: '#ef4444',
    REPORT: '#8b5cf6',
    PAYMENT: '#ec4899',
    ML: '#06b6d4'
  };

  const SEVERITY_COLORS = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#ef4444'
  };

  // Preparar datos para gráfica de tipos de acción
  const actionTypeData = statistics.by_action_type?.map(item => ({
    name: item.action_type_display || item.action_type,
    value: item.count,
    color: ACTION_TYPE_COLORS[item.action_type] || '#6b7280'
  })) || [];

  // Preparar datos para gráfica de severidad
  const severityData = statistics.by_severity?.map(item => ({
    name: item.severity,
    value: item.count,
    color: SEVERITY_COLORS[item.severity] || '#6b7280'
  })) || [];

  // Preparar datos para timeline (últimos 7 días)
  const timelineData = statistics.timeline?.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    acciones: item.count
  })) || [];

  // Preparar datos para gráfica de éxito/error
  const successData = [
    { name: 'Exitosas', value: statistics.total_actions - statistics.total_errors, color: '#10b981' },
    { name: 'Errores', value: statistics.total_errors, color: '#ef4444' }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>
            {payload[0].value} acciones
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label para pie charts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // No mostrar labels menores al 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className={styles.pieLabel}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.chartsContainer}>
      <div className={styles.chartsGrid}>
        
        {/* Gráfica de Tipos de Acción */}
        {actionTypeData.length > 0 && (
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>📊 Distribución por Tipo de Acción</h3>
              <p>Análisis de las acciones más frecuentes</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={actionTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {actionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfica de Severidad */}
        {severityData.length > 0 && (
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>🎯 Distribución por Severidad</h3>
              <p>Nivel de criticidad de las acciones</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Timeline de Acciones */}
        {timelineData.length > 0 && (
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>📈 Timeline de Actividad</h3>
              <p>Evolución de acciones en el tiempo</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="acciones" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfica de Éxito vs Errores */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>✓ Tasa de Éxito</h3>
            <p>Relación entre acciones exitosas y errores</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={successData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {successData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => `${value}: ${entry.payload.value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Estadísticas Rápidas */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <h4>{statistics.total_actions?.toLocaleString() || 0}</h4>
            <p>Total de Acciones</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h4>{statistics.unique_users || 0}</h4>
            <p>Usuarios Únicos</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h4>{statistics.error_rate || '0%'}</h4>
            <p>Tasa de Error</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>🌐</div>
          <div className={styles.statContent}>
            <h4>{statistics.unique_ips || 0}</h4>
            <p>IPs Únicas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCharts;
