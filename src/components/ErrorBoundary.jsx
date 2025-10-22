import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#dc2626' }}>⚠️ Algo salió mal</h1>
          <details style={{ 
            whiteSpace: 'pre-wrap',
            background: '#fef2f2',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Ver detalles del error
            </summary>
            <p style={{ marginTop: '10px', color: '#991b1b' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <p style={{ color: '#7f1d1d', fontSize: '14px' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </p>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
