import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExternalServicesHealth from '../components/settings/ExternalServicesHealth';

const ExternalServicesTestPage = () => {
  const navigate = useNavigate();

  const pageStyle = {
    height: '100vh',
    backgroundColor: '#f5f3ef',
    overflow: 'auto',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    width: '100%',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '1px solid #e5e7eb',
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
    color: '#374151',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };

  const titleStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: '#2c3e50',
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: 16,
    color: '#5a6c7d',
    margin: '8px 0 0 0',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header with back button */}
        <div style={headerStyle}>
          <button
            onClick={() => navigate('/dashboard')}
            style={backButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <ArrowLeft size={16} />
            Powrót do Dashboard
          </button>
          
          <div>
            <h1 style={titleStyle}>
              🔍 Testy Usług Zewnętrznych
            </h1>
            <p style={subtitleStyle}>
              Monitoruj status i sprawdzaj działanie wszystkich zintegrowanych usług zewnętrznych
            </p>
          </div>
        </div>

        {/* External Services Health Component */}
        <ExternalServicesHealth />
      </div>
    </div>
  );
};

export default ExternalServicesTestPage;