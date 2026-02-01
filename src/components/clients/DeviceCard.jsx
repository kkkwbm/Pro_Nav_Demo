import React, { useState } from 'react';
import { Edit2, Trash2, Send, RotateCcw, MapPin, Calendar, Wrench, Camera, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { getInspectionPeriod } from '@/services/utils/clientUtils';
import DeviceImages from './DeviceImages';

const DeviceCard = ({ device, client, onSendSMS, onExtendInspection, onCreateService, onEditDevice, onDeleteDevice }) => {
  const [showImages, setShowImages] = useState(false);

  const getInspectionStatusColor = (date) => {
    const period = getInspectionPeriod(date);
    switch (period) {
      case 'overdue': return '#991b1b';
      case 'urgent': return '#dc2626';
      case 'soon': return '#ea580c';
      default: return '#059669';
    }
  };

  const getInspectionStatusText = (date) => {
    const period = getInspectionPeriod(date);
    switch (period) {
      case 'overdue': return 'Przeterminowany';
      case 'urgent': return 'Pilny';
      case 'soon': return 'Wkrótce';
      default: return 'OK';
    }
  };

  // Check if confirmation is still valid
  // Primarily relies on backend calculation (serviceConfirmationValid)
  // but provides client-side validation as fallback
  const isConfirmationValid = () => {
    if (!device.serviceConfirmed) return false;

    // If backend provides serviceConfirmationValid, use it
    if (device.serviceConfirmationValid !== undefined) {
      return device.serviceConfirmationValid;
    }

    // Fallback: Check if confirmation is within 72 hours
    if (device.serviceConfirmedAt) {
      const confirmedDate = new Date(device.serviceConfirmedAt);
      const now = new Date();
      const hoursSinceConfirmation = (now - confirmedDate) / (1000 * 60 * 60);

      // Confirmation is valid for 72 hours after it was confirmed
      return hoursSinceConfirmation <= 72;
    }

    return true;
  };

  const getMaintenanceConfirmationIcon = () => {
    if (!device.serviceConfirmed) {
      return <XCircle size={16} color="#dc2626" />;
    } else if (isConfirmationValid()) {
      return <CheckCircle size={16} color="#059669" />;
    } else {
      return <Clock size={16} color="#f59e0b" />;
    }
  };

  const getMaintenanceConfirmationText = () => {
    if (!device.serviceConfirmed) {
      return 'Nie potwierdzono';
    } else if (isConfirmationValid()) {
      return 'Potwierdzono';
    } else {
      return 'Wygasło';
    }
  };

  const getMaintenanceConfirmationColor = () => {
    if (!device.serviceConfirmed) {
      return '#dc2626';
    } else if (isConfirmationValid()) {
      return '#059669';
    } else {
      return '#f59e0b';
    }
  };

  const handleDeleteDevice = () => {
    const deviceInfo = `${device.deviceType}${device.deviceName ? ` (${device.deviceName})` : ''}`;
    const confirmMessage = `Czy na pewno chcesz usunąć urządzenie "${deviceInfo}" klienta ${client.name}?\n\nAdres: ${device.address}`;
    
    if (window.confirm(confirmMessage)) {
      onDeleteDevice(device.id);
    }
  };

  const deviceCardStyle = {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    position: 'relative',
  };

  const deviceActionsStyle = {
    position: 'absolute',
    top: 12,
    right: 12,
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  };

  const actionButtonStyle = {
    padding: 6,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
  };

  // Determine if SMS button should be highlighted
  const shouldHighlightSMS = !device.serviceConfirmed || !isConfirmationValid();

  return (
    <>
      <div style={deviceCardStyle}>
        <div style={deviceActionsStyle}>
          <button
            onClick={() => setShowImages(true)}
            style={{
              ...actionButtonStyle,
              backgroundColor: '#8b5cf6',
              color: 'white',
              position: 'relative',
            }}
            title="Zobacz zdjęcia"
          >
            <Camera size={12} />
            {device.imageCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: 10,
                borderRadius: '50%',
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
                {device.imageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSendSMS(client, device)}
            style={{
              ...actionButtonStyle,
              backgroundColor: shouldHighlightSMS ? '#3b82f6' : '#10b981',
              color: 'white',
              animation: shouldHighlightSMS ? 'pulse 2s infinite' : 'none',
            }}
            title={shouldHighlightSMS ? 'Wyślij SMS z przypomnieniem (nie potwierdzono)' : 'Wyślij SMS'}
          >
            <Send size={12} />
          </button>
          <button
            onClick={() => onExtendInspection(device.id)}
            style={{
              ...actionButtonStyle,
              backgroundColor: '#f59e0b',
              color: 'white',
            }}
            title="Przesuń przegląd"
          >
            <RotateCcw size={12} />
          </button>
          {onCreateService && (
            <button
              onClick={() => onCreateService(device)}
              style={{
                ...actionButtonStyle,
                backgroundColor: '#10b981',
                color: 'white',
              }}
              title="Utwórz serwis"
            >
              <Plus size={12} />
            </button>
          )}
          <button
            onClick={() => onEditDevice(device, client.id)}
            style={{
              ...actionButtonStyle,
              backgroundColor: '#3b82f6',
              color: 'white',
            }}
            title="Edytuj urządzenie"
          >
            <Edit2 size={12} />
          </button>
          <button
            style={{
              ...actionButtonStyle,
              backgroundColor: '#9ca3af',
              color: 'white',
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
            title="Usuń urządzenie"
            disabled
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div style={{ marginBottom: 12, paddingRight: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Wrench size={16} color="#6b7280" />
            <span style={{ fontWeight: 600 }}>{device.deviceType}</span>
            {device.imageCount > 0 && (
              <span style={{
                fontSize: 11,
                color: '#8b5cf6',
                backgroundColor: '#f3e8ff',
                padding: '2px 8px',
                borderRadius: 12,
                fontWeight: 500,
              }}>
                {device.imageCount} {device.imageCount === 1 ? 'zdjęcie' : device.imageCount < 5 ? 'zdjęcia' : 'zdjęć'}
              </span>
            )}
          </div>
          {device.deviceName && (
            <div style={{ fontSize: 14, color: '#6b7280', marginLeft: 24 }}>
              {device.deviceName}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <MapPin size={16} color="#6b7280" />
          <span style={{ fontSize: 14 }}>{device.address}</span>
        </div>

        {device.installationDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Calendar size={16} color="#6b7280" />
            <span style={{ fontSize: 14 }}>
              Data instalacji: {new Date(device.installationDate).toLocaleDateString('pl-PL')}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Calendar size={16} color="#6b7280" />
          <span style={{ fontSize: 14 }}>
            Przegląd: {new Date(device.nextInspectionDate).toLocaleDateString('pl-PL')}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: getInspectionStatusColor(device.nextInspectionDate),
              backgroundColor: `${getInspectionStatusColor(device.nextInspectionDate)}20`,
              padding: '2px 8px',
              borderRadius: 12,
            }}
          >
            {getInspectionStatusText(device.nextInspectionDate)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {getMaintenanceConfirmationIcon()}
          <span style={{ fontSize: 14 }}>
            Potwierdzenie serwisu: 
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: getMaintenanceConfirmationColor(),
              backgroundColor: `${getMaintenanceConfirmationColor()}20`,
              padding: '2px 8px',
              borderRadius: 12,
            }}
          >
            {getMaintenanceConfirmationText()}
          </span>
          {device.serviceConfirmed && device.serviceConfirmedAt && (
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              ({new Date(device.serviceConfirmedAt).toLocaleDateString('pl-PL')})
            </span>
          )}
        </div>

        {/* Show confirmation token info if available (for debugging) */}
        {device.lastConfirmationToken && (
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
            Token: ...{device.lastConfirmationToken.slice(-8)}
          </div>
        )}

        {device.notes && (
          <div style={{
            fontSize: 14,
            color: '#6b7280',
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 4,
            marginTop: 8,
          }}>
            {device.notes}
          </div>
        )}

        {device.lastSMS && (
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
            Ostatni SMS: {new Date(device.lastSMS).toLocaleDateString('pl-PL')}
          </div>
        )}
      </div>

      {/* Add pulse animation style */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Device Images Modal */}
      <DeviceImages
        deviceId={device.id}
        isOpen={showImages}
        onClose={() => setShowImages(false)}
      />

    </>
  );
};

export default DeviceCard;