import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';

const NetworkStatusContext = createContext();

export const useNetworkStatus = () => {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
};

export const NetworkStatusProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);

  // Track network errors with debouncing
  const reportNetworkError = () => {
    setOfflineCount(prev => prev + 1);
    setIsOffline(true);
    setShowOfflineMessage(true);
  };

  // Clear offline status when connection is restored
  const reportNetworkSuccess = () => {
    if (isOffline) {
      setIsOffline(false);
      setShowOfflineMessage(false);
      setOfflineCount(0);
    }
  };

  // Auto-hide message after some time
  useEffect(() => {
    if (showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 10000); // Hide after 10 seconds, but keep isOffline flag

      return () => clearTimeout(timer);
    }
  }, [showOfflineMessage]);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  };

  const messageBoxStyle = {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    maxWidth: 600,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  };

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    margin: '0 auto 24px',
    backgroundColor: '#fef2f2',
    borderRadius: '50%',
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 16,
  };

  const messageStyle = {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: 24,
  };

  const detailsStyle = {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    textAlign: 'left',
    marginBottom: 24,
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  return (
    <NetworkStatusContext.Provider value={{ isOffline, reportNetworkError, reportNetworkSuccess }}>
      {children}

      {showOfflineMessage && (
        <div style={overlayStyle}>
          <div style={messageBoxStyle}>
            <div style={iconContainerStyle}>
              <WifiOff size={40} color="#dc2626" strokeWidth={2} />
            </div>

            <h2 style={titleStyle}>
              Serwer jest niedostępny
            </h2>

            <p style={messageStyle}>
              Nie można nawiązać połączenia z serwerem backend.
              Aplikacja nie będzie działać poprawnie, dopóki połączenie nie zostanie przywrócone.
            </p>

            <div style={detailsStyle}>
              <div style={{ marginBottom: 12 }}>
                <strong>Możliwe przyczyny:</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, textAlign: 'left' }}>
                <li>Serwer backend nie jest uruchomiony</li>
                <li>Serwer backend jest w trakcie uruchamiania (może to potrwać 30-60 sekund)</li>
                <li>Problem z połączeniem sieciowym</li>
                <li>Zła konfiguracja adresu URL serwera</li>
              </ul>
            </div>

            <div style={{ marginBottom: 16, fontSize: 14, color: '#6b7280' }}>
              Wykryto <strong>{offlineCount}</strong> nieudanych żądań do serwera
            </div>

            <button
              onClick={() => window.location.reload()}
              style={buttonStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      )}
    </NetworkStatusContext.Provider>
  );
};
