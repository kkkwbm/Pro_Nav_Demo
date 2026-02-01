import React, { useState, useEffect } from 'react';
import { DEVICE_TYPES } from '@/config/mapConfig';
import { tokenStorage } from '@/services/storage/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import logger from '@/utils/logger';

// Components
import ClientsSearchFilters from '@/components/clients/ClientsSearchFilters';
import ClientCard from '@/components/clients/ClientCard';
import ClientDeviceForm from '@/components/clients/ClientDeviceForm';
import ClientForm from '@/components/clients/ClientForm';
import UpdateConfirmationDialog from '@/components/clients/UpdateConfirmationDialog';
import SMSDialog from '@/components/clients/SMSDialog';
import ServiceImages from '@/components/services/ServiceImages';
import ServiceFormModal from '@/components/services/ServiceFormModal';
import ServiceUpdateModal from '@/components/clients/ServiceUpdateModal';
import LoadingState from '@/components/clients/LoadingState';
import ErrorDisplay from '@/components/clients/ErrorDisplay';
import DebugPanel from '@/components/clients/DebugPanel';
import SuccessPopup from '@/components/clients/SuccessPopup';
import AddClientButton from '@/components/clients/AddClientButton';
import PaginationControls from '@/components/clients/PaginationControls';

// Hooks
import { useSMSHandlers } from '@/hooks/useSMSHandlers';
import { useClientFiltering } from '@/hooks/useClientFiltering';

