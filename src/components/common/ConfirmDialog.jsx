import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Potwierdź', cancelText = 'Anuluj', danger = false }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease-out',
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    maxWidth: 440,
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    animation: 'slideUp 0.3s ease-out',
  };

  const iconContainerStyle = {
    width: 64,
    height: 64,
    backgroundColor: danger ? '#fef2f2' : '#eff6ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  };

  const titleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  };

  const messageStyle = {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: 28,
    textAlign: 'center',
  };

  const buttonRowStyle = {
    display: 'flex',
    gap: 12,
  };

  const buttonBaseStyle = {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const cancelButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  const confirmButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: danger ? '#ef4444' : '#3b82f6',
    color: 'white',
  };

  const handleCancelHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.backgroundColor = '#e5e7eb';
    } else {
      e.target.style.backgroundColor = '#f3f4f6';
    }
  };

  const handleConfirmHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.backgroundColor = danger ? '#dc2626' : '#2563eb';
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = danger
        ? '0 4px 12px rgba(239, 68, 68, 0.4)'
        : '0 4px 12px rgba(59, 130, 246, 0.4)';
    } else {
      e.target.style.backgroundColor = danger ? '#ef4444' : '#3b82f6';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconContainerStyle}>
          <AlertTriangle size={32} color={danger ? '#ef4444' : '#3b82f6'} strokeWidth={2} />
        </div>
        <h2 style={titleStyle}>{title}</h2>
        <p style={messageStyle}>{message}</p>
        <div style={buttonRowStyle}>
          <button
            style={cancelButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => handleCancelHover(e, true)}
            onMouseLeave={(e) => handleCancelHover(e, false)}
          >
            {cancelText}
          </button>
          <button
            style={confirmButtonStyle}
            onClick={handleConfirm}
            onMouseEnter={(e) => handleConfirmHover(e, true)}
            onMouseLeave={(e) => handleConfirmHover(e, false)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
