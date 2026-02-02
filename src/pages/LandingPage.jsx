import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar, Phone, Wind, Flame, Droplet, ThermometerSnowflake, PlayCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { DEMO_MODE } from '../demo/demoMode';
import Loading from '../components/common/Loading';
import ServiceRequestForm from '../components/public/ServiceRequestForm';
import SuccessModal from '../components/common/SuccessModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { settings, loading } = useSettings();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (loading) {
    return <Loading fullScreen detailed />;
  }

  const handleFormSuccess = (message) => {
    setShowRequestForm(false);
    setSuccessMessage(message || 'Skontaktujemy się z Tobą wkrótce w celu ustalenia terminu wizyty serwisowej.');
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
    navigate('/');
  };

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f3ef',
  };

  const headerStyle = {
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const logoStyle = {
    padding: 8,
    backgroundColor: '#e67e22',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const brandTextStyle = {
    fontSize: 22,
    fontWeight: 700,
    color: '#ecf0f1',
  };

  const loginButtonStyle = {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#ecf0f1',
    border: '2px solid #ecf0f1',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '70px 20px 50px',
    textAlign: 'center',
  };

  const heroTitleStyle = {
    fontSize: 46,
    fontWeight: 900,
    color: '#2c3e50',
    marginBottom: 18,
    lineHeight: 1.2,
  };

  const heroSubtitleStyle = {
    fontSize: 19,
    color: '#5a6c7d',
    marginBottom: 36,
    maxWidth: 650,
    lineHeight: 1.55,
  };

  const servicesListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    marginBottom: 44,
    maxWidth: 750,
  };

  const serviceTagStyle = {
    padding: '9px 18px',
    backgroundColor: '#fff',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    color: '#2c3e50',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  };

  const requestButtonStyle = {
    padding: '15px 38px',
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 3px 8px rgba(230, 126, 34, 0.35)',
    display: 'flex',
    alignItems: 'center',
    gap: 9,
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: 28,
    maxWidth: 920,
    width: '100%',
    marginTop: 70,
  };

  const featureCardStyle = {
    padding: 28,
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 14,
    transition: 'all 0.25s ease',
    borderLeft: '4px solid #e67e22',
  };

  const featureIconStyle = {
    padding: 14,
    backgroundColor: '#fef5e7',
    borderRadius: 6,
    color: '#e67e22',
  };

  const featureTitleStyle = {
    fontSize: 17,
    fontWeight: 700,
    color: '#2c3e50',
    margin: 0,
  };

  const featureDescStyle = {
    fontSize: 14,
    color: '#5a6c7d',
    margin: 0,
    lineHeight: 1.65,
    textAlign: 'left',
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={logoContainerStyle}>
          <div style={logoStyle}>
            <Wrench size={20} color="white" />
          </div>
          <span style={brandTextStyle}>SerwisPro</span>
        </div>
        <button
          style={{
            ...loginButtonStyle,
            backgroundColor: DEMO_MODE ? '#e67e22' : 'transparent',
            borderColor: DEMO_MODE ? '#e67e22' : '#ecf0f1',
          }}
          onClick={() => navigate('/app')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = DEMO_MODE ? '#d35400' : '#ecf0f1';
            e.target.style.color = DEMO_MODE ? '#fff' : '#2c3e50';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = DEMO_MODE ? '#e67e22' : 'transparent';
            e.target.style.color = '#ecf0f1';
          }}
        >
          {DEMO_MODE ? (
            <>
              <PlayCircle size={16} style={{ marginRight: 6 }} />
              Przejdź do demo
            </>
          ) : (
            'Logowanie dla pracowników'
          )}
        </button>
      </header>

      <main style={mainStyle}>
        <h1 style={heroTitleStyle}>
          Profesjonalny serwis<br />urządzeń grzewczych i chłodzących
        </h1>
        <p style={heroSubtitleStyle}>
          Zapewniamy kompleksową obsługę i regularne przeglądy Twojego urządzenia.
          Skontaktuj się z nami, aby umówić wizytę serwisową.
        </p>

        <div style={servicesListStyle}>
          <div style={serviceTagStyle}>
            <ThermometerSnowflake size={20} />
            <span>Pompy ciepła</span>
          </div>
          <div style={serviceTagStyle}>
            <Flame size={20} />
            <span>Kotły gazowe</span>
          </div>
          <div style={serviceTagStyle}>
            <Wind size={20} />
            <span>Klimatyzatory</span>
          </div>
          <div style={serviceTagStyle}>
            <Droplet size={20} />
            <span>Kotły olejowe</span>
          </div>
        </div>

        <button
          style={requestButtonStyle}
          onClick={() => setShowRequestForm(true)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d35400';
            e.target.style.boxShadow = '0 4px 12px rgba(230, 126, 34, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#e67e22';
            e.target.style.boxShadow = '0 3px 8px rgba(230, 126, 34, 0.35)';
          }}
        >
          <Calendar size={20} />
          Zamów wizytę serwisową
        </button>

        <div style={featuresStyle}>
          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderLeftWidth = '6px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderLeftWidth = '4px';
            }}
          >
            <div style={featureIconStyle}>
              <Wrench size={26} />
            </div>
            <h3 style={featureTitleStyle}>Kompleksowy serwis</h3>
            <p style={featureDescStyle}>
              Doświadczeni technicy zapewniają profesjonalną obsługę pomp ciepła, kotłów gazowych i olejowych oraz klimatyzatorów
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderLeftWidth = '6px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderLeftWidth = '4px';
            }}
          >
            <div style={featureIconStyle}>
              <Calendar size={26} />
            </div>
            <h3 style={featureTitleStyle}>Regularne przeglądy</h3>
            <p style={featureDescStyle}>
              Przypomnimy Ci o nadchodzącym przeglądzie, aby Twoje urządzenie zawsze działało sprawnie i bezpiecznie
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderLeftWidth = '6px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderLeftWidth = '4px';
            }}
          >
            <div style={featureIconStyle}>
              <Phone size={26} />
            </div>
            <h3 style={featureTitleStyle}>Szybki kontakt</h3>
            <p style={featureDescStyle}>
              Zadzwoń pod numer <strong style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{settings?.companyInfo?.phone || '123 456 789'}</strong> - jesteśmy do Twojej dyspozycji
            </p>
          </div>
        </div>
      </main>

      {showRequestForm && (
        <ServiceRequestForm
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Dziękujemy za zgłoszenie!"
        message={successMessage}
      />
    </div>
  );
};

export default LandingPage;
