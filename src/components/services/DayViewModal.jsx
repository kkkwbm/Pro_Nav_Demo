import React from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import ServiceCard from './ServiceCard';

const DayViewModal = ({ 
  date, 
  services = [], 
  onClose, 
  onAddService, 
  onEditService, 
  onDeleteService,
  onViewImages,
  highlightServiceId = null 
}) => {
  if (!date) return null;

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
        borderRadius: 16,
        width: '90%',
        maxWidth: 800,
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          padding: 24,
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
              {date.toLocaleDateString('pl-PL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
              {services.length} {services.length === 1 ? 'serwis' : 'serwisów'} zaplanowanych
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
        }}>
          {services.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 60,
              color: '#9ca3af',
            }}>
              <Calendar size={48} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: 16, marginBottom: 24 }}>
                Brak zaplanowanych serwisów na ten dzień
              </p>
              <button
                onClick={onAddService}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Plus size={18} />
                Zaplanuj pierwszy serwis
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => onEditService(service)}
                  onDelete={() => onDeleteService(service)}
                  onViewImages={() => onViewImages(service)}
                  isHighlighted={highlightServiceId && service.id.toString() === highlightServiceId.toString()}
                />
              ))}
            </div>
          )}
        </div>

        {services.length > 0 && (
          <div style={{
            padding: 20,
            borderTop: '1px solid #e5e7eb',
          }}>
            <button
              onClick={onAddService}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Plus size={18} />
              Dodaj kolejny serwis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayViewModal;