import React from 'react';

const LoadingState = () => {
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
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #e67e22',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: 16, color: '#6b7280' }}>
            Ładowanie historii SMS...
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;