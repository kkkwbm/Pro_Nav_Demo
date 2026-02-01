import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, ChevronDown, ChevronUp, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { smsApi } from '@/services/api/sms';

// SMS History Mapper - Enhanced to handle null devices
const smsHistoryMapper = {
  formatSmsHistory: (smsRecord) => {
    // Handle invalid record
    if (!smsRecord) {
      return null;
    }
    
    const sentDate = smsRecord.sentAt ? new Date(smsRecord.sentAt) : new Date();
    
    // Handle cases where device info might be null (advertising SMS or deleted device)
    const hasDevice = smsRecord.deviceId !== null && smsRecord.deviceId !== undefined;
    const isAdvertising = !hasDevice || 
                         smsRecord.smsType === 'ADVERTISING' || 
                         smsRecord.smsType === 'SMS Reklamowy' ||
                         smsRecord.deviceName === 'SMS Reklamowy';
    
    // Determine display names based on whether it's advertising or device-specific
    let deviceName = 'Nieznane urządzenie';
    let deviceType = 'Nieznany typ';
    
    if (isAdvertising) {
      deviceName = 'SMS Reklamowy';
      deviceType = 'Reklama';
    } else if (hasDevice) {
      deviceName = smsRecord.deviceName || 'Urządzenie';
      deviceType = smsRecord.deviceType || 'Nieznany typ';
    } else {
      // Device was deleted but it wasn't advertising
      deviceName = 'Urządzenie usunięte';
      deviceType = smsRecord.deviceType || 'Nieznany typ';
    }
    
    return {
      id: smsRecord.id || Math.random(),
      deviceId: smsRecord.deviceId,
      deviceName: deviceName,
      deviceType: deviceType,
      clientId: smsRecord.clientId,
      clientName: smsRecord.clientName || 'Nieznany klient',
      phoneNumber: smsRecord.phoneNumber || '',
      message: smsRecord.message || '',
      sentAt: smsRecord.sentAt,
      success: smsRecord.success !== false, // Default to true if undefined
      smsType: smsRecord.smsType || 'CUSTOM',
      errorMessage: smsRecord.errorMessage,
      isAdvertising: isAdvertising,
      hasDevice: hasDevice,
      // Formatted display fields
      displayDate: sentDate.toLocaleDateString('pl-PL'),
      displayTime: sentDate.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      displayType: getDisplayType(smsRecord.smsType),
      automationStatus: getAutomationStatus(smsRecord.smsType),
      statusText: smsRecord.success !== false ? 'Wysłane' : 'Błąd',
      statusIcon: smsRecord.success !== false ? '✔' : '✗',
    };
  },
};

// Helper function to get display type
function getDisplayType(smsType) {
  const typeMap = {
    'INSPECTION_REMINDER': 'Automatyczne przypomnienie o przeglądzie',
    'MANUAL_INSPECTION_REMINDER': 'Ręczne przypomnienie o przeglądzie', 
    'EXPIRATION_DATE_NOTIFICATION': 'Automatyczne powiadomienie w dniu wygaśnięcia',
    'MANUAL_EXPIRATION_NOTIFICATION': 'Ręczne powiadomienie w dniu wygaśnięcia',
    'CUSTOM': 'Wiadomość niestandardowa',
    'MANUAL_CUSTOM': 'Ręczna wiadomość niestandardowa',
    'SERVICE_CONFIRMATION': 'Potwierdzenie serwisu',
    'GENERAL_NOTIFICATION': 'Powiadomienie ogólne',
    'ADVERTISING': 'SMS reklamowy',
    'SMS Reklamowy': 'SMS reklamowy',
    // Legacy types
    'OLD_INSPECTION_REMINDER': 'Przypomnienie o przeglądzie',
    'OLD_EXPIRATION_DATE_NOTIFICATION': 'Powiadomienie w dniu wygaśnięcia',
  };
  return typeMap[smsType] || smsType || 'Nieznany typ';
}

// Helper function to get automation status
function getAutomationStatus(smsType) {
  const automaticTypes = [
    'INSPECTION_REMINDER',
    'EXPIRATION_DATE_NOTIFICATION'
  ];
  
  const manualTypes = [
    'MANUAL_INSPECTION_REMINDER',
    'MANUAL_EXPIRATION_NOTIFICATION', 
    'CUSTOM',
    'MANUAL_CUSTOM'
  ];
  
  if (automaticTypes.includes(smsType)) {
    return 'Automatyczne';
  } else if (manualTypes.includes(smsType)) {
    return 'Ręczne';
  } else {
    return 'Inne';
  }
}

