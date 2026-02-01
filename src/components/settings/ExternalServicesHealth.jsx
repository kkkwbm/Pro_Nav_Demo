import React, { useState, useEffect } from 'react';
import { ServiceHealthStatus } from '@/services/api/externalServices';

const ExternalServicesHealth = () => {
  const [expandedServices, setExpandedServices] = useState({});
  const [lastTestTime, setLastTestTime] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock data for demo - all services healthy
  const mockServicesHealth = {
    overallStatus: 'ALL_HEALTHY',
    summary: {
      total: 5,
      healthy: 5,
      unhealthy: 0,
      healthPercentage: 100
    },
    services: {
      googleCalendar: {
        serviceName: 'Google Calendar',
        healthy: true,
        message: 'Usługa działa poprawnie',
        responseTimeMs: 145,
        details: {
          calendarId: 'primary',
          eventsAccess: true
        }
      },
      googleCloudStorage: {
        serviceName: 'Google Cloud Storage',
        healthy: true,
        message: 'Usługa działa poprawnie',
        responseTimeMs: 89,
        details: {
          bucket: 'tebar-storage',
          accessLevel: 'read-write'
        }
      },
      googleMapsGeocoding: {
        serviceName: 'Google Maps Geocoding',
        healthy: true,
        message: 'Usługa działa poprawnie',
        responseTimeMs: 112,
        details: {
          apiQuota: 'OK',
          lastRequest: 'success'
        }
      },
      googleMapsJavaScript: {
        serviceName: 'Google Maps JavaScript',
        healthy: true,
        message: 'Usługa działa poprawnie',
        responseTimeMs: 78,
        requiresFrontendTest: true,
        details: {
          mapLoaded: true,
          markersSupport: true
        }
      },
      smsService: {
        serviceName: 'SMS Service',
        healthy: true,
        message: 'Usługa działa poprawnie',
        responseTimeMs: 203,
        details: {
          provider: 'SMSApi.pl',
          accountStatus: 'active'
        }
      }
    },
    environment: {
      profile: 'demo',
      serverTime: new Date().toISOString(),
      javaVersion: '17.0.8',
      springBootVersion: '3.5.3'
    }
  };

  const mockSmsBalance = {
    success: true,
    smsBalance: '127.50'
  };

  // Set mock data on mount
  useEffect(() => {
    setLastTestTime(new Date());
  }, []);

  // Mock test function (just updates the timestamp)
  const testAllServices = () => {
    setLastTestTime(new Date());
  };

  const testIndividualService = (serviceName) => {
    // Just a visual feedback - data stays the same
    setLastTestTime(new Date());
  };

  const toggleServiceExpanded = (serviceName) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  const getServiceDisplayName = (key) => {
    const names = {
      googleCalendar: 'Google Calendar',
      googleCloudStorage: 'Google Cloud Storage',
      googleMapsGeocoding: 'Google Maps Geocoding',
      googleMapsJavaScript: 'Google Maps JavaScript',
      smsService: 'SMS Service'
    };
    return names[key] || key;
  };

  const getServiceIcon = (key) => {
    const icons = {
      googleCalendar: '📅',
      googleCloudStorage: '☁️',
      googleMapsGeocoding: '📍',
      googleMapsJavaScript: '🗺️',
      smsService: '💬'
    };
    return icons[key] || '🔧';
  };

  const renderServiceCard = (serviceName, serviceData) => {
    const isExpanded = expandedServices[serviceName];
    const isHealthy = serviceData.healthy;
    const isTesting = false; // Demo mode - never testing
    
    return (
      <div
        key={serviceName}
        style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => toggleServiceExpanded(serviceName)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{getServiceIcon(serviceName)}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                {serviceData.serviceName || getServiceDisplayName(serviceName)}
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
                {serviceData.message}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {serviceData.requiresFrontendTest && (
              <span
                style={{
                  padding: '2px 8px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  borderRadius: 4,
                  fontSize: 12
                }}
              >
                Frontend
              </span>
            )}
            
            {isTesting ? (
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: '2px solid #e67e22',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: isHealthy === null ? '#f3f4f6' :
                                  isHealthy ? '#27ae60' : '#c0392b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {isHealthy === null ? '?' : isHealthy ? '✔' : '✕'}
              </div>
            )}
            
            <span
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                fontSize: 12
              }}
            >
              ▼
            </span>
          </div>
        </div>
        
        {isExpanded && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid #e5e7eb'
            }}
          >
            {/* Service Details */}
            {serviceData.details && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600 }}>
                  Details:
                </h4>
                <pre
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: 8,
                    borderRadius: 4,
                    fontSize: 12,
                    overflow: 'auto'
                  }}
                >
                  {JSON.stringify(serviceData.details, null, 2)}
                </pre>
              </div>
            )}
            
            {/* Response Time */}
            {serviceData.responseTimeMs && (
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: '#6b7280' }}>
                  Response time: {serviceData.responseTimeMs}ms
                </span>
              </div>
            )}
            
            {/* Configuration Required */}
            {serviceData.configurationRequired && (
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  padding: 12,
                  borderRadius: 4,
                  marginBottom: 12
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#92400e' }}>
                  Configuration Required:
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {serviceData.configurationRequired.map((item, idx) => (
                    <li key={idx} style={{ fontSize: 14, color: '#92400e' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Troubleshooting */}
            {serviceData.troubleshooting && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  padding: 12,
                  borderRadius: 4,
                  marginBottom: 12
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#991b1b' }}>
                  Troubleshooting:
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {serviceData.troubleshooting.map((item, idx) => (
                    <li key={idx} style={{ fontSize: 14, color: '#991b1b' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* SMS Balance Information - Only show when service is healthy */}
            {serviceName === 'smsService' && isHealthy && (
              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  padding: 12,
                  marginBottom: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e40af' }}>
                    Account Balance
                  </h4>
                </div>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: 12,
                    borderRadius: 4,
                    border: '1px solid #e0f2fe'
                  }}
                >
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                    SMS Balance
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a' }}>
                    {mockSmsBalance.smsBalance} PLN
                  </div>
                </div>
              </div>
            )}

            {/* Test Button for Backend Services */}
            {!serviceData.requiresFrontendTest && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  testIndividualService(serviceName);
                }}
                disabled={isTesting}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 14,
                  cursor: isTesting ? 'not-allowed' : 'pointer',
                  opacity: isTesting ? 0.5 : 1
                }}
              >
                {isTesting ? 'Testing...' : 'Retest Service'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 'bold' }}>
          External Services Health Check
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Monitor the status of all integrated external services
        </p>
      </div>
      
      {/* Overall Status Card */}
      <div
        style={{
          backgroundColor: ServiceHealthStatus.getStatusColor(mockServicesHealth.overallStatus) + '10',
          border: `1px solid ${ServiceHealthStatus.getStatusColor(mockServicesHealth.overallStatus)}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: ServiceHealthStatus.getStatusColor(mockServicesHealth.overallStatus),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold'
              }}
            >
              {ServiceHealthStatus.getStatusIcon(mockServicesHealth.overallStatus)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {ServiceHealthStatus.getStatusText(mockServicesHealth.overallStatus)}
              </h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                {mockServicesHealth.summary.healthy} of {mockServicesHealth.summary.total} services healthy
                ({Math.round(mockServicesHealth.summary.healthPercentage)}%)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Auto Refresh Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span style={{ fontSize: 14 }}>Auto-refresh</span>
            </label>

            {/* Refresh Button */}
            <button
              onClick={() => testAllServices()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              🔄 Test All Services
            </button>
          </div>
        </div>

        {lastTestTime && (
          <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#6b7280' }}>
            Last tested: {lastTestTime.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Services List */}
      <div>
        {Object.entries(mockServicesHealth.services).map(([name, data]) =>
          renderServiceCard(name, data)
        )}
      </div>

      {/* Environment Info */}
      {mockServicesHealth.environment && (
        <div
          style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 16,
            marginTop: 24
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>
            Environment Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {Object.entries(mockServicesHealth.environment).map(([key, value]) => (
              <div key={key}>
                <span style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add animation keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExternalServicesHealth;