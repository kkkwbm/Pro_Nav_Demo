import React from 'react';
import { Camera, X } from 'lucide-react';

const DeviceImages = ({ deviceId, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 4000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        width: '90%',
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header */}
        <div style={{
          padding: 20,
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            Zdjęcia protokołów i dokumentów z serwisów
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: 40,
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <Camera size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>
            Tutaj znajdują się wszystkie zdjęcia danego urządzenia oraz jego dokumentów
          </p>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>
            W pełnej wersji aplikacji możesz dodawać i przeglądać zdjęcia protokołów serwisowych
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceImages;
