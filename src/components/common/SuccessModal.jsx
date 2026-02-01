import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
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
    padding: 48,
    maxWidth: 480,
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    position: 'relative',
    animation: 'slideUp 0.3s ease-out',
  };

  const iconContainerStyle = {
    width: 80,
    height: 80,
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 12,
  };

  const messageStyle = {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: 32,
  };

  const buttonStyle = {
    padding: '14px 32px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
  };

  const handleButtonHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.backgroundColor = '#2563eb';
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
    } else {
      e.target.style.backgroundColor = '#3b82f6';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
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
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconContainerStyle}>
          <CheckCircle size={48} color="#16a34a" strokeWidth={2} />
        </div>
        <h2 style={titleStyle}>{title}</h2>
        <p style={messageStyle}>{message}</p>
        <button
          style={buttonStyle}
          onClick={onClose}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
        >
          OK, rozumiem
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
