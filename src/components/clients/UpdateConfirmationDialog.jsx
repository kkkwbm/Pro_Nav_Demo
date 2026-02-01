import React from 'react';

const UpdateConfirmationDialog = ({ showUpdateConfirm, onConfirm, onCancel }) => {
  if (!showUpdateConfirm) return null;

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
      zIndex: 3000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 24,
        maxWidth: 500,
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px 0' }}>
          Potwierdź aktualizację terminu przeglądu
        </h3>
        
        <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f9fafb', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            {showUpdateConfirm.deviceInfo.deviceType}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
            {showUpdateConfirm.deviceInfo.address}
          </div>
          <div style={{ fontSize: 14 }}>
            <span style={{ color: '#6b7280' }}>Obecny termin: </span>
            <span style={{ fontWeight: 600 }}>
              {new Date(showUpdateConfirm.currentDate).toLocaleDateString('pl-PL')}
            </span>
          </div>
          <div style={{ fontSize: 14 }}>
            <span style={{ color: '#6b7280' }}>Nowy termin: </span>
            <span style={{ fontWeight: 600, color: '#10b981' }}>
              {new Date(showUpdateConfirm.newDate).toLocaleDateString('pl-PL')}
            </span>
            <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>
              (+{showUpdateConfirm.intervalText})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Potwierdź aktualizację
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConfirmationDialog;