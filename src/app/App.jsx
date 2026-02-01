import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { NetworkStatusProvider, useNetworkStatus } from '../contexts/NetworkStatusContext';
import { DEMO_MODE } from '../demo/demoMode';
import { useNotification } from '../contexts/NotificationContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';
import TabNavigation from '../components/common/TabNavigation';
import Loading from '../components/common/Loading';
import { useClients } from '../hooks/useClients';
import { useSettings } from '../hooks/useSettings';
import { useGoogleMaps } from '../hooks/useMap';
import ServicesAPI from '../services/api/services';

// Lazy load pages that are not part of main app tabs
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
const SmsHistoryPage = lazy(() => import('../pages/admin/SmsHistoryPage'));
const PlannedSmsPage = lazy(() => import('../pages/admin/PlannedSmsPage'));
const ExternalServicesTestPage = lazy(() => import('../pages/ExternalServicesTestPage'));
const ConfirmationPage = lazy(() => import('../pages/ConfirmationPage'));

// Import main tab pages directly (no lazy loading) to avoid tab switching delays
import HeatingServiceMap from '../pages/HeatingServiceMap';
import ClientsPage from '../pages/ClientsPage';
import CustomClientsPage from '../pages/CustomClientsPage';
import ServicesPage from '../pages/ServicesPage';
import SettingsPage from '../pages/SettingsPage';

// Main application component (after authentication)
const MainApp = () => {
  const location = useLocation();
  const notification = useNotification();

  // Load Google Maps at app level to avoid loading issues on tab changes
  const { isLoaded: mapsLoaded, loadError: mapsError } = useGoogleMaps();

  // Get initial tab from URL parameters
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'map';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const {
    clients,
    devices,
    addClient,
    addDeviceToClient,
    updateClient,
    updateDevice,
    deleteDevice,
    deleteClient,
    sendSMS,
    loading: clientsLoading,
    error: clientsError
  } = useClients();

  const {
    settings,
    updateSettings,
    getInspectionInterval,
    getMaintenancePrice,
    generateSMSMessage,
    resetSettings,
    loading: settingsLoading,
    error: settingsError
  } = useSettings();

  // Update tab when URL parameters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  // Show notification when clients fail to load
  useEffect(() => {
    if (clientsError) {
      notification.showError('Nie udało się załadować klientów');
    }
  }, [clientsError, notification]);

  // Show notification when settings fail to load
  useEffect(() => {
    if (settingsError) {
      notification.showError('Nie udało się załadować ustawień');
    }
  }, [settingsError, notification]);

  // Track when initial loading is complete
  useEffect(() => {
    if (!clientsLoading && !settingsLoading && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
  }, [clientsLoading, settingsLoading, hasInitiallyLoaded]);

  const handleNavigateToClient = (clientId, isCustomClient = false) => {
    if (isCustomClient) {
      setActiveTab('custom-clients');
      // Store the client ID in session storage for the custom clients page to highlight
      sessionStorage.setItem('highlightCustomClientId', clientId);
    } else {
      setActiveTab('clients');
      setSelectedClientId(clientId);
    }
  };

  const handleNavigateToMap = (customClientId) => {
    // Store the custom client ID to center map on it
    sessionStorage.setItem('centerMapOnCustomClientId', customClientId);
    // Switch to map tab
    setActiveTab('map');
  };

  const handleNavigateToCalendar = (serviceEntry) => {
    // Switch to services (calendar) tab
    setActiveTab('services');

    // Store service info for the calendar to highlight
    // Use the correct date field based on service entry structure
    const serviceDate = serviceEntry.startDateTime || serviceEntry.serviceDate;
    sessionStorage.setItem('highlightServiceId', serviceEntry.id);
    sessionStorage.setItem('highlightServiceDate', serviceDate);
  };

  // Removed duplicate client highlighting logic - now handled entirely in ClientsPage

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <HeatingServiceMap
            devices={devices}
            onSendSMS={sendSMS}
            onAddClient={addClient}
            onNavigateToClient={handleNavigateToClient}
            loading={clientsLoading}
            error={clientsError}
            mapsLoaded={mapsLoaded}
            mapsError={mapsError}
          />
        );
      case 'clients':
        return (
          <ClientsPage
            clients={clients}
            selectedClientId={selectedClientId}
            onUpdateClient={updateClient}
            onUpdateDevice={updateDevice}
            onDeleteDevice={deleteDevice}
            onDeleteClient={deleteClient}
            onAddDeviceToClient={addDeviceToClient}
            onAddClient={addClient}
            onCreateService={ServicesAPI.createService}
            onSendSMS={sendSMS}
            onNavigateToCalendar={handleNavigateToCalendar}
            settings={settings}
            generateSMSMessage={generateSMSMessage}
            getInspectionInterval={getInspectionInterval}
            getMaintenancePrice={getMaintenancePrice}
            loading={clientsLoading}
            error={clientsError}
          />
        );
      case 'custom-clients':
        return (
          <CustomClientsPage onNavigateToMap={handleNavigateToMap} />
        );
      case 'services':
        return (
          <ServicesPage
            clients={clients}
            loading={clientsLoading}
            error={clientsError}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetSettings={resetSettings}
            loading={settingsLoading}
            error={settingsError}
          />
        );
      default:
        return null;
    }
  };

  // Only show detailed loading screen on initial load (after login)
  // After that, let individual pages handle their own loading states
  if ((clientsLoading || settingsLoading) && !hasInitiallyLoaded) {
    return <Loading fullScreen detailed />;
  }

  if (clientsError || settingsError) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ color: '#dc2626', fontSize: 18, fontWeight: 600 }}>
          Error loading application
        </div>
        <div style={{ color: '#6b7280', fontSize: 14, textAlign: 'center' }}>
          {clientsError || settingsError}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{
        flex: 1,
        overflow: activeTab === 'map' ? 'hidden' : 'auto',
        backgroundColor: '#f9fafb',
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

// Wrapper component to connect network status to axios (disabled in demo mode)
const NetworkStatusConnector = ({ children }) => {
  // In demo mode, skip network status tracking
  if (DEMO_MODE) {
    return children;
  }

  return children;
};

// Main App component with routing
const App = () => {
  return (
    <NotificationProvider>
      <NetworkStatusProvider>
        <NetworkStatusConnector>
          <AuthProvider>
            <Router>
              <Suspense fallback={<Loading fullScreen detailed />}>
                <Routes>
                  {/* Public landing page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Public routes */}
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/register" element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } />

                  {/* Protected routes */}
                  <Route path="/app" element={
                    <ProtectedRoute>
                      <MainApp />
                    </ProtectedRoute>
                  } />

                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <UserManagement />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/reports" element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/sms-history" element={
                    <ProtectedRoute>
                      <SmsHistoryPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/planned-sms" element={
                    <ProtectedRoute>
                      <PlannedSmsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/external-services" element={
                    <ProtectedRoute>
                      <ExternalServicesTestPage />
                    </ProtectedRoute>
                  } />

                  {/* Confirmation route (public) */}
                  <Route path="/confirm/:token" element={
                    <ConfirmationPage />
                  } />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </NetworkStatusConnector>
      </NetworkStatusProvider>
    </NotificationProvider>
  );
};

export default App;