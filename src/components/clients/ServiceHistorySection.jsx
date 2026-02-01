import React, { useState, useEffect } from 'react';
import { Plus, History, BarChart3, RefreshCw, Calendar } from 'lucide-react';
import { useServiceHistory } from '../../hooks/useServiceHistory';
import { useNotification } from '../../contexts/NotificationContext';
import ServiceHistoryList from './ServiceHistoryList';
import ServiceForm from './ServiceForm';

const ServiceHistorySection = ({ 
  device, 
  canEdit = false,
  initiallyExpanded = false,
  onNavigateToCalendar,
  onViewImages
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'scheduled'
  const notification = useNotification();

  const {
    serviceHistory,
    stats,
    loading,
    error,
    actions
  } = useServiceHistory(device?.id);

  // Show notification when service history fails to load
  useEffect(() => {
    if (error) {
      // Show specific error message from backend
      notification.showError(error || 'Nie udało się załadować historii serwisów');
    }
  }, [error, notification]);

  // Handle manual entry operations
  const handleAddManualEntry = async (data) => {
    try {
      await actions.addManualEntry(data);
      setShowManualForm(false);
      setEditingEntry(null);
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

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowManualForm(true);
  };




  const getServiceTypeText = (serviceType) => {
    const types = {
      'MAINTENANCE': 'Konserwacja',
      'REPAIR': 'Naprawa', 
      'INSPECTION': 'Przegląd',
      'INSTALLATION': 'Instalacja',
      'CONSULTATION': 'Konsultacja'
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

  // Filter service history by active tab
  const filteredHistory = serviceHistory.filter(entry => {
    switch (activeTab) {
      case 'scheduled':
        return !entry.isManualEntry;
      default:
        return true;
    }
  });

  const sectionStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    marginTop: 16,
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
  };

  const badgeStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    minWidth: 20,
    textAlign: 'center',
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
    color: isActive ? '#3b82f6' : '#6b7280',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.2s',
  });

  const statsStyle = {
    display: 'flex',
    gap: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 12,
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#6b7280',
  };

  if (!device) {
    return null;
  }

  return (
    <>
      <div style={sectionStyle}>
        <div 
          style={{
            ...headerStyle,
            backgroundColor: isExpanded ? '#eff6ff' : '#f9fafb',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = isExpanded ? '#eff6ff' : '#f9fafb'}
        >
          <div style={titleStyle}>
            <History size={16} />
            <span>Historia serwisów</span>
            <div style={badgeStyle}>
              {loading ? '...' : serviceHistory.length}
            </div>
          </div>

          <div style={actionsStyle}>
            {stats && stats.lastServiceDate && (
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                Ostatni: {new Date(stats.lastServiceDate).toLocaleDateString('pl-PL')}
              </span>
            )}

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
                title="Dodaj ręczny wpis serwisowy"
              >
                <Plus size={14} />
                Dodaj wpis
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
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {stats && (
              <div style={statsStyle}>
                <div style={statItemStyle}>
                  <BarChart3 size={14} />
                  <span>Łącznie serwisów: <strong>{stats.totalServices || 0}</strong></span>
                </div>
                {stats.averageServiceInterval && (
                  <div style={statItemStyle}>
                    <span>Średni odstęp: <strong>{Math.round(stats.averageServiceInterval)} dni</strong></span>
                  </div>
                )}
              </div>
            )}

            <div style={tabsStyle}>
              <button
                style={tabStyle(activeTab === 'all')}
                onClick={() => setActiveTab('all')}
              >
                Wszystkie ({serviceHistory.length})
              </button>
              <button
                style={tabStyle(activeTab === 'scheduled')}
                onClick={() => setActiveTab('scheduled')}
              >
                Zaplanowane ({serviceHistory.filter(e => !e.isManualEntry).length})
              </button>
            </div>

            <ServiceHistoryList
              serviceHistory={filteredHistory}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDeleteManualEntry}
              onNavigateToCalendar={onNavigateToCalendar}
              onViewImages={onViewImages}
              canEdit={canEdit}
            />
          </>
        )}
      </div>

      {showManualForm && (
        <ServiceForm
          device={device}
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

export default ServiceHistorySection;