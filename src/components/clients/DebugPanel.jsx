import React from 'react';

const DebugPanel = ({ debugInfo, onClose }) => {
  if (!debugInfo) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: 16,
      borderRadius: 8,
      fontSize: 12,
      zIndex: 9999,
      maxWidth: 300
    }}>
      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Auth Debug Panel</div>
      <div>Authenticated: {debugInfo.isAuthenticated ? '✅' : '❌'}</div>
      <div>Has Token: {debugInfo.hasToken ? '✅' : '❌'}</div>
      <div>Has User: {debugInfo.hasUser ? '✅' : '❌'}</div>
      <div>Roles: {debugInfo.userRoles.join(', ') || 'None'}</div>
      <div>Is Admin: {debugInfo.isAdmin ? '✅' : '❌'}</div>
      <button
        onClick={onClose}
        style={{
          marginTop: 8,
          padding: '4px 8px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontSize: 10,
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

export default DebugPanel;