import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { tokenStorage } from '@/services/storage/tokenStorage';

const ErrorDisplay = ({
  error,
  onRetry,
  debugInfo,
  showDebugInfo,
  setShowDebugInfo,
  isRetrying,
  retryCount,
  handleRetry
}) => {
  const handleAuthError = (error) => {
    console.error('[ErrorDisplay] Auth Error:', error);

    if (error?.response?.status === 401) {
      tokenStorage.clearAll();
      return {
        title: 'Wymagana Autentykacja',
        message: 'Twoja sesja wygasła. Zaloguj się ponownie.',
        canRetry: false
      };
    }

    if (error?.response?.status === 403) {
      return {
        title: 'Brak Dostępu',
        message: `Nie masz uprawnień do tego zasobu.`,
        canRetry: false
      };
    }

    return {
      title: 'Błąd Ładowania Danych',
      message: error?.message || 'Wystąpił nieoczekiwany błąd',
      canRetry: true
    };
  };

  const errorInfo = typeof error === 'string' ? { message: error } : handleAuthError(error);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 40,
      backgroundColor: '#fef2f2',
      borderRadius: 12,
      border: '1px solid #fecaca',
      margin: 20
    }}>
      <AlertTriangle size={48} color="#dc2626" />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#991b1b' }}>
          {errorInfo?.title || 'Błąd Ładowania Klientów'}
        </h3>
        <p style={{ margin: '0 0 16px 0', color: '#7f1d1d' }}>
          {errorInfo?.message || error}
        </p>
        {debugInfo && (
          <details style={{ marginTop: 16, textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#991b1b', fontWeight: 600 }}>
              Informacje Diagnostyczne
            </summary>
            <pre style={{
              marginTop: 8,
              padding: 12,
              backgroundColor: '#f9fafb',
              borderRadius: 4,
              fontSize: 12,
              overflow: 'auto'
            }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {(errorInfo?.canRetry !== false) && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onRetry || handleRetry}
            disabled={isRetrying}
            style={{
              padding: '10px 20px',
              backgroundColor: isRetrying ? '#9ca3af' : '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: isRetrying ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Ponawiam...' : 'Spróbuj Ponownie'}
          </button>

          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {showDebugInfo ? 'Ukryj' : 'Pokaż'} Informacje Diagnostyczne
          </button>
        </div>
      )}

      {retryCount > 0 && (
        <p style={{ fontSize: 12, color: '#7f1d1d', margin: 0 }}>
          Próby ponowienia: {retryCount}/3
        </p>
      )}
    </div>
  );
};

export default ErrorDisplay;