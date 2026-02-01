import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Wrench, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import ServiceHistoryList from './ServiceHistoryList';
import ServiceForm from './ServiceForm';
import { useServiceHistory } from '../../hooks/useServiceHistory';
import { useNotification } from '../../contexts/NotificationContext';

const ServiceHistoryByDevice = ({ device, client, canEdit = false, isExpanded, onToggle, onNavigateToCalendar, onViewImages, onDeviceUpdate }) => {
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const notification = useNotification();

  // Create callback to refresh device data after service creation
  const handleDeviceUpdate = async (deviceId) => {
    if (onDeviceUpdate) {
      await onDeviceUpdate(deviceId);
    }
  };

  const {
    serviceHistory,
    loading,
    error,
    actions
  } = useServiceHistory(device?.id, handleDeviceUpdate);

  // Show notification when service history fails to load
  useEffect(() => {
    if (error) {
      notification.showError('Nie udało się załadować historii serwisów');
    }
  }, [error, notification]);

  // Handle manual entry operations
  const handleAddManualEntry = async (data) => {
    try {
      const result = await actions.addManualEntry(data);
      setShowManualForm(false);
      setEditingEntry(null);
      
      // Return the result so ServiceForm can get the service ID for photo uploads
      return result;
    } catch (error) {
      console.error('Error adding manual entry:', error);
      throw error;
    }
  };

  const handleEditManualEntry = async (data) => {
    try {
      await actions.updateManualEntry(editingEntry.id, data);
      setShowManualForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating manual entry:', error);
      throw error;
    }
  };

  const handleDeleteManualEntry = async (entryId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten wpis serwisowy? Ta operacja nie może zostać cofnięta.')) {
      try {
        await actions.deleteManualEntry(entryId);
      } catch (error) {
        console.error('Error deleting manual entry:', error);
        alert('Błąd podczas usuwania wpisu');
      }
    }
  };

  const handleDeleteService = async (serviceId, isManualEntry) => {
    const confirmMessage = isManualEntry 
      ? 'Czy na pewno chcesz usunąć ten ręczny wpis serwisowy? Ta operacja nie może zostać cofnięta.'
      : 'Czy na pewno chcesz usunąć ten wpis serwisowy? Ta operacja nie może zostać cofnięta.';
      
    if (window.confirm(confirmMessage)) {
      try {
        await actions.deleteService(serviceId, isManualEntry);
        notification.showSuccess('Wpis serwisowy został pomyślnie usunięty');
      } catch (error) {
        console.error('Error deleting service:', error);
        notification.showError('Błąd podczas usuwania wpisu serwisowego');
      }
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowManualForm(true);
  };




  const getServiceTypeText = (serviceType) => {
    const types = {
      'KONSERWACJA': 'Konserwacja',
      'NAPRAWA': 'Naprawa', 
      'PRZEGLAD_OKRESOWY': 'Przegląd okresowy',
      'INSTALACJA': 'Instalacja',
      'DIAGNOSTYKA': 'Diagnostyka',
      'MODERNIZACJA': 'Modernizacja',
      'AWARIA': 'Awaria'
    };
    return types[serviceType] || serviceType;
  };

  const getStatusText = (status, isManual) => {
    if (isManual) return 'Wykonany';
    const statuses = {
      'COMPLETED': 'Wykonany',
      'SCHEDULED': 'Zaplanowany', 
      'CANCELLED': 'Anulowany'
    };
    return statuses[status] || 'Nieznany';
  };

  // Get summary info for collapsed view
  const getSummaryInfo = () => {
    if (loading) return 'Ładowanie...';
    if (error) return 'Błąd';
    if (serviceHistory.length === 0) return 'Brak historii';
    
    const lastService = serviceHistory.find(entry => entry.status === 'COMPLETED');
    const count = serviceHistory.length;
    const lastServiceText = lastService 
      ? new Date(lastService.serviceDate).toLocaleDateString('pl-PL')
      : 'Brak';
    
    return `${count} wpisów • Ostatni: ${lastServiceText}`;
  };

  // Main container style matching SMS history
  const containerStyle = {
    marginTop: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.2s',
  };

  const headerContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  };

  const deviceInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const deviceNameStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
  };

  const summaryStyle = {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const actionButtonStyle = {
    padding: '4px 8px',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.2s',
  };

  const expandButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    color: '#6b7280',
    transition: 'color 0.2s',
  };

  const contentStyle = {
    backgroundColor: 'white',
  };

  if (!device) {
    return null;
  }

  return (
    <>
      <div style={containerStyle}>
        <div 
          style={headerStyle}
          onClick={onToggle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
        >
          <div style={headerContentStyle}>
            <div style={deviceInfoStyle}>
              <Wrench size={16} color="#6b7280" />
              <span style={deviceNameStyle}>
                {device.deviceType}
                {device.deviceName && ` (${device.deviceName})`}
              </span>
            </div>
            
            <div style={summaryStyle}>
              Historia serwisów: {getSummaryInfo()}
            </div>
          </div>

          <div style={actionsStyle}>
            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowManualForm(true);
                }}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  borderColor: '#22c55e',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#16a34a';
                  e.target.style.borderColor = '#16a34a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#22c55e';
                  e.target.style.borderColor = '#22c55e';
                }}
                onMouseDown={(e) => {
                  e.target.style.backgroundColor = '#15803d';
                  e.target.style.borderColor = '#15803d';
                }}
                onMouseUp={(e) => {
                  e.target.style.backgroundColor = '#22c55e';
                  e.target.style.borderColor = '#22c55e';
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#22c55e';
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.outline = '2px solid #bbf7d0';
                  e.target.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#22c55e';
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.outline = 'none';
                }}
                title="Dodaj ręczny wpis serwisowy"
              >
                <Plus size={12} />
                Dodaj
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                actions.refresh();
              }}
              style={actionButtonStyle}
              title="Odśwież historię"
              disabled={loading}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>

            <button style={expandButtonStyle}>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div style={contentStyle}>
            {error ? (
              <div style={{
                padding: 20,
                textAlign: 'center',
                color: '#dc2626',
                fontSize: 14,
              }}>
                <AlertCircle size={20} style={{ marginBottom: 8 }} />
                <div>Błąd podczas ładowania historii serwisów</div>
                <div style={{ fontSize: 12, marginTop: 4, color: '#6b7280' }}>{error}</div>
              </div>
            ) : (
              <ServiceHistoryList
                serviceHistory={serviceHistory}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDeleteService}
                onNavigateToCalendar={onNavigateToCalendar}
                onViewImages={onViewImages}
                canEdit={canEdit}
              />
            )}
          </div>
        )}
      </div>

      {showManualForm && (
        <ServiceForm
          device={device}
          client={client}
          serviceEntry={editingEntry}
          onSave={editingEntry ? handleEditManualEntry : handleAddManualEntry}
          onCancel={() => {
            setShowManualForm(false);
            setEditingEntry(null);
          }}
          loading={loading}
        />
      )}
    </>
  );
};

export default ServiceHistoryByDevice;