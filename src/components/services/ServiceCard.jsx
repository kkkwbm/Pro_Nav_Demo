import React from 'react';
import { 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2, 
  Phone,
  Wrench,
  FileText,
  User,
  Camera
} from 'lucide-react';

const ServiceCard = ({ service, onEdit, onDelete, onViewImages, isHighlighted = false }) => {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceTypeColor = (type) => {
    switch (type) {
      case 'PRZEGLAD_OKRESOWY': return { bg: '#dbeafe', color: '#1e40af' };
      case 'NAPRAWA': return { bg: '#fee2e2', color: '#991b1b' };
      case 'KONSERWACJA': return { bg: '#d1fae5', color: '#065f46' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const typeColors = getServiceTypeColor(service.serviceType);
  const fullAddress = `${service.street} ${service.houseNumber}${service.apartmentNumber ? '/' + service.apartmentNumber : ''}, ${service.postalCode} ${service.city}`;

  return (
    <div style={{
      background: isHighlighted ? '#eff6ff' : '#f9fafb',
      borderRadius: 12,
      padding: 20,
      border: isHighlighted ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      transition: 'all 0.2s',
      boxShadow: isHighlighted ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = isHighlighted ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none';
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 4,
          }}>
            {service.clientName}
          </h3>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            backgroundColor: typeColors.bg,
            color: typeColors.color,
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {service.serviceType.replace(/_/g, ' ')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onViewImages(service)}
            style={{
              padding: 8,
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
            title="Zdjęcia serwisu"
          >
            <Camera size={16} />
          </button>
          <button
            style={{
              padding: 8,
              backgroundColor: '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
            title="Edytuj serwis"
            disabled
          >
            <Edit2 size={16} />
          </button>
          <button
            style={{
              padding: 8,
              backgroundColor: '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
            title="Usuń serwis"
            disabled
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Clock size={16} color="#6b7280" />
          <span style={{ fontSize: 14, color: '#374151' }}>
            {formatTime(service.startDateTime)} - {formatTime(service.endDateTime)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Phone size={16} color="#6b7280" />
          <span style={{ fontSize: 14, color: '#374151' }}>
            {service.clientPhone}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MapPin size={16} color="#6b7280" />
          <span style={{ fontSize: 14, color: '#374151' }}>
            {fullAddress}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Wrench size={16} color="#6b7280" />
          <span style={{ fontSize: 14, color: '#374151' }}>
            {service.deviceType} - {service.deviceName}
          </span>
        </div>
        {service.technician && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <User size={16} color="#6b7280" />
            <span style={{ fontSize: 14, color: '#374151' }}>
              Technik: {service.technician}
            </span>
          </div>
        )}
        {service.notes && (
          <div style={{
            marginTop: 8,
            padding: 12,
            backgroundColor: 'white',
            borderRadius: 8,
            fontSize: 14,
            color: '#4b5563',
            borderLeft: '3px solid #3b82f6',
          }}>
            <FileText size={14} style={{ display: 'inline', marginRight: 8 }} />
            {service.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;