const ClientsPage = ({ 
  clients = [], 
  onUpdateClient, 
  onUpdateDevice, 
  onDeleteDevice, 
  onDeleteClient,
  onAddDeviceToClient, 
  onAddClient,
  onCreateService,
  onSendSMS,
  onNavigateToCalendar,
  settings,
  generateSMSMessage,
  getInspectionInterval,
  getMaintenancePrice,
  loading,
  error,
  selectedClientId
}) => {
  const { user, logout } = useAuth();
  const notification = useNotification();

  // Debug info state
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDevice, setEditingDevice] = useState(null);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClientForDevice, setSelectedClientForDevice] = useState(null);
  const [expandedSMSHistory, setExpandedSMSHistory] = useState({});
  const [expandedServiceHistory, setExpandedServiceHistory] = useState({});

  // Filter states
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [inspectionFilter, setInspectionFilter] = useState('all');
  const [confirmationFilter, setConfirmationFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  // Dialog states
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(null);

  // Service Images modal states
  const [showServiceImages, setShowServiceImages] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Service Update modal states
  const [showServiceUpdateModal, setShowServiceUpdateModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Service Form modal states (for creating services)
  const [showServiceFormModal, setShowServiceFormModal] = useState(false);
  const [serviceFormDevice, setServiceFormDevice] = useState(null);

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Retry mechanism
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Debug auth state on mount
  useEffect(() => {
    const authInfo = {
      isAuthenticated: tokenStorage.isAuthenticated(),
      hasToken: !!tokenStorage.getAccessToken(),
      hasUser: !!tokenStorage.getUser(),
      userRoles: tokenStorage.getUser()?.roles || [],
      isAdmin: tokenStorage.isAdmin(),
      tokenExpiration: tokenStorage.getTokenExpiration(),
      currentTime: new Date().toISOString()
    };

    setDebugInfo(authInfo);

    logger.debug('[ClientsPage] Authentication Debug:', authInfo);
  }, []);

  // Success message handler
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // Enhanced error handling with specific JWT error detection
  const handleAuthError = (error) => {
    logger.error('[ClientsPage] Auth Error:', error);

    if (error?.response?.status === 401) {
      logger.debug('[ClientsPage] 401 Error - Authentication required');
      tokenStorage.clearAll();
      logout();
      return;
    }

    if (error?.response?.status === 403) {
      logger.debug('[ClientsPage] 403 Error - Access forbidden');
      return {
        title: 'Access Denied',
        message: `You don't have permission to access this resource. Your current roles: ${user?.roles?.join(', ') || 'None'}`,
        canRetry: false
      };
    }

    return {
      title: 'Error Loading Data',
      message: error?.message || 'An unexpected error occurred',
      canRetry: true
    };
  };

  // Retry mechanism for failed requests
  const handleRetry = async () => {
    if (retryCount >= 3) {
      logger.debug('[ClientsPage] Max retries reached');
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      if (window.location) {
        window.location.reload();
      }
    } catch (error) {
      logger.error('[ClientsPage] Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Use custom hooks for filtering and SMS handling
  const filteredAndSortedClients = useClientFiltering({
    clients,
    searchQuery,
    deviceTypeFilter,
    inspectionFilter,
    confirmationFilter,
    sortOption
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filteredAndSortedClients.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deviceTypeFilter, inspectionFilter, confirmationFilter, sortOption]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Auto-scroll and highlight selected client when navigating from map
  useEffect(() => {
    if (selectedClientId && !loading && filteredAndSortedClients.length > 0) {
      // Find which page the selected client is on
      const clientIndex = filteredAndSortedClients.findIndex(c => c.id === selectedClientId);

      if (clientIndex !== -1) {
        // Calculate which page this client is on
        const clientPage = Math.floor(clientIndex / itemsPerPage) + 1;

        logger.debug(`[ClientsPage] Client ${selectedClientId} found at index ${clientIndex}, on page ${clientPage}`);

        // Navigate to the correct page if not already there
        if (currentPage !== clientPage) {
          logger.debug(`[ClientsPage] Switching from page ${currentPage} to page ${clientPage}`);
          setCurrentPage(clientPage);
        }

        // Try multiple times with increasing delays to ensure element is rendered
        const attemptHighlight = (attempt = 0, maxAttempts = 5) => {
          const delay = attempt * 200; // 0ms, 200ms, 400ms, 600ms, 800ms

          setTimeout(() => {
            const clientElement = document.getElementById(`client-${selectedClientId}`);

            if (clientElement) {
              // Found the element - scroll and highlight
              clientElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });

              // Add highlight effect
              clientElement.style.transition = 'all 0.3s ease';
              clientElement.style.boxShadow = '0 0 0 3px #3b82f6';

              // Remove highlight after 2 seconds
              setTimeout(() => {
                clientElement.style.boxShadow = '';
              }, 2000);

              logger.debug(`[ClientsPage] Successfully highlighted client ${selectedClientId} on attempt ${attempt + 1}`);
            } else if (attempt < maxAttempts - 1) {
              // Element not found yet - try again
              logger.debug(`[ClientsPage] Client element not found on attempt ${attempt + 1}, retrying...`);
              attemptHighlight(attempt + 1, maxAttempts);
            } else {
              logger.warn(`[ClientsPage] Failed to find client ${selectedClientId} after ${maxAttempts} attempts`);
            }
          }, delay);
        };

        attemptHighlight();
      } else {
        logger.warn(`[ClientsPage] Client ${selectedClientId} not found in filtered list`);
      }
    }
  }, [selectedClientId, loading, filteredAndSortedClients, currentPage, itemsPerPage]);

  const {
    showSMSDialog,
    smsMessage,
    setSmsMessage,
    smsLoading,
    handleSendSMS,
    handleConfirmSMS,
    handleCustomSMS,
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

  const handleEditDevice = (device, clientId) => {
    setEditingDevice({ ...device, clientId });
  };

  // Handle device update after service creation (refreshes inspection date)
  const handleDeviceUpdate = async (deviceId) => {
    try {
      logger.debug('[ClientsPage] Refreshing device data after service creation:', deviceId);
      // Fetch the latest device data from server (which now has updated inspection date)
      // Then update only the nextInspectionDate field to avoid triggering a full update
      const { devicesApi } = await import('@/services/api/clients');
      const freshDevice = await devicesApi.getById(deviceId);

      // Update only the inspection date field
      if (freshDevice && freshDevice.terminPrzegladu) {
        await onUpdateDevice(deviceId, { nextInspectionDate: freshDevice.terminPrzegladu });
        logger.debug('[ClientsPage] Device inspection date refreshed successfully');
      }
    } catch (error) {
      logger.error('[ClientsPage] Error refreshing device data:', error);
      // Don't show error to user - this is a background refresh
    }
  };

  const handleViewImages = (serviceEntry) => {
    setSelectedService(serviceEntry);
    setShowServiceImages(true);
  };

  const handleSaveDevice = async (deviceData) => {
    try {
      if (editingDevice.id) {
        const result = await onUpdateDevice(editingDevice.id, deviceData);
        if (result?.success) {
          showSuccessMessage('Urządzenie zostało zaktualizowane!');
          setEditingDevice(null);
          setShowAddDeviceForm(false);
          setSelectedClientForDevice(null);
        } else {
          notification.showError('Nie udało się edytować danych urządzenia');
        }
      } else {
        const result = await onAddDeviceToClient(selectedClientForDevice, deviceData);
        if (result?.success) {
          showSuccessMessage('Urządzenie zostało dodane!');
          setEditingDevice(null);
          setShowAddDeviceForm(false);
          setSelectedClientForDevice(null);
        } else {
          notification.showError('Nie udało się dodać urządzenia');
        }
      }
    } catch (error) {
      const errorInfo = handleAuthError(error);
      notification.showError('Nie udało się edytować danych urządzenia');
    }
  };

  const handleAddDevice = (clientId) => {
    setSelectedClientForDevice(clientId);
    setEditingDevice({
      address: '',
      deviceType: DEVICE_TYPES.HEAT_PUMP,
      deviceName: '',
      installationDate: new Date().toISOString().split('T')[0],
      nextInspectionDate: '',
      notes: '',
    });
    setShowAddDeviceForm(true);
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const clientWithDevice = clients.find(c => c.devices?.some(d => d.id === deviceId));
      const device = clientWithDevice?.devices?.find(d => d.id === deviceId);

      if (!clientWithDevice || !device) {
        notification.showError('Nie znaleziono urządzenia');
        return;
      }

      const result = await onDeleteDevice(deviceId);

      if (result?.success) {
        // Use setTimeout to ensure React has completed the state update and re-render
        // before showing the success message
        setTimeout(() => {
          showSuccessMessage(`Urządzenie "${device.deviceType}" zostało usunięte!`);
        }, 0);
      } else {
        notification.showError('Nie udało się usunąć urządzenia');
      }
    } catch (error) {
      const errorInfo = handleAuthError(error);
      notification.showError('Nie udało się usunąć urządzenia');
    }
  };

  const handleAddClient = async (clientData) => {
    if (!onAddClient) {
      notification.showError('Funkcja dodawania klienta nie jest dostępna');
      return;
    }

    setIsAddingClient(true);

    try {
      const result = await onAddClient(clientData);

      if (result?.success !== false) {
        showSuccessMessage(`Klient ${clientData.firstName} ${clientData.lastName} został pomyślnie dodany!`);
        setShowAddClientForm(false);
      } else {
        // Use the specific error message from the backend
        notification.showError(result?.error || 'Nie udało się dodać klienta');
      }
    } catch (error) {
      const errorInfo = handleAuthError(error);
      // Use the specific error message if available
      notification.showError(error?.response?.data?.message || 'Nie udało się dodać klienta');
    } finally {
      setTimeout(() => setIsAddingClient(false), 1000);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowAddClientForm(true);
  };

  const handleUpdateClient = async (clientData) => {
    if (!onUpdateClient) {
      notification.showError('Funkcja edycji klienta nie jest dostępna');
      return;
    }
    
    try {
      const result = await onUpdateClient(editingClient.id, clientData);
      
      if (result?.success !== false) {
        showSuccessMessage(`Dane klienta ${clientData.firstName} ${clientData.lastName} zostały zaktualizowane!`);
        setShowAddClientForm(false);
        setEditingClient(null);
      } else {
        notification.showError('Nie udało się zaktualizować danych klienta');
      }
    } catch (error) {
      const errorInfo = handleAuthError(error);
      notification.showError('Nie udało się zaktualizować danych klienta');
    }
  };

  const handleDeleteClient = async (clientId, clientName) => {
    if (!onDeleteClient) {
      notification.showError('Funkcja usuwania klientów nie jest dostępna');
      return;
    }

    if (!window.confirm(`Czy na pewno chcesz usunąć klienta "${clientName}"?\n\nUWAGA: Wszystkie urządzenia i historia tego klienta zostaną również usunięte!`)) {
      return;
    }

    try {
      // Find if client has devices and warn again if they do
      const clientToDelete = clients.find(c => c.id === clientId);
      if (clientToDelete?.devices && clientToDelete.devices.length > 0) {
        if (!window.confirm(`Klient "${clientName}" ma ${clientToDelete.devices.length} urządzeń. Czy na pewno chcesz kontynuować usuwanie?`)) {
          return;
        }
      }

      // Use the proper callback from useClients hook
      const result = await onDeleteClient(clientId);
      
      if (result?.success) {
        showSuccessMessage(`Pomyślnie usunięto użytkownika "${clientName}"`);
      } else {
        notification.showError(result?.error || 'Nie udało się usunąć klienta');
      }

    } catch (error) {
      logger.error('Error deleting client:', error);
      const errorInfo = handleAuthError(error);
      if (errorInfo) {
        notification.showError(errorInfo.message);
      } else {
        notification.showError('Nie udało się usunąć klienta. Sprawdź połączenie z serwerem.');
      }
    }
  };


  // Inspection extension handler - now shows modal instead of direct update
  const handleExtendInspection = async (deviceId) => {
    const client = clients.find(c => c.devices?.some(d => d.id === deviceId));
    const device = client?.devices?.find(d => d.id === deviceId);
    
    if (!device) {
      alert('Nie znaleziono urządzenia');
      return;
    }

    // Set selected device and show modal
    setSelectedDevice({ ...device, client });
    setShowServiceUpdateModal(true);
  };
  
  // Handle service update confirmation from modal (demo mode - no server call)
  const handleServiceUpdateConfirm = (formData) => {
    showSuccessMessage('Przegląd został zaktualizowany!');
    setShowServiceUpdateModal(false);
    setSelectedDevice(null);
  };

  // Handle creating a new service
  const handleCreateService = (device) => {
    const client = clients.find(c => c.devices?.some(d => d.id === device.id));
    if (!client) {
      notification.showError('Nie znaleziono klienta dla tego urządzenia');
      return;
    }
    
    setServiceFormDevice({ ...device, client });
    setShowServiceFormModal(true);
  };

  // Handle service creation submission - just pass through to onCreateService
  const handleServiceSubmit = async (serviceData) => {
    logger.debug('ClientsPage handleServiceSubmit called with:', serviceData);
    if (!onCreateService) {
      throw new Error('Funkcja tworzenia serwisu nie jest dostępna');
    }

    try {
      const result = await onCreateService(serviceData);

      // Return the result so ServiceFormModal can use the service ID for photo uploads
      return result;
    } catch (error) {
      logger.error('Error creating service in ClientsPage:', error);
      
      // Re-throw the error so the ServiceFormModal can handle it
      throw error;
    }
  };

  // SMS History toggle handler
  const handleToggleSMSHistory = (clientId) => {
    setExpandedSMSHistory(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  // Service History toggle handler
  const handleToggleServiceHistory = (deviceId) => {
    setExpandedServiceHistory(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
  };


  // Component styles
  const pageStyle = {
    padding: '20px',
    paddingTop: '85px', // Add space for navigation bar (65px height + 20px spacing)
    minHeight: '100%',
    backgroundColor: '#f9fafb',
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    boxSizing: 'border-box',
  };

  // Show loading state
  if (loading && !isAddingClient) {
    return <LoadingState debugInfo={debugInfo} showDebugInfo={showDebugInfo} />;
  }

  // Show error state
  if (error) {
    return (
      <div style={pageStyle}>
        <ErrorDisplay
          error={error}
          debugInfo={debugInfo}
          showDebugInfo={showDebugInfo}
          setShowDebugInfo={setShowDebugInfo}
          isRetrying={isRetrying}
          retryCount={retryCount}
          handleRetry={handleRetry}
        />
      </div>
    );
  }

  // Main render
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={pageStyle}>
        {/* Debug panel */}
        {showDebugInfo && (
          <DebugPanel
            debugInfo={debugInfo}
            onClose={() => setShowDebugInfo(false)}
          />
        )}

        <ClientsSearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          deviceTypeFilter={deviceTypeFilter}
          onDeviceTypeChange={setDeviceTypeFilter}
          inspectionFilter={inspectionFilter}
          onInspectionChange={setInspectionFilter}
          confirmationFilter={confirmationFilter}
          onConfirmationChange={setConfirmationFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          resultsCount={filteredAndSortedClients.length}
        />

        {/* Pagination controls - Top */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedClients.length}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
        />

        {paginatedClients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onAddDevice={handleAddDevice}
            onSendSMS={handleSendSMS}
            onExtendInspection={handleExtendInspection}
            onCreateService={handleCreateService}
            onEditDevice={handleEditDevice}
            onDeleteDevice={handleDeleteDevice}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            expandedSMSHistory={expandedSMSHistory}
            onToggleSMSHistory={handleToggleSMSHistory}
            expandedServiceHistory={expandedServiceHistory}
            onToggleServiceHistory={handleToggleServiceHistory}
            onNavigateToCalendar={onNavigateToCalendar}
            onViewImages={handleViewImages}
            onDeviceUpdate={handleDeviceUpdate}
            isHighlighted={client.id === selectedClientId}
            canEdit={user?.roles?.includes('ADMIN') || user?.roles?.includes('MANAGER') || user?.roles?.includes('TECHNICIAN')}
          />
        ))}

        {/* Pagination controls - Bottom */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedClients.length}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
        />

        {filteredAndSortedClients.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: '#6b7280',
            fontSize: 16,
          }}>
            {searchQuery ? 'Nie znaleziono klientów spełniających kryteria wyszukiwania.' : 'Brak klientów do wyświetlenia.'}
          </div>
        )}

        {/* Add Client Button */}
        <AddClientButton onClick={() => setShowAddClientForm(true)} />

        {/* Success Popup */}
        <SuccessPopup
          isVisible={showSuccessPopup}
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
        />

        {/* Modals */}
        {(editingDevice || showAddDeviceForm) && (
          <ClientDeviceForm
            device={editingDevice}
            onSave={handleSaveDevice}
            onCancel={() => {
              setEditingDevice(null);
              setShowAddDeviceForm(false);
              setSelectedClientForDevice(null);
            }}
            isAddingToExistingClient={!!selectedClientForDevice}
          />
        )}

        {showAddClientForm && (
          <ClientForm
            client={editingClient}
            onSubmit={editingClient ? handleUpdateClient : handleAddClient}
            onCancel={() => {
              setShowAddClientForm(false);
              setEditingClient(null);
            }}
            isEditing={!!editingClient}
          />
        )}

        {showUpdateConfirm && (
          <UpdateConfirmationDialog
            showUpdateConfirm={showUpdateConfirm}
            onConfirm={() => {/* Confirm handler */}}
            onCancel={() => setShowUpdateConfirm(null)}
          />
        )}

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
          />
        )}

        <ServiceImages
          serviceId={selectedService?.id}
          isOpen={showServiceImages}
          onClose={() => {
            setShowServiceImages(false);
            setSelectedService(null);
          }}
        />

        <ServiceUpdateModal
          isOpen={showServiceUpdateModal}
          onClose={() => {
            setShowServiceUpdateModal(false);
            setSelectedDevice(null);
          }}
          onConfirm={handleServiceUpdateConfirm}
          device={selectedDevice}
          inspectionInterval={getInspectionInterval ? getInspectionInterval(selectedDevice?.deviceType) : 12}
        />

        <ServiceFormModal
          isOpen={showServiceFormModal}
          editingService={null}
          selectedDate={null}
          clients={serviceFormDevice ? [serviceFormDevice.client] : []}
          preselectedClientId={serviceFormDevice?.client?.id}
          preselectedDeviceId={serviceFormDevice?.id}
          onSubmit={handleServiceSubmit}
          onClose={() => {
            setShowServiceFormModal(false);
            setServiceFormDevice(null);
          }}
        />

      </div>
    </>
  );
};

export default ClientsPage;