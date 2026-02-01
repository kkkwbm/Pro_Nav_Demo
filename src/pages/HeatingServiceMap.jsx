import React, { useState, useCallback, useRef, useEffect } from 'react';

// Components
import MapContainer from '@/components/map/MapContainer';
import ClientFilters from '@/components/clients/ClientFilters';
import Legend from '@/components/common/Legend';
import Loading from '@/components/common/Loading';

// Hooks
import { useClients } from '@/hooks/useClients';

// Utils
import { filterClients, ALL_DEVICE_TYPES, ALL_INSPECTION_PERIODS } from '@/services/utils/clientUtils';

// API
import customClientsApi from '@/services/api/customClients';

const HeatingServiceMap = ({
  devices: propDevices,
  onSendSMS: propSendSMS,
  onNavigateToClient,
  mapsLoaded,
  mapsError
}) => {
  // Use props from app-level loading if available, otherwise check window
  const isLoaded = mapsLoaded ?? (typeof window !== 'undefined' && window.google && window.google.maps);
  const loadError = mapsError;
  // Use props if provided, otherwise use hook (for backwards compatibility)
  const hookData = useClients();
  const devices = propDevices || hookData.devices;
  const sendSMS = propSendSMS || hookData.sendSMS;

  // Custom clients state
  const [customClients, setCustomClients] = useState([]);
  const [customClientsLoading, setCustomClientsLoading] = useState(true);

  // UI State
  const [selectedClients, setSelectedClients] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  // Filter State - arrays for multi-select (all selected by default)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([...ALL_DEVICE_TYPES]);
  const [selectedPeriods, setSelectedPeriods] = useState([...ALL_INSPECTION_PERIODS]);
  const [serviceConfirmedOnly, setServiceConfirmedOnly] = useState(false);

  // Fetch custom clients with devices
  useEffect(() => {
    const fetchCustomClients = async () => {
      try {
        setCustomClientsLoading(true);
        const data = await customClientsApi.getAll(true);

        // Transform custom clients to match device structure for map display
        const transformedClients = data.flatMap(client => {
          if (!client.devices || client.devices.length === 0) {
            return [];
          }

          return (client.devices || []).map(device => {
            const hasCoordinates = device.latitude && device.longitude;

            return {
              id: `custom-${client.id}-${device.id}`,
              clientId: client.id,
              deviceId: device.id,
              imie: client.imie,
              nazwisko: client.nazwisko,
              telefon: client.telefon,
              typUrzadzenia: device.typUrzadzenia,
              nazwaUrzadzenia: device.nazwaUrzadzenia,
              miejscowosc: device.miejscowosc,
              ulica: device.ulica,
              nrDomu: device.nrDomu,
              nrLokalu: device.nrLokalu,
              kodPocztowy: device.kodPocztowy,
              position: hasCoordinates ? {
                lat: device.latitude,
                lng: device.longitude
              } : null,
              isCustomClient: true, // Flag to identify custom clients
              contacted: client.contacted
            };
          });
        });

        const withCoordinates = transformedClients.filter(device => device.position !== null);
        setCustomClients(withCoordinates);
      } catch (error) {
        console.error('Error fetching custom clients:', error);
        setCustomClients([]);
      } finally {
        setCustomClientsLoading(false);
      }
    };

    fetchCustomClients();
  }, []);

  // Effect to handle map reinitialization when component remounts
  useEffect(() => {
    // Clear any existing map reference when component mounts
    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
      setMap(null);
      setSelectedClients(null);
    };
  }, []);

  // Add spin animation via CSS in head if not already present
  useEffect(() => {
    const styleId = 'map-spin-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes map-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Combine regular devices and custom clients
  const allDevices = [...devices, ...customClients];

  // Filtered devices (using the flattened device structure)
  const filteredClients = filterClients(allDevices, {
    searchQuery,
    filterTypes: selectedTypes,
    inspectionFilters: selectedPeriods,
    confirmationFilter: serviceConfirmedOnly ? 'confirmed' : 'all',
  });

  // Calculate active filter count for display
  const activeFilterCount = [
    searchQuery && searchQuery.length > 0,
    selectedTypes.length !== ALL_DEVICE_TYPES.length,
    selectedPeriods.length !== ALL_INSPECTION_PERIODS.length,
    serviceConfirmedOnly
  ].filter(Boolean).length;

  // Toggle handlers for legend filters
  const handleTypeToggle = useCallback((type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // Don't allow deselecting all types
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  const handlePeriodToggle = useCallback((period) => {
    setSelectedPeriods(prev => {
      if (prev.includes(period)) {
        // Don't allow deselecting all periods
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== period);
      } else {
        return [...prev, period];
      }
    });
  }, []);

  const handleServiceConfirmedToggle = useCallback(() => {
    setServiceConfirmedOnly(prev => !prev);
  }, []);

  // Calculate extended stats for legend
  const legendStats = React.useMemo(() => {
    const validClients = allDevices.filter(c => c && c.deviceType);

    // Device type counts
    const heatPumps = validClients.filter(c => c.deviceType === 'Pompa ciepła').length;
    const gasBoilers = validClients.filter(c => c.deviceType === 'Kocioł gazowy').length;
    const oilBoilers = validClients.filter(c => c.deviceType === 'Kocioł olejowy').length;
    const airConditioners = validClients.filter(c => c.deviceType === 'Klimatyzator').length;

    // Inspection period counts
    const getInspectionPeriod = (dateString) => {
      if (!dateString) return null;
      const diffDays = (new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24);
      if (diffDays < 0) return 'overdue';
      if (diffDays <= 30) return 'urgent';
      if (diffDays <= 90) return 'soon';
      return 'later';
    };

    const overdueInspections = validClients.filter(c => getInspectionPeriod(c.nextInspectionDate) === 'overdue').length;
    const urgentInspections = validClients.filter(c => getInspectionPeriod(c.nextInspectionDate) === 'urgent').length;
    const soonInspections = validClients.filter(c => getInspectionPeriod(c.nextInspectionDate) === 'soon').length;
    const laterInspections = validClients.filter(c => getInspectionPeriod(c.nextInspectionDate) === 'later').length;

    return {
      total: validClients.length,
      heatPumps,
      gasBoilers,
      oilBoilers,
      airConditioners,
      overdueInspections,
      urgentInspections,
      soonInspections,
      laterInspections,
    };
  }, [allDevices]);

  const handleMapLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  }, []);

  // Effect to handle centering map on custom client when navigating from custom clients page
  useEffect(() => {
    const customClientId = sessionStorage.getItem('centerMapOnCustomClientId');
    if (customClientId && map && customClients.length > 0) {
      // Find the custom client by ID
      const client = customClients.find(c => c.clientId === parseInt(customClientId));
      if (client && client.position) {
        // Center map on the client
        map.panTo(client.position);
        map.setZoom(15);
        // Open info window for this client
        setSelectedClients([client]);
        // Clear the session storage
        sessionStorage.removeItem('centerMapOnCustomClientId');
      }
    }
  }, [map, customClients]);

  const handleMarkerClick = useCallback((clients) => {
    setSelectedClients(clients);
  }, []);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedClients(null);
  }, []);

  const handleClientSelect = useCallback((client) => {
    // Center map on selected client
    if (map && client.position) {
      map.panTo(client.position);
      map.setZoom(15);
    }
    // Open info window for this client
    setSelectedClients([client]);
  }, [map]);

  const handleNavigateToClient = useCallback((clientId) => {
    // Close the info window first
    setSelectedClients(null);

    // Find the client to check if it's a custom client
    const client = allDevices.find(d =>
      (d.clientId === clientId || d.id === clientId)
    );

    // Call the parent navigation handler if provided
    if (onNavigateToClient) {
      onNavigateToClient(clientId, client?.isCustomClient);
    }
  }, [onNavigateToClient, allDevices]);

  const handleSendSMS = useCallback(async (device, messageType, customMessage) => {
    try {
      if (sendSMS) {
        return await sendSMS(device, messageType, customMessage);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }, [sendSMS]);

  // Filter status indicator
  const FilterStatusIndicator = () => {
    if (!activeFilterCount && !searchQuery) return null;

    return (
      <div style={{
        position: 'absolute',
        top: 145, // Adjusted for new filter position
        right: 20,
        background: 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 6,
          height: 6,
          background: 'white',
          borderRadius: '50%',
        }} />
        {filteredClients.length} z {allDevices.length} klientów
        {activeFilterCount > 0 && (
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 6px',
            borderRadius: 10,
            fontSize: 11,
          }}>
            {activeFilterCount} filtr{activeFilterCount > 1 ? 'y' : ''}
          </span>
        )}
      </div>
    );
  };

  // Show error if Google Maps fails to load
  if (loadError) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          padding: 24,
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          borderRadius: 12,
          border: '1px solid #fecaca',
          maxWidth: 500,
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: 20 }}>
            Error loading Google Maps
          </h2>
          <p style={{ margin: '0 0 16px 0' }}>
            Failed to load Google Maps API. Please check your API key and internet connection.
          </p>
        </div>
      </div>
    );
  }

  // Show loading while Google Maps is loading
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#f0f9ff',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Animated map icon */}
        <div style={{
          fontSize: 64,
          animation: 'bounce 2s ease-in-out infinite'
        }}>
          🗺️
        </div>

        {/* Loading spinner */}
        <div style={{
          width: 48,
          height: 48,
          border: '4px solid #e0e7ff',
          borderTop: '4px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />

        {/* Loading text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#1e293b',
            margin: 0
          }}>
            Loading Google Maps
          </h3>
          <p style={{
            fontSize: 14,
            color: '#64748b',
            margin: 0
          }}>
            Please wait while we load the map...
          </p>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        `}</style>
      </div>
    );
  }


  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#f9fafb',
      overflow: 'hidden'
    }}>
      <MapContainer
        clients={filteredClients}
        selectedClients={selectedClients}
        onMarkerClick={handleMarkerClick}
        onCloseInfoWindow={handleCloseInfoWindow}
        onSendSMS={handleSendSMS}
        onMapLoad={handleMapLoad}
        onNavigateToClient={handleNavigateToClient}
      />

      {/* Search bar only - filters moved to legend */}
      <ClientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        clients={allDevices}
        onClientSelect={handleClientSelect}
      />

      {/* Filter status indicator */}
      <FilterStatusIndicator />

      {/* Interactive Legend with filters - stats integrated */}
      <Legend
        selectedTypes={selectedTypes}
        selectedPeriods={selectedPeriods}
        serviceConfirmedOnly={serviceConfirmedOnly}
        onTypeToggle={handleTypeToggle}
        onPeriodToggle={handlePeriodToggle}
        onServiceConfirmedToggle={handleServiceConfirmedToggle}
        stats={legendStats}
      />

      {/* Optional: Loading indicator for when map is loading */}
      {!map && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            width: 12,
            height: 12,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'map-spin 1s linear infinite',
          }} />
          Ładowanie mapy...
        </div>
      )}
    </div>
  );
};

export default HeatingServiceMap;
