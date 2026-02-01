import React, { useState, useEffect } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Phone, Home, Wrench, Calendar, AlertCircle, Send, ChevronLeft, ChevronRight, Package, ExternalLink, X, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { isInspectionSoon, getInspectionPeriod } from '@/services/utils/clientUtils';
import { smsApi } from '@/services/api/sms';
import { settingsApi } from '@/services/api/settings';
import { useSettings } from '@/hooks/useSettings';
import { useNotification } from '@/contexts/NotificationContext';
import { useSMSHandlers } from '@/hooks/useSMSHandlers';
import SMSDialog from '@/components/clients/SMSDialog';

// Separate SMS Confirmation Dialog Component to prevent re-rendering issues
// NOTE: This is deprecated - use SMSDialog component instead
const SMSConfirmationDialog = ({ 
  showSMSDialog, 
  client, 
  smsPreview, 
  setSmsPreview, 
  loadingPreview, 
  handleConfirmSMS, 
  handleCancelSMS 
}) => {
  if (!showSMSDialog) return null;

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
      zIndex: 10000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        maxWidth: 500,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <MessageSquare size={20} color="#3b82f6" />
            <h3 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: '700',
              color: '#1f2937',
            }}>
              Wyślij SMS do klienta
            </h3>
          </div>
          <button
            onClick={handleCancelSMS}
            style={{
              padding: 8,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Client Info */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
          border: '1px solid #e5e7eb',
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
          }}>
            Odbiorca:
          </h4>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
            <strong>{client?.name}</strong> - {client?.phone}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {client?.deviceType} - {client?.address}
          </div>
        </div>

        {/* SMS Preview */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: 14,
            fontWeight: '600',
            color: '#374151',
          }}>
            Treść wiadomości SMS:
          </h4>
          {loadingPreview ? (
            <div style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: 16,
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#6b7280',
            }}>
              <div style={{
                width: 16,
                height: 16,
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Generowanie podglądu...
            </div>
          ) : (
            <textarea
              value={smsPreview}
              onChange={(e) => setSmsPreview(e.target.value)}
              style={{
                width: '100%',
                minHeight: 120,
                padding: 16,
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.5,
                color: '#374151',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                backgroundColor: 'white',
              }}
              placeholder="Wpisz treść wiadomości SMS..."
            />
          )}
          {/* Character and SMS count */}
          {!loadingPreview && (
            <div style={{
              fontSize: 12,
              color: '#6b7280',
              marginTop: 4,
              textAlign: 'right'
            }}>
              Znaków: {smsPreview?.length || 0} | SMS: {Math.ceil((smsPreview?.length || 0) / 68) || 1}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handleCancelSMS}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Anuluj
          </button>
          <button
            onClick={handleConfirmSMS}
            disabled={!smsPreview?.trim()}
            style={{
              padding: '12px 24px',
              backgroundColor: smsPreview?.trim() ? '#10b981' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: '600',
              cursor: smsPreview?.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Send size={16} />
            Wyślij SMS
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

const ClientInfoWindow = ({ clients, onClose, onSendSMS, onNavigateToClient }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const notification = useNotification();

  // Get settings for SMS template
  const { settings, generateSMSMessage, getMaintenancePrice } = useSettings();

  // Success message handler
  const showSuccessMessage = (message) => {
    setSendStatus({ success: true, message });
    setTimeout(() => setSendStatus(null), 3000);
  };

  // Error handler
  const handleAuthError = (error) => {
    console.error('[ClientInfoWindow] Error:', error);
    return {
      title: 'Błąd',
      message: error?.message || 'Wystąpił błąd',
      canRetry: true
    };
  };

  // Use SMS handlers hook
  const {
    showSMSDialog,
    smsMessage,
    setSmsMessage,
    smsLoading,
    handleSendSMS,
    handleConfirmSMS,
    closeSMSDialog,
    handleTemplateSelect,
    handleResetToDefault
  } = useSMSHandlers({
    onSendSMS,
    settings,
    generateSMSMessage,
    getMaintenancePrice,
    handleAuthError,
    showSuccessMessage
  });

  // Helper function to normalize client data (handles both regular clients and custom clients)
  const normalizeClientData = (client) => {
    if (!client) return null;

    // Build address string from separate fields or use existing address
    const address = client.address || (() => {
      const parts = [];
      if (client.ulica && client.nrDomu) {
        const streetPart = client.nrLokalu
          ? `${client.ulica} ${client.nrDomu}/${client.nrLokalu}`
          : `${client.ulica} ${client.nrDomu}`;
        parts.push(streetPart);
      }
      if (client.kodPocztowy && client.miejscowosc) {
        parts.push(`${client.kodPocztowy} ${client.miejscowosc}`);
      }
      return parts.join(', ') || 'Brak adresu';
    })();

    // Normalize device type
    const deviceType = client.deviceType || client.typUrzadzenia || 'Nieznane urządzenie';

    // Normalize inspection date
    const inspectionDate = client.nextInspectionDate || client.terminPrzegladu;

    return {
      ...client,
      address,
      deviceType,
      nextInspectionDate: inspectionDate,
    };
  };
  
  // Hide Google Maps default close button
  useEffect(() => {
    const hideDefaultCloseButton = () => {
      const closeButtons = document.querySelectorAll('.gm-ui-hover-effect[aria-label="Close"]');
      closeButtons.forEach(button => {
        button.style.display = 'none';
      });
    };
    
    // Run immediately and after a short delay to catch late-rendered buttons
    hideDefaultCloseButton();
    const timeout = setTimeout(hideDefaultCloseButton, 100);
    
    return () => clearTimeout(timeout);
  }, [currentIndex]); // Re-run when client changes
  
  if (!clients || clients.length === 0) return null;

  const isMultiple = clients.length > 1;
  const rawClient = clients[currentIndex];

  // Safety check for client data
  if (!rawClient) {
    console.warn('[ClientInfoWindow] No client data available');
    return null;
  }

  // Normalize client data to handle both regular and custom clients
  const client = normalizeClientData(rawClient);

  // Use the marker's position directly - we'll handle offset with pixelOffset instead
  const markerPosition = client.position;

  const handleSMSButtonClick = async () => {
    // Create normalized device and client objects for the SMS handler
    const device = {
      id: client.deviceId || client.id,
      deviceType: client.deviceType,
      deviceName: client.deviceName || client.nazwaUrzadzenia || client.deviceType,
      address: client.address,
      nextInspectionDate: client.nextInspectionDate
    };

    const clientData = {
      name: client.imie && client.nazwisko ? `${client.imie} ${client.nazwisko}` : client.name,
      phone: client.telefon || client.phone,
      id: client.clientId || client.id,
      isCustomClient: client.isCustomClient || false // Preserve custom client flag
    };

    // Use the hook's handleSendSMS which will open the dialog with preview
    await handleSendSMS(clientData, device);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : clients.length - 1));
    setSendStatus(null); // Clear status when changing client
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < clients.length - 1 ? prev + 1 : 0));
    setSendStatus(null); // Clear status when changing client
  };

  const getInspectionColor = (date) => {
    const period = getInspectionPeriod(date);
    if (period === 'overdue') return '#991b1b';
    if (period === 'urgent') return '#dc2626';
    if (period === 'soon') return '#ea580c';
    return '#059669';
  };

  const getMaintenanceConfirmationIcon = () => {
    if (!client.serviceConfirmed) {
      return <XCircle size={14} color="#dc2626" />;
    } else if (client.serviceConfirmationValid) {
      return <CheckCircle size={14} color="#059669" />;
    } else {
      return <Clock size={14} color="#f59e0b" />;
    }
  };

  const getMaintenanceConfirmationText = () => {
    if (!client.serviceConfirmed) {
      return 'Nie potwierdzono';
    } else if (client.serviceConfirmationValid) {
      return 'Potwierdzono';
    } else {
      return 'Wygasło';
    }
  };

  const getMaintenanceConfirmationColor = () => {
    if (!client.serviceConfirmed) {
      return '#dc2626';
    } else if (client.serviceConfirmationValid) {
      return '#059669';
    } else {
      return '#f59e0b';
    }
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '2px solid #e5e7eb',
  };

  const navigationStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const navButtonStyle = {
    background: '#f3f4f6',
    border: 'none',
    borderRadius: 6,
    padding: '4px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#e5e7eb',
    }
  };

  const deviceBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: client.deviceType === 'Pompa ciepła' ? '#dbeafe' : '#d1fae5',
    color: client.deviceType === 'Pompa ciepła' ? '#1e40af' : '#065f46',
  };

  const getButtonStyle = () => {
    let baseStyle = {
      width: '100%',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '10px 0',
      cursor: isSending ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      fontSize: 13,
      fontWeight: '600',
      transition: 'all 0.2s ease',
      opacity: isSending ? 0.7 : 1,
    };

    if (sendStatus?.success) {
      return {
        ...baseStyle,
        backgroundColor: '#27ae60',
        boxShadow: '0 2px 6px rgba(39, 174, 96, 0.3)',
      };
    } else if (sendStatus?.success === false) {
      return {
        ...baseStyle,
        backgroundColor: '#c0392b',
        boxShadow: '0 2px 6px rgba(192, 57, 43, 0.3)',
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#2c3e50',
        boxShadow: '0 2px 6px rgba(44, 62, 80, 0.3)',
      };
    }
  };

  return (
    <>
      <InfoWindow 
        position={markerPosition} 
        onCloseClick={onClose}
        onDomReady={() => {
          // Hide default close button when InfoWindow DOM is ready
          setTimeout(() => {
            const closeButtons = document.querySelectorAll('.gm-ui-hover-effect[aria-label="Close"]');
            closeButtons.forEach(button => {
              button.style.display = 'none';
            });
          }, 50);
        }}
        options={{
          maxWidth: 340,
          disableAutoPan: false,
          closeBoxURL: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          // Position InfoWindow to the right of marker with no overlap
          // X: 70px to the right (marker is ~44px wide, so this gives ~48px spacing)
          // Y: -10px up to center it vertically with the marker
          pixelOffset: new window.google.maps.Size(70, -10)
        }}
      >
        <div style={{
          minWidth: 290,
          fontSize: 13,
          lineHeight: 1.5,
          backgroundColor: 'white',
          padding: '22px 18px 18px 18px',
          borderRadius: '6px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
          borderTop: '3px solid #e67e22',
          position: 'relative',
          marginTop: '8px',
          overflow: 'hidden'
        }}>
          {/* Simple horizontal connector line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-68px',
            width: '68px',
            height: '2px',
            backgroundColor: '#e67e22',
            transform: 'translateY(-50%)',
          }}>
            {/* Dot at the connection point with InfoWindow */}
            <div style={{
              position: 'absolute',
              right: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#e67e22',
              border: '2px solid white',
            }} />
            {/* Dot at the marker end */}
            <div style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#e67e22',
            }} />
          </div>
          {/* Custom Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '26px',
              height: '26px',
              backgroundColor: '#f5f3ef',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              padding: 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e67e22';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f5f3ef';
            }}
          >
            <X size={15} color="#2c3e50" />
          </button>
          {/* Header with Navigation */}
          <div style={headerStyle}>
            <h3 style={{ fontWeight: 700, margin: 0, fontSize: 16 }}>
              {client.imie && client.nazwisko ? `${client.imie} ${client.nazwisko}` : client.name || 'Nieznany klient'}
            </h3>
            {isMultiple && (
              <div style={navigationStyle}>
                <button 
                  onClick={handlePrevious}
                  style={{ ...navButtonStyle, marginRight: 4 }}
                  onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 12, color: '#6b7280', fontWeight: '600' }}>
                  {currentIndex + 1} / {clients.length}
                </span>
                <button 
                  onClick={handleNext}
                  style={{ ...navButtonStyle, marginLeft: 4 }}
                  onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <Phone size={14} color="#6b7280" />
              <span style={{ color: '#374151' }}>{client.telefon || client.phone || 'Brak numeru'}</span>
            </div>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <Home size={14} color="#6b7280" />
              <span style={{ color: '#374151' }}>{client.address}</span>
            </div>
          </div>

          {/* Device Info */}
          <div style={{ 
            background: '#f9fafb', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 12,
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={deviceBadgeStyle}>
                <Wrench size={12} />
                {client.deviceType}
              </div>
              {isMultiple && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4,
                  fontSize: 11,
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  <Package size={12} />
                  Urządzenie {currentIndex + 1}
                </div>
              )}
            </div>
            
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              padding: '6px 0',
              borderTop: '1px solid #e5e7eb',
            }}>
              <Calendar size={14} color="#6b7280" />
              <span style={{ flex: 1, color: '#374151', fontWeight: '500' }}>
                Przegląd: {client.nextInspectionDate
                  ? new Date(client.nextInspectionDate).toLocaleDateString('pl-PL')
                  : 'Brak danych'}
              </span>
              {client.nextInspectionDate && isInspectionSoon(client.nextInspectionDate) && (
                <AlertCircle size={16} color={getInspectionColor(client.nextInspectionDate)} />
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: 8, 
              alignItems: 'center',
              padding: '6px 0',
              borderTop: '1px solid #e5e7eb',
            }}>
              {getMaintenanceConfirmationIcon()}
              <span style={{ flex: 1, color: '#374151', fontWeight: '500' }}>
                Potwierdzenie:
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: getMaintenanceConfirmationColor(),
                  backgroundColor: `${getMaintenanceConfirmationColor()}20`,
                  padding: '2px 6px',
                  borderRadius: 8,
                }}
              >
                {getMaintenanceConfirmationText()}
              </span>
            </div>
            
            {client.serviceConfirmed && client.serviceConfirmedAt && (
              <div style={{ 
                padding: '4px 0',
                fontSize: 11,
                color: '#6b7280',
                textAlign: 'center',
                fontStyle: 'italic',
                borderTop: '1px solid #e5e7eb',
              }}>
                Potwierdzone: {new Date(client.serviceConfirmedAt).toLocaleDateString('pl-PL')}
              </div>
            )}
          </div>

          {/* Notes */}
          {client.notes && (
            <div style={{
              background: '#fef3c7',
              padding: 10,
              borderRadius: 6,
              marginBottom: 12,
              fontSize: 12,
              color: '#92400e',
              border: '1px solid #fde68a',
            }}>
              <strong>Uwagi:</strong> {client.notes}
            </div>
          )}

          {/* Status Message */}
          {sendStatus && (
            <div style={{
              padding: 10,
              borderRadius: 6,
              marginBottom: 12,
              fontSize: 12,
              textAlign: 'center',
              fontWeight: '600',
              background: sendStatus.success ? '#d1fae5' : '#fee2e2',
              color: sendStatus.success ? '#065f46' : '#991b1b',
              border: `1px solid ${sendStatus.success ? '#86efac' : '#fca5a5'}`,
            }}>
              {sendStatus.message}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <button
              onClick={handleSMSButtonClick}
              disabled={isSending}
              style={getButtonStyle()}
              onMouseEnter={(e) => {
                if (!isSending && !sendStatus) {
                  e.target.style.backgroundColor = '#1a252f';
                  e.target.style.boxShadow = '0 3px 8px rgba(44, 62, 80, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSending && !sendStatus) {
                  e.target.style.backgroundColor = '#2c3e50';
                  e.target.style.boxShadow = '0 2px 6px rgba(44, 62, 80, 0.3)';
                }
              }}
            >
              {isSending ? (
                <>
                  <div style={{
                    width: 14,
                    height: 14,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  Wysyłanie SMS...
                </>
              ) : sendStatus?.success ? (
                <>
                  <span style={{ fontSize: 16 }}>✔</span>
                  SMS wysłany!
                </>
              ) : sendStatus?.success === false ? (
                <>
                  <span style={{ fontSize: 16 }}>✗</span>
                  Błąd wysyłania
                </>
              ) : (
                <>
                  <Send size={14} />
                  Wyślij SMS przypomnienie
                </>
              )}
            </button>

            {onNavigateToClient && (
              <button
                onClick={() => onNavigateToClient(client.clientId || client.id)}
                style={{
                  width: '100%',
                  backgroundColor: client.isCustomClient ? '#c0392b' : '#27ae60',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '10px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  fontSize: 13,
                  fontWeight: '600',
                  boxShadow: client.isCustomClient
                    ? '0 2px 6px rgba(192, 57, 43, 0.3)'
                    : '0 2px 6px rgba(39, 174, 96, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = client.isCustomClient ? '#a93226' : '#229954';
                  e.target.style.boxShadow = client.isCustomClient
                    ? '0 3px 8px rgba(192, 57, 43, 0.4)'
                    : '0 3px 8px rgba(39, 174, 96, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = client.isCustomClient ? '#c0392b' : '#27ae60';
                  e.target.style.boxShadow = client.isCustomClient
                    ? '0 2px 6px rgba(192, 57, 43, 0.3)'
                    : '0 2px 6px rgba(39, 174, 96, 0.3)';
                }}
              >
                <ExternalLink size={13} />
                {client.isCustomClient ? 'Zobacz w zakładce Zgłoszenia' : 'Zobacz w zakładce Klienci'}
              </button>
            )}
          </div>

          {client.lastSMS && (
            <p style={{ 
              fontSize: 11, 
              color: '#6b7280', 
              marginTop: 8, 
              margin: '8px 0 0 0',
              textAlign: 'center',
              fontStyle: 'italic' 
            }}>
              Ostatni SMS: {new Date(client.lastSMS).toLocaleDateString('pl-PL')}
            </p>
          )}

          {/* CSS Animation for loading spinner and remove scrollbars from InfoWindow */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            /* Hide Google Maps InfoWindow default close button - multiple selectors for robustness */
            .gm-ui-hover-effect {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
            .gm-style-iw button[aria-label="Close"] {
              display: none !important;
            }
            .gm-style-iw-chr {
              display: none !important;
            }
            /* Remove scrollbars from Google Maps InfoWindow */
            .gm-style-iw {
              overflow: hidden !important;
            }
            .gm-style-iw-c {
              overflow: hidden !important;
            }
            .gm-style-iw-d {
              overflow: hidden !important;
              max-height: none !important;
            }
            .gm-style-iw-t::after {
              display: none !important;
            }
          `}</style>
        </div>
      </InfoWindow>

      {/* SMS Dialog with Template Support */}
      {showSMSDialog && (
        <SMSDialog
          showSMSDialog={showSMSDialog}
          smsMessage={smsMessage}
          setSmsMessage={setSmsMessage}
          onConfirm={handleConfirmSMS}
          onCancel={closeSMSDialog}
          loading={smsLoading}
          customTemplates={settings?._backend?.customSmsTemplates || []}
          onTemplateSelect={handleTemplateSelect}
          onResetToDefault={handleResetToDefault}
          isCustomClient={showSMSDialog?.client?.isCustomClient || false}
        />
      )}
    </>
  );
};

export default ClientInfoWindow;