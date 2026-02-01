import React from 'react';
import { Plus, Phone, Edit2, Trash2 } from 'lucide-react';
import DeviceCard from './DeviceCard';
import SMSHistory from './SMSHistory';
import ServiceHistoryByDevice from './ServiceHistoryByDevice';

const ClientCard = ({
  client,
  onAddDevice,
  onSendSMS,
  onExtendInspection,
  onCreateService,
  onEditDevice,
  onDeleteDevice,
  onEditClient, // Add edit client handler
  onDeleteClient, // Add delete client handler
  expandedSMSHistory,
  onToggleSMSHistory,
  expandedServiceHistory,
  onToggleServiceHistory,
  onNavigateToCalendar,
  onViewImages,
  onDeviceUpdate, // Add callback to refresh device data
  isHighlighted, // Add this prop for navigation highlighting
  canEdit = false // Add canEdit prop for service history permissions
}) => {
  const clientCardStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: isHighlighted ? '0 0 0 3px #3b82f6' : '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  };

  const clientHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid #f3f4f6',
  };

  const clientInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  };

  const deviceGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 16,
  };

  const addButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
  };

  const editButtonStyle = {
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    transition: 'background-color 0.2s',
  };

  const deleteButtonStyle = {
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.6,
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  };

  return (
    <div 
      style={clientCardStyle}
      id={`client-${client.id}`} // Add ID for scrolling to element
    >
      <div style={clientHeaderStyle}>
        <div style={clientInfoStyle}>
          <div>
            <div style={{ 
              fontSize: 12, 
              color: '#9ca3af', 
              fontWeight: 500,
              marginBottom: 2,
              letterSpacing: 0.5
            }}>
              ID - {client.id}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 4 }}>
              {client.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280' }}>
              <Phone size={16} />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>
        
        <div style={buttonGroupStyle}>
          <button
            onClick={() => onAddDevice(client.id)}
            style={addButtonStyle}
          >
            <Plus size={16} />
            Dodaj urządzenie
          </button>

          {onEditClient && (
            <button
              onClick={() => onEditClient(client)}
              style={editButtonStyle}
              title="Edytuj dane klienta"
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              <Edit2 size={16} />
              Edytuj
            </button>
          )}
          
          {onDeleteClient && (
            <button
              style={deleteButtonStyle}
              title="Usuń klienta"
              disabled
            >
              <Trash2 size={16} />
              Usuń
            </button>
          )}
        </div>
      </div>

      <div style={deviceGridStyle}>
        {(client.devices && client.devices.length > 0) ? (
          client.devices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              client={client}
              onSendSMS={onSendSMS}
              onExtendInspection={onExtendInspection}
              onCreateService={onCreateService}
              onEditDevice={onEditDevice}
              onDeleteDevice={onDeleteDevice}
            />
          ))
        ) : (
          <div style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            gridColumn: '1 / -1'
          }}>
            <div style={{ marginBottom: '8px', fontSize: '16px' }}>
              📱 Brak urządzeń
            </div>
            <div>
              Ten klient nie ma jeszcze dodanych urządzeń.
            </div>
          </div>
        )}
      </div>

      {/* Service History Sections for each device */}
      {(client.devices && client.devices.length > 0) && 
        client.devices.map(device => (
          <ServiceHistoryByDevice
            key={`service-history-${device.id}`}
            device={device}
            client={client}
            canEdit={canEdit}
            isExpanded={expandedServiceHistory[device.id]}
            onToggle={() => onToggleServiceHistory(device.id)}
            onNavigateToCalendar={onNavigateToCalendar}
            onViewImages={onViewImages}
            onDeviceUpdate={onDeviceUpdate}
          />
        ))
      }

      <SMSHistory
        client={client}
        isExpanded={expandedSMSHistory[client.id]}
        onToggle={() => onToggleSMSHistory(client.id)}
      />
    </div>
  );
};

export default ClientCard;