import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, MapPin, Wrench, User, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';
import { confirmationApi } from '@/services/api/confirmation';

const ConfirmationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [canRetry, setCanRetry] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Ładowanie informacji...');
  const [contactPhoneNumber, setContactPhoneNumber] = useState('123 456 789');

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000; // 3 seconds between retries

  const handleNavigateBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      loadTokenInfo(0);
    }
  }, [token]);

  const loadTokenInfo = async (currentRetry = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Update loading message based on retry count
      if (currentRetry === 0) {
        setLoadingMessage('Ładowanie informacji...');
      } else {
        setLoadingMessage(`Serwer się uruchamia... (próba ${currentRetry + 1}/${MAX_RETRIES + 1})`);
      }

      // Only get token info, don't auto-confirm
      const info = await confirmationApi.getTokenInfo(token);
      setTokenInfo(info);
      setRetryCount(0);

      // Store contact phone number if available
      if (info.contactPhoneNumber) {
        setContactPhoneNumber(info.contactPhoneNumber);
      }

      // Check if already confirmed
      if (info.confirmed) {
        setConfirmed(true);
      } else if (info.expired) {
        setError('Ten link wygasł. Prosimy o kontakt telefoniczny w celu umówienia wizyty.');
      }

    } catch (err) {
      console.error('Error loading token info:', err);

      // Check if this is a retriable error (server/network issues - likely cold start)
      const isRetriableError =
        err.response?.status >= 500 ||
        err.code === 'ERR_NETWORK' ||
        err.code === 'ECONNABORTED' ||
        !err.response;

      // Auto-retry for server/network errors (cold start scenario)
      if (isRetriableError && currentRetry < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms... (attempt ${currentRetry + 1}/${MAX_RETRIES})`);
        setLoadingMessage(`Serwer się uruchamia... (próba ${currentRetry + 2}/${MAX_RETRIES + 1})`);

        setTimeout(() => {
          loadTokenInfo(currentRetry + 1);
        }, RETRY_DELAY);
        return; // Don't set loading to false, keep showing loading state
      }

      // Handle different error cases after all retries exhausted
      if (err.response?.status === 404) {
        setError('Ten link wygasł lub jest nieprawidłowy. Prosimy o kontakt telefoniczny w celu umówienia wizyty.');
        setCanRetry(false);
      } else if (err.response?.status >= 500) {
        setError('Serwer jest chwilowo niedostępny. Spróbuj ponownie za chwilę.');
        setCanRetry(true);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Nie udało się połączyć z serwerem. Sprawdź połączenie internetowe i spróbuj ponownie.');
        setCanRetry(true);
      } else {
        setError('Nie udało się załadować informacji. Sprawdź poprawność linku.');
        setCanRetry(false);
      }

      setRetryCount(currentRetry);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  // Manual retry handler
  const handleRetry = () => {
    setRetryCount(0);
    loadTokenInfo(0);
  };

  const handleConfirmation = async () => {
    if (confirmed || !tokenInfo || tokenInfo.expired) {
      return;
    }

    try {
      setConfirming(true);
      setError(null);
      
      // Get client IP and User Agent (simplified for frontend)
      const result = await confirmationApi.confirmToken(token);
      
      if (result.success) {
        setConfirmed(true);
        // Update token info
        setTokenInfo(prev => ({ ...prev, confirmed: true }));
      } else {
        setError(result.message || 'Nie udało się potwierdzić. Spróbuj ponownie.');
      }
      
    } catch (err) {
      console.error('Confirmation error:', err);
      setError('Wystąpił błąd podczas potwierdzania. Spróbuj ponownie później.');
    } finally {
      setConfirming(false);
    }
  };




  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  };

  const cardStyle = {
    maxWidth: 600,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: 40,
    position: 'relative',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 32,
  };

  const statusIconStyle = {
    width: 80,
    height: 80,
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  };

  const infoSectionStyle = {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  const backButtonStyle = {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s ease',
  };


  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 60,
              height: 60,
              margin: '0 auto 16px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>{loadingMessage}</h2>
            <p style={{ color: '#6b7280' }}>Proszę czekać</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const isExpired = tokenInfo?.expired;
  const isConfirmed = confirmed || tokenInfo?.confirmed;

  // Show error state when loading failed and no token info
  if (error && !tokenInfo) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <button
            onClick={handleNavigateBack}
            style={backButtonStyle}
          >
            <ArrowLeft size={16} />
            Powrót
          </button>

          <div style={headerStyle}>
            <div style={{
              ...statusIconStyle,
              backgroundColor: '#fee2e2',
            }}>
              <XCircle size={48} color="#dc2626" />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Nie można załadować strony
            </h1>

            <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 16 }}>
              {error}
            </p>

            {canRetry && (
              <button
                onClick={handleRetry}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#3b82f6',
                  marginTop: 16,
                }}
              >
                Spróbuj ponownie
              </button>
            )}
          </div>

          <div style={{ marginTop: 32, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
            <p>W razie pytań prosimy o kontakt:</p>
            <p style={{ fontWeight: 600, marginTop: 4 }}>
              <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
              {contactPhoneNumber}
            </p>
            <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
              Godziny pracy: Pon-Pt 8:00-16:00
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={cardStyle}>
        {/* Back button */}
        <button
          onClick={handleNavigateBack}
          style={backButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          <ArrowLeft size={16} />
          Powrót
        </button>

        <div style={headerStyle}>
          <div style={{
            ...statusIconStyle,
            backgroundColor: isConfirmed ? '#d1fae5' : isExpired ? '#fee2e2' : '#fef3c7',
          }}>
            {isConfirmed ? (
              <CheckCircle size={48} color="#059669" />
            ) : isExpired ? (
              <XCircle size={48} color="#dc2626" />
            ) : (
              <Clock size={48} color="#d97706" />
            )}
          </div>
          
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {isConfirmed ? 'Wizyta potwierdzona!' : 
             isExpired ? 'Link wygasł' : 
             'Potwierdzenie wizyty serwisowej'}
          </h1>
          
          <p style={{ fontSize: 16, color: '#6b7280' }}>
            {isConfirmed 
              ? 'Dziękujemy za potwierdzenie. Skontaktujemy się z Państwem w celu ustalenia dokładnego terminu.'
              : isExpired
              ? error || 'Ten link stracił ważność. Prosimy o kontakt telefoniczny.'
              : 'Prosimy o potwierdzenie chęci przeprowadzenia przeglądu serwisowego.'
            }
          </p>
        </div>

        {tokenInfo && tokenInfo.tokenInfo && (
          <div style={infoSectionStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Szczegóły przeglądu
            </h3>
            
            <div style={infoItemStyle}>
              <User size={20} color="#6b7280" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {tokenInfo.tokenInfo.clientName !== 'Błąd danych' 
                    ? tokenInfo.tokenInfo.clientName 
                    : 'Klient'
                  }
                </div>
                {tokenInfo.tokenInfo.clientPhone && tokenInfo.tokenInfo.clientPhone !== '' && (
                  <div style={{ fontSize: 14, color: '#6b7280' }}>
                    {tokenInfo.tokenInfo.clientPhone}
                  </div>
                )}
              </div>
            </div>

            <div style={infoItemStyle}>
              <MapPin size={20} color="#6b7280" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Adres serwisu</div>
                <div style={{ fontWeight: 500 }}>
                  {tokenInfo.tokenInfo.address !== 'Błąd danych' 
                    ? tokenInfo.tokenInfo.address 
                    : 'Adres serwisu'
                  }
                </div>
              </div>
            </div>

            <div style={{ ...infoItemStyle, marginBottom: 0 }}>
              <Wrench size={20} color="#6b7280" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Urządzenie</div>
                <div style={{ fontWeight: 500 }}>
                  {tokenInfo.tokenInfo.deviceType !== 'Błąd danych' 
                    ? tokenInfo.tokenInfo.deviceType 
                    : 'Urządzenie grzewcze'
                  }
                  {tokenInfo.tokenInfo.deviceName && 
                   tokenInfo.tokenInfo.deviceName !== 'Błąd danych' && 
                   ` - ${tokenInfo.tokenInfo.deviceName}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation button - only show if not confirmed and not expired */}
        {!isConfirmed && !isExpired && (
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={handleConfirmation}
              style={{
                ...buttonStyle,
                backgroundColor: confirming ? '#9ca3af' : '#3b82f6',
                cursor: confirming ? 'not-allowed' : 'pointer',
              }}
              disabled={confirming}
              onMouseEnter={(e) => {
                if (!confirming) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!confirming) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              {confirming ? (
                <>
                  <div style={{
                    width: 16,
                    height: 16,
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  Potwierdzanie...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Potwierdzam chęć wykonania przeglądu
                </>
              )}
            </button>
            
            {error && (
              <div style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: '#fee2e2',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <AlertTriangle size={16} color="#dc2626" />
                <span style={{ color: '#dc2626', fontSize: 14 }}>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Success message for confirmed tokens */}
        {isConfirmed && (
          <div style={{
            padding: 16,
            backgroundColor: '#d1fae5',
            borderRadius: 8,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            <p style={{ color: '#065f46', fontWeight: 600, marginBottom: 4 }}>
              ✓ Twoje potwierdzenie zostało zapisane
            </p>
            <p style={{ color: '#047857', fontSize: 14 }}>
              Nasz pracownik skontaktuje się z Państwem w najbliższym czasie w celu ustalenia terminu wizyty
            </p>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
          <p>W razie pytań prosimy o kontakt:</p>
          <p style={{ fontWeight: 600, marginTop: 4 }}>
            <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
            {contactPhoneNumber}
          </p>
          <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Godziny pracy: Pon-Pt 8:00-16:00
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;