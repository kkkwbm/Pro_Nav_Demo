import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ error, onRetry }) => {
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f3ef',
    padding: '20px',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: 16
        }}>
          <AlertCircle size={48} color="#c0392b" />
          <div style={{ fontSize: 18, fontWeight: 600, color: '#c0392b' }}>
            Błąd ładowania danych
          </div>
          <div style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            {error}
          </div>
          <button
            onClick={onRetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(230, 126, 34, 0.3)',
            }}
          >
            <RefreshCw size={16} />
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;