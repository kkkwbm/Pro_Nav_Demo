import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, OverlayView } from '@react-google-maps/api';
import ClientInfoWindow from './ClientInfoWindow';
import { MAP_CONFIG } from '@/config/mapConfig';
import { getMarkerIcon } from '@/services/utils/mapUtils';

// Custom Marker Component using OverlayView (since AdvancedMarkerElement isn't in @react-google-maps/api yet)
const CustomMarker = ({ position, icon, onClick }) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
      })}
    >
      <div
        onClick={onClick}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
        }}
      >
        <img 
          src={icon.url} 
          alt="marker"
          style={{
            width: icon.scaledSize?.width || 40,
            height: icon.scaledSize?.height || 40,
          }}
        />
      </div>
    </OverlayView>
  );
};

const MapContainer = ({ 
  clients, 
  selectedClients, 
  onMarkerClick, 
  onCloseInfoWindow, 
  onSendSMS,
  onMapLoad,
  onNavigateToClient 
}) => {
  const mapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  const handleMapLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    setIsMapReady(true);
    setMapError(null);
    
    if (onMapLoad) {
      onMapLoad(mapInstance);
    }
  }, [onMapLoad]);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
    setIsMapReady(false);
  }, []);

  const handleMapError = useCallback((error) => {
    console.error('Map loading error:', error);
    setMapError(error);
    setIsMapReady(false);
  }, []);

  // Group clients by position
  const groupedClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) {
      return [];
    }

    const groups = {};

    clients.forEach(client => {
      if (!client.position) return;

      const key = `${client.position.lat}_${client.position.lng}`;
      if (!groups[key]) {
        groups[key] = {
          position: client.position,
          clients: []
        };
      }
      groups[key].clients.push(client);
    });

    return Object.values(groups);
  }, [clients]);

  // Custom marker icon for grouped locations
  const getGroupedMarkerIcon = useCallback((group) => {
    const isMultiple = group.clients.length > 1;

    if (!window.google?.maps) {
      return { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' };
    }

    if (isMultiple) {
      // Check if there are any custom clients (service requests) in the group
      const customClients = group.clients.filter(client => client.isCustomClient);
      const hasCustomClients = customClients.length > 0;

      // Check if any client in the group has service confirmed
      const hasServiceConfirmed = group.clients.some(client => client.serviceConfirmed === true);

      // If group contains ONLY custom clients, show exclamation mark icon
      if (hasCustomClients && customClients.length === group.clients.length) {
        const allContacted = customClients.every(client => client.contacted);
        const color = allContacted ? '#10b981' : '#ec4899'; // Green if all contacted, pink if any new

        return {
          url: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="20" fill="${color}" stroke="white" stroke-width="3"/>
              <text x="22" y="18" text-anchor="middle" fill="white" font-size="24" font-weight="bold">!</text>
              <text x="22" y="35" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${group.clients.length}</text>
            </svg>
          `)}`,
          scaledSize: { width: 44, height: 44 },
          anchor: { x: 22, y: 22 },
        };
      }

      // Mixed group (custom clients + regular clients) - show number with indicators
      const serviceIndicator = hasServiceConfirmed ? `
        <circle cx="34" cy="10" r="6" fill="#dc2626" stroke="white" stroke-width="2"/>
      ` : '';

      // Add custom client indicator (pink dot) if there are any custom clients in mixed group
      const customClientIndicator = hasCustomClients ? `
        <circle cx="10" cy="10" r="6" fill="#ec4899" stroke="white" stroke-width="2"/>
      ` : '';

      return {
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="20" fill="#1f2937" stroke="white" stroke-width="3"/>
            <text x="22" y="28" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${group.clients.length}</text>
            ${customClientIndicator}
            ${serviceIndicator}
          </svg>
        `)}`,
        scaledSize: { width: 44, height: 44 },
        anchor: { x: 22, y: 22 },
      };
    }

    // Single client - use individual marker
    const primaryClient = group.clients[0];
    return getMarkerIcon(primaryClient);
  }, []);

  const handleMarkerClick = useCallback((group) => {
    if (onMarkerClick) {
      onMarkerClick(group.clients);
    }
  }, [onMarkerClick]);

  // Enhanced map options to prevent issues
  const mapOptions = useMemo(() => ({
    ...MAP_CONFIG.options,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ],
    // Prevent map from being dragged outside bounds
    restriction: {
      latLngBounds: {
        north: 55.0,
        south: 49.0,
        west: 14.0,
        east: 24.0,
      },
    },
    // Ensure smooth performance
    gestureHandling: 'greedy',
    clickableIcons: false,
    // Disable the new marker type to avoid deprecation warning for now
    mapId: null,
  }), []);

  // Hide any action buttons that might appear
  useEffect(() => {
    const hideActionButtons = () => {
      // Hide any buttons with "Akcje", "Actions", or similar text
      const actionButtons = document.querySelectorAll('button, div[role="button"]');
      actionButtons.forEach(button => {
        const text = button.textContent || button.innerText;
        if (text && (text.includes('Akcje') || text.includes('Actions') || text.includes('action'))) {
          button.style.display = 'none';
        }
      });

      // Also hide Google Maps specific action controls
      const gmControls = document.querySelectorAll('.gm-control-active, .gm-ui-hover-effect');
      gmControls.forEach(control => {
        const text = control.textContent || control.innerText;
        if (text && (text.includes('Akcje') || text.includes('Actions'))) {
          control.style.display = 'none';
        }
      });
    };

    if (isMapReady) {
      hideActionButtons();
      // Run periodically to catch dynamically added buttons
      const interval = setInterval(hideActionButtons, 1000);
      return () => clearInterval(interval);
    }
  }, [isMapReady]);

  // Check if Google Maps is available
  if (!window.google?.maps) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        fontSize: 16,
        gap: 16
      }}>
        <div style={{
          padding: 20,
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          borderRadius: 8,
          border: '1px solid #fecaca',
          maxWidth: 500,
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Problem z Google Maps</h3>
          <p style={{ margin: '0 0 8px 0' }}>Nie udało się załadować Google Maps API.</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Sprawdź konfigurację klucza API w pliku .env
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Odśwież stronę
        </button>
      </div>
    );
  }

  if (mapError) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        fontSize: 16,
        gap: 16
      }}>
        <div style={{
          padding: 20,
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          borderRadius: 8,
          border: '1px solid #fecaca',
          maxWidth: 500,
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Błąd mapy</h3>
          <p style={{ margin: '0 0 8px 0' }}>Wystąpił błąd podczas ładowania mapy.</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            {mapError.message || 'Nieznany błąd'}
          </p>
        </div>
        <button 
          onClick={() => {
            setMapError(null);
            window.location.reload();
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONFIG.containerStyle}
      center={MAP_CONFIG.defaultCenter}
      zoom={MAP_CONFIG.defaultZoom}
      onLoad={handleMapLoad}
      onUnmount={handleMapUnmount}
      onError={handleMapError}
      options={mapOptions}
    >
      {/* Custom Markers using OverlayView - only render when map is ready */}
      {isMapReady && groupedClients.map((group, index) => (
        <CustomMarker
          key={`group-${index}-${group.position.lat}-${group.position.lng}`}
          position={group.position}
          icon={getGroupedMarkerIcon(group)}
          onClick={() => handleMarkerClick(group)}
        />
      ))}

      {/* Info Window */}
      {isMapReady && selectedClients && selectedClients.length > 0 && (
        <ClientInfoWindow
          clients={selectedClients}
          onClose={onCloseInfoWindow}
          onSendSMS={onSendSMS}
          onNavigateToClient={onNavigateToClient}
        />
      )}
    </GoogleMap>
  );
};

export default MapContainer;