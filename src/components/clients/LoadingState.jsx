import React from 'react';

const LoadingState = ({ debugInfo, showDebugInfo }) => {
  const pageStyle = {
    padding: '20px',
    minHeight: '100%',
    backgroundColor: '#f9fafb',
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      ...pageStyle,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 16
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{ color: '#6b7280', fontSize: 16 }}>
        Ładowanie klientów...
      </div>
      {debugInfo && showDebugInfo && (
        <div style={{
          fontSize: 12,
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          padding: 8,
          borderRadius: 4,
          maxWidth: 400
        }}>
          Auth Status: {debugInfo.isAuthenticated ? '✅' : '❌'} |
          Token: {debugInfo.hasToken ? '✅' : '❌'} |
          User: {debugInfo.hasUser ? '✅' : '❌'}
        </div>
      )}
    </div>
  );
};

export default LoadingState;