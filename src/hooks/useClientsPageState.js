import { useState, useEffect } from 'react';
import { tokenStorage } from '@/services/storage/tokenStorage';

/**
 * Custom hook for managing ClientsPage state
 */
export const useClientsPageState = (selectedClientId) => {
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
  const [showSMSDialog, setShowSMSDialog] = useState(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);

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

    // Auto-scroll to selected client when navigating from map
    if (selectedClientId) {
      setTimeout(() => {
        const clientElement = document.getElementById(`client-${selectedClientId}`);
        if (clientElement) {
          clientElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  }, [selectedClientId]);

  // Helper functions
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const resetDeviceForm = () => {
    setEditingDevice(null);
    setShowAddDeviceForm(false);
    setSelectedClientForDevice(null);
  };

  const resetClientForm = () => {
    setShowAddClientForm(false);
    setEditingClient(null);
  };

  const resetSMSDialog = () => {
    setShowSMSDialog(null);
    setSmsMessage('');
  };

  return {
    // Debug states
    showDebugInfo,
    setShowDebugInfo,
    debugInfo,
    setDebugInfo,

    // Form states
    searchQuery,
    setSearchQuery,
    editingDevice,
    setEditingDevice,
    showAddDeviceForm,
    setShowAddDeviceForm,
    showAddClientForm,
    setShowAddClientForm,
    editingClient,
    setEditingClient,
    selectedClientForDevice,
    setSelectedClientForDevice,
    expandedSMSHistory,
    setExpandedSMSHistory,
    expandedServiceHistory,
    setExpandedServiceHistory,

    // Filter states
    deviceTypeFilter,
    setDeviceTypeFilter,
    inspectionFilter,
    setInspectionFilter,
    confirmationFilter,
    setConfirmationFilter,
    sortOption,
    setSortOption,

    // Dialog states
    showUpdateConfirm,
    setShowUpdateConfirm,
    showSMSDialog,
    setShowSMSDialog,
    smsMessage,
    setSmsMessage,
    smsLoading,
    setSmsLoading,

    // Service modal states
    showServiceImages,
    setShowServiceImages,
    selectedService,
    setSelectedService,
    showServiceUpdateModal,
    setShowServiceUpdateModal,
    selectedDevice,
    setSelectedDevice,
    showServiceFormModal,
    setShowServiceFormModal,
    serviceFormDevice,
    setServiceFormDevice,

    // Success popup states
    showSuccessPopup,
    setShowSuccessPopup,
    successMessage,
    setSuccessMessage,
    isAddingClient,
    setIsAddingClient,

    // Retry states
    retryCount,
    setRetryCount,
    isRetrying,
    setIsRetrying,

    // Helper functions
    showSuccessMessage,
    resetDeviceForm,
    resetClientForm,
    resetSMSDialog
  };
};