import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';

const ServiceUpdateModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  device,
  inspectionInterval = 12 
}) => {
  const [formData, setFormData] = useState({
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: ''
  });

  // Calculate default next service date when component opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const nextDate = new Date(today);
      nextDate.setMonth(nextDate.getMonth() + inspectionInterval);
      
      setFormData({
        serviceDate: today.toISOString().split('T')[0],
        nextServiceDate: nextDate.toISOString().split('T')[0]
      });
    }
  }, [isOpen, inspectionInterval]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

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
    zIndex: 3000,
  };

  const modalStyle = {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 500,
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  };

  const titleStyle = {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    color: '#374151',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
  };

  const deviceInfoStyle = {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #e5e7eb',
  };

  const formRowStyle = {
    marginBottom: 16,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    color: '#374151',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: 12,
    marginTop: 20,
  };

  const primaryButtonStyle = {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.6,
  };

  const secondaryButtonStyle = {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>Aktualizacja przeglądu</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {/* Device Info */}
        <div style={deviceInfoStyle}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {device?.deviceType}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            {device?.deviceName && `${device.deviceName} • `}
            {device?.address}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formRowStyle}>
            <label style={labelStyle}>
              <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} />
              Data przeprowadzenia serwisu *
            </label>
            <input
              type="date"
              value={formData.serviceDate}
              onChange={(e) => handleInputChange('serviceDate', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>
              <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} />
              Następny serwis *
            </label>
            <input
              type="date"
              value={formData.nextServiceDate}
              onChange={(e) => handleInputChange('nextServiceDate', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{
            fontSize: 12,
            color: '#6b7280',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '8px 12px',
            backgroundColor: '#f9fafb',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            marginBottom: 16,
          }}>
            Domyślny interwał serwisowy: {inspectionInterval} miesięcy
          </div>

          <div style={buttonGroupStyle}>
            <button type="submit" style={primaryButtonStyle} disabled>
              <CheckCircle size={16} />
              Potwierdź aktualizację
            </button>
            <button type="button" onClick={onClose} style={secondaryButtonStyle}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceUpdateModal;