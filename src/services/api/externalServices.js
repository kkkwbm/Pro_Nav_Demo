import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';

/**
 * External Services Testing API
 * Provides methods for testing connectivity to all external services
 */
export const externalServicesApi = {
  /**
   * Test all external services
   * Combines backend and frontend service checks
   */
  testAllServices: async () => {
    if (DEMO_MODE) {
      await simulateDelay(500);

      // Test frontend-specific services
      const frontendTests = await testFrontendServices();

      return {
        overallStatus: 'HEALTHY',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            serviceName: 'PostgreSQL Database',
            healthy: true,
            status: 'CONNECTED',
            responseTimeMs: 15,
            message: 'Database connection OK (demo)',
          },
          smsService: {
            serviceName: 'SMS-FLY Gateway',
            healthy: true,
            status: 'CONFIGURED',
            responseTimeMs: 120,
            message: 'SMS service configured and ready (demo)',
          },
          googleCalendar: {
            serviceName: 'Google Calendar API',
            healthy: true,
            status: 'AUTHENTICATED',
            responseTimeMs: 80,
            message: 'Calendar integration active (demo)',
          },
          googleCloudStorage: {
            serviceName: 'Google Cloud Storage',
            healthy: true,
            status: 'CONNECTED',
            responseTimeMs: 45,
            message: 'Storage bucket accessible (demo)',
          },
          googleMapsGeocoding: {
            serviceName: 'Google Maps Geocoding API',
            healthy: true,
            status: 'ACTIVE',
            responseTimeMs: 60,
            message: 'Geocoding API active (demo)',
          },
          googleMapsJavaScript: frontendTests.googleMapsJavaScript,
        },
        summary: {
          total: 6,
          healthy: 6,
          unhealthy: 0,
          healthPercentage: 100,
        },
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Test individual backend service
   */
  testBackendService: async (serviceName) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        serviceName: serviceName,
        healthy: true,
        status: 'OK',
        responseTimeMs: Math.floor(Math.random() * 100) + 20,
        message: `${serviceName} is working correctly (demo)`,
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Get service configuration status
   */
  getConfiguration: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return {
        database: { configured: true, type: 'PostgreSQL' },
        sms: { configured: true, provider: 'SMS-FLY' },
        calendar: { configured: true, provider: 'Google Calendar' },
        storage: { configured: true, provider: 'Google Cloud Storage' },
        maps: { configured: true, provider: 'Google Maps' },
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Test backend connectivity
   */
  testBackendConnectivity: async () => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      return {
        healthy: true,
        responseTimeMs: 25,
        status: 'CONNECTED',
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Create test calendar event
   */
  createTestCalendarEvent: async () => {
    if (DEMO_MODE) {
      await simulateDelay(400);
      return {
        success: true,
        message: 'Test event created successfully (demo)',
        eventId: 'demo-event-' + Date.now(),
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Upload test file to storage
   */
  uploadTestFile: async (file = null) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return {
        success: true,
        message: 'Test file uploaded successfully (demo)',
        fileUrl: 'https://demo-storage.example.com/test-file.txt',
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Test SMS sending (dry run by default)
   */
  testSmsSend: async (phoneNumber = '+48123456789', message = null, dryRun = true) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        message: dryRun
          ? 'SMS test successful (dry run - not sent)'
          : 'SMS sent successfully (demo)',
        phoneNumber: phoneNumber,
        dryRun: dryRun,
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Test geocoding with specific address
   */
  testGeocoding: async (address) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        address: address,
        coordinates: {
          lat: 52.2297,
          lng: 21.0122,
        },
        formattedAddress: address + ', Poland',
      };
    }
    throw new Error('Demo mode only');
  }
};

/**
 * Test frontend-specific services
 * These services can only be tested from the browser
 */
async function testFrontendServices() {
  const results = {};

  // Test Google Maps JavaScript API
  results.googleMapsJavaScript = await testGoogleMapsJavaScript();

  return results;
}

/**
 * Test Google Maps JavaScript API
 */
async function testGoogleMapsJavaScript() {
  const startTime = Date.now();
  const result = {
    serviceName: 'Google Maps JavaScript API',
    healthy: false,
    status: 'NOT_LOADED',
    message: 'Google Maps JavaScript API not loaded'
  };

  try {
    if (window.google && window.google.maps) {
      result.healthy = true;
      result.status = 'LOADED';
      result.message = 'Google Maps JavaScript API is loaded and ready';
      result.responseTimeMs = Date.now() - startTime;

      // Check available libraries
      const libraries = [];
      if (window.google.maps.Marker) libraries.push('marker');
      if (window.google.maps.places) libraries.push('places');
      if (window.google.maps.drawing) libraries.push('drawing');
      if (window.google.maps.geometry) libraries.push('geometry');
      if (window.google.maps.visualization) libraries.push('visualization');

      result.details = {
        version: window.google.maps.version || 'unknown',
        libraries: libraries,
        features: {
          geocoder: !!window.google.maps.Geocoder,
          directionsService: !!window.google.maps.DirectionsService,
          placesService: !!window.google.maps.places?.PlacesService,
          streetView: !!window.google.maps.StreetViewPanorama
        }
      };
    } else {
      // In demo mode, pretend it's loaded
      if (DEMO_MODE) {
        result.healthy = true;
        result.status = 'LOADED';
        result.message = 'Google Maps JavaScript API ready (demo)';
        result.responseTimeMs = 50;
        result.details = {
          version: '3.54 (demo)',
          libraries: ['marker', 'places'],
          features: {
            geocoder: true,
            directionsService: true,
            placesService: true,
            streetView: true
          }
        };
      }
    }
  } catch (error) {
    if (DEMO_MODE) {
      result.healthy = true;
      result.status = 'LOADED';
      result.message = 'Google Maps JavaScript API ready (demo)';
    } else {
      result.healthy = false;
      result.status = 'ERROR';
      result.error = error.message;
      result.message = 'Error testing Google Maps JavaScript API';
    }
  }

  return result;
}


/**
 * Service health status helper
 */
export const ServiceHealthStatus = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED',
  CRITICAL: 'CRITICAL',
  UNKNOWN: 'UNKNOWN',

  getStatusColor: (status) => {
    switch (status) {
      case 'HEALTHY': return '#10b981';
      case 'DEGRADED': return '#f59e0b';
      case 'CRITICAL': return '#ef4444';
      default: return '#6b7280';
    }
  },

  getStatusIcon: (status) => {
    switch (status) {
      case 'HEALTHY': return '✓';
      case 'DEGRADED': return '⚠';
      case 'CRITICAL': return '✕';
      default: return '?';
    }
  },

  getStatusText: (status) => {
    switch (status) {
      case 'HEALTHY': return 'Wszystkie usługi działają';
      case 'DEGRADED': return 'Niektóre usługi mają problemy';
      case 'CRITICAL': return 'Krytyczne problemy z usługami';
      default: return 'Status nieznany';
    }
  }
};

export default externalServicesApi;
