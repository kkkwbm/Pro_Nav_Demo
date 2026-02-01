import React from 'react';
import { Calendar, User, FileText, Edit2, Trash2, ExternalLink, CheckCircle, Clock, AlertCircle, Camera } from 'lucide-react';

const ServiceHistoryCard = ({ 
  serviceEntry, 
  onEdit, 
  onDelete, 
  onNavigateToCalendar,
  onViewImages,
  isManualEntry = false,
  canEdit = false 
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status, isManual) => {
    if (isManual) {
      return <CheckCircle size={16} color="#059669" />;
    }
    
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={16} color="#059669" />;
      case 'SCHEDULED':
        return <Clock size={16} color="#3b82f6" />;
      case 'CANCELLED':
        return <AlertCircle size={16} color="#dc2626" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusText = (status, isManual) => {
    if (isManual) return 'Wykonany';
    
    switch (status) {
      case 'COMPLETED': return 'Wykonany';
      case 'SCHEDULED': return 'Zaplanowany';
      case 'CANCELLED': return 'Anulowany';
      default: return 'Nieznany';
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'KONSERWACJA': return '#3b82f6';
      case 'NAPRAWA': return '#dc2626';
      case 'PRZEGLAD_OKRESOWY': return '#059669';
      case 'INSTALACJA': return '#7c3aed';
      case 'DIAGNOSTYKA': return '#f59e0b';
      case 'MODERNIZACJA': return '#8b5cf6';
      case 'AWARIA': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getServiceTypeText = (serviceType) => {
    switch (serviceType) {
      case 'KONSERWACJA': return 'Konserwacja';
      case 'NAPRAWA': return 'Naprawa';
      case 'PRZEGLAD_OKRESOWY': return 'Przegląd okresowy';
      case 'INSTALACJA': return 'Instalacja';
      case 'DIAGNOSTYKA': return 'Diagnostyka';
      case 'MODERNIZACJA': return 'Modernizacja';
      case 'AWARIA': return 'Awaria';
      default: return serviceType;
    }
  };

  const cardStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderLeft: `4px solid ${getServiceTypeColor(serviceEntry.serviceType)}`,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  };

  const dateStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 4,
  };

  const statusStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#6b7280',
  };

  const serviceTypeStyle = {
    display: 'inline-block',
    backgroundColor: getServiceTypeColor(serviceEntry.serviceType),
    color: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
  };

  const actionsStyle = {
    display: 'flex',
    gap: 8,
  };

  const actionButtonStyle = {
    padding: '4px 8px',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    transition: 'all 0.2s',
  };

  const detailRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
  };

  const notesStyle = {
    fontSize: 13,
    color: '#4b5563',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    border: '1px solid #e5e7eb',
  };


  return (
    <div style={cardStyle}>
      
      <div style={headerStyle}>
        <div>
          <div style={dateStyle}>
            <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />
            {formatDate(serviceEntry.serviceDate)}
          </div>
        </div>
        
        <div style={actionsStyle}>
          {/* Delete button for all service entries when user has edit permissions */}
          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(serviceEntry.id)}
              style={{
                ...actionButtonStyle,
                color: '#dc2626',
                borderColor: '#fecaca',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              title={isManualEntry ? "Usuń ręczny wpis" : "Usuń wpis serwisowy"}
            >
              <Trash2 size={12} />
              Usuń
            </button>
          )}
          
          {/* Grouped buttons: Photos, Edit, and Calendar together */}
          {(onViewImages || (canEdit && onEdit) || (!isManualEntry && serviceEntry.googleEventId && onNavigateToCalendar)) && (
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Photos button for all services */}
              {onViewImages && (
                <button
                  onClick={() => onViewImages(serviceEntry)}
                  style={{
                    ...actionButtonStyle,
                    color: '#10b981',
                    borderColor: '#a7f3d0',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d1fae5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  title="Zdjęcia serwisu"
                >
                  <Camera size={12} />
                  Zdjęcia
                </button>
              )}
              
              {/* Edit button for all services */}
              {canEdit && onEdit && (
                <button
                  onClick={() => onEdit(serviceEntry)}
                  style={{
                    ...actionButtonStyle,
                    color: '#3b82f6',
                    borderColor: '#bfdbfe',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  title="Edytuj serwis"
                >
                  <Edit2 size={12} />
                  Edytuj
                </button>
              )}
              
              {/* Calendar button for scheduled services */}
              {!isManualEntry && serviceEntry.googleEventId && onNavigateToCalendar && (
                <button
                  onClick={() => onNavigateToCalendar(serviceEntry)}
                  style={{
                    ...actionButtonStyle,
                    color: '#3b82f6',
                    borderColor: '#bfdbfe',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  title="Zobacz w kalendarzu"
                >
                  <ExternalLink size={12} />
                  Kalendarz
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={serviceTypeStyle}>
        {getServiceTypeText(serviceEntry.serviceType)}
      </div>

      {serviceEntry.technician && (
        <div style={detailRowStyle}>
          <User size={14} />
          <span>Technik: {serviceEntry.technician}</span>
        </div>
      )}

      {serviceEntry.notes && (
        <div style={notesStyle}>
          <strong>Notatki:</strong> {serviceEntry.notes}
        </div>
      )}

      {serviceEntry.createdBy && (
        <div style={{
          fontSize: 11,
          color: '#9ca3af',
          marginTop: 8,
          textAlign: 'right',
        }}>
          Utworzono przez: {serviceEntry.createdBy}
          {serviceEntry.createdAt && (
            <> • {formatDate(serviceEntry.createdAt)}</>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceHistoryCard;