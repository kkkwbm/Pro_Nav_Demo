import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessPopup = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '16px 20px',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: 400,
      border: '1px solid #a7f3d0',
    }}>
      <CheckCircle size={20} />
      <span style={{ fontSize: 14, fontWeight: 500 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          color: '#065f46',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SuccessPopup;