const SMSHistory = ({ client, isExpanded, onToggle }) => {
  const notification = useNotification();
  const [smsHistory, setSmsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add CSS for animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch SMS history when expanded
  useEffect(() => {
    if (isExpanded && smsHistory.length === 0) {
      fetchSmsHistory();
    }
  }, [isExpanded, client.id]);

  const fetchSmsHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const history = await smsApi.getHistoryForClient(client.id);
      
      if (!history || !Array.isArray(history)) {
        console.error('Invalid SMS history response:', history);
        setSmsHistory([]);
        return;
      }
      
      const formattedHistory = history
        .map(smsRecord => smsHistoryMapper.formatSmsHistory(smsRecord))
        .filter(record => record !== null);
      
      setSmsHistory(formattedHistory);
    } catch (err) {
      console.error('Error fetching SMS history:', err);
      notification.showError('Nie udało się załadować historii SMS');
      setError('Nie udało się pobrać historii SMS');
    } finally {
      setLoading(false);
    }
  };

  const refreshHistory = async () => {
    setIsRefreshing(true);
    try {
      const history = await smsApi.getHistoryForClient(client.id);
      
      if (!history || !Array.isArray(history)) {
        console.error('Invalid SMS history response:', history);
        return;
      }
      
      const formattedHistory = history
        .map(smsRecord => {
          const formatted = smsHistoryMapper.formatSmsHistory(smsRecord);
          return formatted;
        })
        .filter(record => record !== null); // Filter out any null records
      
      setSmsHistory(formattedHistory);
    } catch (err) {
      console.error('Error refreshing SMS history:', err);
      notification.showError('Nie udało się załadować historii SMS');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get quick summary from devices (for collapsed view)
  const getQuickSummary = () => {
    if (smsHistory.length > 0) {
      // If we have fetched history, use it
      const mostRecent = smsHistory[0];
      return {
        date: mostRecent.sentAt,
        deviceType: mostRecent.deviceType,
      };
    }
    
    // Otherwise, try to get from devices
    const recentSms = [];
    if (client.devices && Array.isArray(client.devices)) {
      client.devices.forEach(device => {
        if (device.lastSMS) {
          recentSms.push({
            date: device.lastSMS,
            deviceType: device.deviceType,
          });
        }
      });
    }
    return recentSms.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const quickSummary = getQuickSummary();
  const totalSmsCount = smsHistory.length;
  const successfulSmsCount = smsHistory.filter(sms => sms.success).length;
  const advertisingSmsCount = smsHistory.filter(sms => sms.isAdvertising).length;
  const deviceSmsCount = smsHistory.filter(sms => sms.hasDevice).length;

  const containerStyle = {
    marginTop: 16,
  };

  const toggleButtonStyle = {
    background: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 13,
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  };

  const historyContainerStyle = {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  };

  const historyHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  };

  const statsStyle = {
    display: 'flex',
    gap: 16,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #e2e8f0',
  };

  const statItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const smsItemStyle = {
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    fontSize: 13,
  };

  const smsHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  };

  const deviceInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#374151',
    fontWeight: 500,
  };

  const timestampStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#6b7280',
    fontSize: 12,
  };

  const messageStyle = {
    color: '#4b5563',
    lineHeight: 1.4,
    fontSize: 12,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    wordBreak: 'break-word',
  };

  const statusBadgeStyle = (success) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    backgroundColor: success ? '#d1fae5' : '#fee2e2',
    color: success ? '#065f46' : '#991b1b',
  });

  const advertisingBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    backgroundColor: '#fef3c7',
    color: '#92400e',
    marginLeft: 8,
  };

  const showMoreButtonStyle = {
    background: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: 4,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 12,
    color: '#e67e22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    marginTop: 8,
    transition: 'all 0.2s ease',
  };

  const errorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: 6,
    fontSize: 13,
  };

  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
    color: '#6b7280',
    fontSize: 13,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: 20,
    color: '#9ca3af',
    fontSize: 13,
  };

  // Display only recent messages by default
  const displayedHistory = showFullHistory ? smsHistory : smsHistory.slice(0, 3);

  return (
    <div style={containerStyle}>
      <button
        onClick={onToggle}
        style={{
          ...toggleButtonStyle,
          backgroundColor: isExpanded ? '#f3f4f6' : 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isExpanded ? '#f3f4f6' : 'transparent';
        }}
      >
        <MessageSquare size={16} />
        <span style={{ flex: 1 }}>
          Historia SMS
          {quickSummary && !isExpanded && (
            <span style={{ color: '#9ca3af', marginLeft: 8 }}>
              (ostatni: {new Date(quickSummary.date).toLocaleDateString('pl-PL')})
            </span>
          )}
        </span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div style={historyContainerStyle}>
          <div style={historyHeaderStyle}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' }}>
              Historia wiadomości SMS
            </h4>
            {!loading && !error && totalSmsCount > 0 && (
              <button
                onClick={refreshHistory}
                disabled={isRefreshing}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isRefreshing ? '#9ca3af' : '#e67e22',
                  fontSize: 12,
                  cursor: isRefreshing ? 'wait' : 'pointer',
                  padding: '4px 8px',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title="Odśwież historię"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Odświeżanie...' : 'Odśwież'}
              </button>
            )}
          </div>

          {loading && (
            <div style={loadingStyle}>
              <div className="animate-spin" style={{ display: 'inline-block' }}>
                <Loader size={16} />
              </div>
              Ładowanie historii SMS...
            </div>
          )}

          {error && (
            <div style={errorStyle}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {!loading && !error && smsHistory.length === 0 && (
            <div style={emptyStateStyle}>
              Brak historii SMS dla tego klienta
            </div>
          )}

          {!loading && !error && smsHistory.length > 0 && (
            <>
              <div style={statsStyle}>
                <div style={statItemStyle}>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>Wszystkie SMS</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
                    {totalSmsCount}
                  </span>
                </div>
                <div style={statItemStyle}>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>Wysłane</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#27ae60' }}>
                    {successfulSmsCount}
                  </span>
                </div>
                <div style={statItemStyle}>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>Błędy</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#c0392b' }}>
                    {totalSmsCount - successfulSmsCount}
                  </span>
                </div>
                {advertisingSmsCount > 0 && (
                  <div style={statItemStyle}>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>Reklamowe</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#f59e0b' }}>
                      {advertisingSmsCount}
                    </span>
                  </div>
                )}
              </div>

              {displayedHistory.map((sms) => (
                <div key={sms.id} style={smsItemStyle}>
                  <div style={smsHeaderStyle}>
                    <div style={deviceInfoStyle}>
                      <span>{sms.deviceType}</span>
                      {sms.hasDevice && !sms.isAdvertising && sms.deviceName !== 'Urządzenie usunięte' && (
                        <span style={{ color: '#6b7280', fontSize: 12 }}>
                          • {sms.deviceName}
                        </span>
                      )}
                      {sms.isAdvertising && (
                        <span style={advertisingBadgeStyle}>
                          📢 Reklamowy
                        </span>
                      )}
                      {!sms.hasDevice && !sms.isAdvertising && (
                        <span style={{ color: '#9ca3af', fontSize: 11, fontStyle: 'italic' }}>
                          (urządzenie usunięte)
                        </span>
                      )}
                    </div>
                    <div style={statusBadgeStyle(sms.success)}>
                      <span>{sms.statusIcon}</span>
                      <span>{sms.statusText}</span>
                    </div>
                  </div>
                  
                  <div style={timestampStyle}>
                    <Clock size={12} />
                    <span>{sms.displayDate} o {sms.displayTime}</span>
                    <span style={{ marginLeft: 8 }}>• {sms.displayType}</span>
                    {sms.phoneNumber && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: '#9ca3af' }}>
                        → {sms.phoneNumber}
                      </span>
                    )}
                  </div>

                  <div style={messageStyle}>
                    {sms.message && sms.message.length > 160 
                      ? `${sms.message.substring(0, 160)}...` 
                      : sms.message || 'Brak treści wiadomości'
                    }
                  </div>

                  {!sms.success && sms.errorMessage && (
                    <div style={{
                      marginTop: 8,
                      padding: 8,
                      backgroundColor: '#fef2f2',
                      borderRadius: 4,
                      fontSize: 11,
                      color: '#991b1b',
                    }}>
                      ⚠️ {sms.errorMessage}
                    </div>
                  )}
                </div>
              ))}

              {smsHistory.length > 3 && (
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  style={showMoreButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {showFullHistory ? (
                    <>
                      <ChevronUp size={14} />
                      Pokaż mniej
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      Pokaż wszystkie ({smsHistory.length})
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SMSHistory;