import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, Check, X, Calendar, AlertCircle, Map, UserPlus } from 'lucide-react';
import customClientsApi from '../services/api/customClients';
import Loading from '../components/common/Loading';

const CustomClientsPage = ({ onNavigateToMap }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'uncontacted', 'contacted'
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await customClientsApi.getAll(true);
      setClients(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching custom clients:', err);
      setError('Nie udało się załadować zgłoszeń');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    if (filter === 'uncontacted') return !client.contacted;
    if (filter === 'contacted') return client.contacted;
    return true;
  });

  const uncontactedCount = clients.filter(c => !c.contacted).length;

  if (loading) {
    return <Loading fullScreen detailed />;
  }

  const pageStyle = {
    padding: 24,
    maxWidth: 1400,
    margin: '0 auto',
  };

  const headerStyle = {
    marginBottom: 24,
  };

  const titleStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: 8,
  };

  const subtitleStyle = {
    fontSize: 14,
    color: '#5a6c7d',
  };

  const statsRowStyle = {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
  };

  const statCardStyle = {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
  };

  const statLabelStyle = {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  };

  const statValueStyle = {
    fontSize: 32,
    fontWeight: 700,
    color: '#2c3e50',
  };

  const filterRowStyle = {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  };

  const filterButtonStyle = (isActive) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? '#e67e22' : 'white',
    color: isActive ? 'white' : '#374151',
    border: '1px solid ' + (isActive ? '#e67e22' : '#d1d5db'),
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const clientsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 16,
  };

  const clientCardStyle = (isSelected) => ({
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 6,
    border: `2px solid ${isSelected ? '#e67e22' : '#e5e7eb'}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const clientHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: 16,
  };

  const clientNameStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: '#2c3e50',
  };

  const badgeStyle = (contacted) => ({
    padding: '4px 12px',
    backgroundColor: contacted ? '#dcfce7' : '#fef3c7',
    color: contacted ? '#27ae60' : '#ca8a04',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
  });

  const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    fontSize: 14,
    color: '#6b7280',
  };

  const buttonRowStyle = {
    display: 'flex',
    gap: 8,
    marginTop: 16,
  };

  const buttonStyle = (isPrimary) => ({
    flex: 1,
    padding: '8px 12px',
    backgroundColor: isPrimary ? '#e67e22' : '#f3f4f6',
    color: isPrimary ? 'white' : '#374151',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Zgłoszenia serwisowe</h1>
        <p style={subtitleStyle}>
          Zgłoszenia od klientów z publicznej strony
        </p>
      </div>

      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Wszystkie zgłoszenia</div>
          <div style={statValueStyle}>{clients.length}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Nieskontaktowane</div>
          <div style={{ ...statValueStyle, color: '#ca8a04' }}>{uncontactedCount}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Skontaktowane</div>
          <div style={{ ...statValueStyle, color: '#16a34a' }}>{clients.length - uncontactedCount}</div>
        </div>
      </div>

      <div style={filterRowStyle}>
        <button
          style={filterButtonStyle(filter === 'all')}
          onClick={() => setFilter('all')}
          onMouseEnter={(e) => !( filter === 'all') && (e.target.style.backgroundColor = '#f9fafb')}
          onMouseLeave={(e) => !(filter === 'all') && (e.target.style.backgroundColor = 'white')}
        >
          Wszystkie ({clients.length})
        </button>
        <button
          style={filterButtonStyle(filter === 'uncontacted')}
          onClick={() => setFilter('uncontacted')}
          onMouseEnter={(e) => !(filter === 'uncontacted') && (e.target.style.backgroundColor = '#f9fafb')}
          onMouseLeave={(e) => !(filter === 'uncontacted') && (e.target.style.backgroundColor = 'white')}
        >
          Nieskontaktowane ({uncontactedCount})
        </button>
        <button
          style={filterButtonStyle(filter === 'contacted')}
          onClick={() => setFilter('contacted')}
          onMouseEnter={(e) => !(filter === 'contacted') && (e.target.style.backgroundColor = '#f9fafb')}
          onMouseLeave={(e) => !(filter === 'contacted') && (e.target.style.backgroundColor = 'white')}
        >
          Skontaktowane ({clients.length - uncontactedCount})
        </button>
      </div>

      {error && (
        <div style={{ padding: 16, backgroundColor: '#fef2f2', borderRadius: 4, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertCircle size={20} color="#c0392b" />
          <span style={{ color: '#991b1b' }}>{error}</span>
        </div>
      )}

      {filteredClients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, backgroundColor: 'white', borderRadius: 6, border: '1px solid #e5e7eb' }}>
          <Users size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>
            Brak zgłoszeń
          </div>
          <div style={{ fontSize: 14, color: '#9ca3af' }}>
            {filter === 'uncontacted' ? 'Wszystkie zgłoszenia zostały skontaktowane' :
             filter === 'contacted' ? 'Brak skontaktowanych zgłoszeń' :
             'Nie ma żadnych zgłoszeń od klientów'}
          </div>
        </div>
      ) : (
        <div style={clientsGridStyle}>
          {filteredClients.map(client => (
            <div
              key={client.id}
              style={clientCardStyle(selectedClient?.id === client.id)}
              onClick={() => setSelectedClient(client)}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={clientHeaderStyle}>
                <div style={clientNameStyle}>{client.imie} {client.nazwisko}</div>
                <div style={badgeStyle(client.contacted)}>
                  {client.contacted ? 'Skontaktowany' : 'Nowy'}
                </div>
              </div>

              <div style={infoRowStyle}>
                <Phone size={16} />
                <a href={`tel:${client.telefon}`} style={{ color: '#e67e22', textDecoration: 'none' }}>
                  {client.telefon}
                </a>
              </div>

              {client.devices && client.devices.length > 0 && (
                <>
                  <div style={{ ...infoRowStyle, marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
                    <strong style={{ fontSize: 13, color: '#374151', minWidth: 80 }}>
                      {client.devices[0].typUrzadzenia}:
                    </strong>
                    <span>{client.devices[0].nazwaUrzadzenia}</span>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Calendar size={16} color="#6b7280" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        <strong>Instalacja:</strong>{' '}
                        {client.devices[0].dataInstalacji
                          ? new Date(client.devices[0].dataInstalacji).toLocaleDateString('pl-PL')
                          : 'nieznana'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Calendar size={16} color="#6b7280" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        <strong>Ostatni przegląd:</strong>{' '}
                        {client.devices[0].terminPrzegladu
                          ? new Date(client.devices[0].terminPrzegladu).toLocaleDateString('pl-PL')
                          : 'brak'}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: 8, marginBottom: 4 }}>
                      <MapPin size={16} color="#6b7280" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                        <div>
                          {client.devices[0].ulica} {client.devices[0].nrDomu}
                          {client.devices[0].nrLokalu && `/${client.devices[0].nrLokalu}`}
                        </div>
                        <div>
                          {client.devices[0].kodPocztowy} {client.devices[0].miejscowosc}
                        </div>
                      </div>
                    </div>
                  </div>

                  {client.devices[0].notatka && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 600 }}>
                        Wiadomość od klienta:
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: '#374151',
                        backgroundColor: '#f9fafb',
                        padding: 10,
                        borderRadius: 4,
                        fontStyle: 'italic',
                        lineHeight: 1.5
                      }}>
                        "{client.devices[0].notatka}"
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={buttonRowStyle}>
                {client.devices && client.devices.length > 0 && client.devices[0].latitude && client.devices[0].longitude && onNavigateToMap && (
                  <button
                    style={buttonStyle(true)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToMap(client.id);
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#d35400'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e67e22'}
                  >
                    <Map size={14} style={{ marginRight: 4, display: 'inline' }} />
                    Zobacz na mapie
                  </button>
                )}
                {!client.contacted && (
                  <button
                    style={{
                      ...buttonStyle(true),
                      backgroundColor: '#9ca3af',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                    }}
                    disabled
                  >
                    <Check size={14} style={{ marginRight: 4, display: 'inline' }} />
                    Oznacz jako skontaktowany
                  </button>
                )}
                {client.contacted && (
                  <button
                    style={{
                      ...buttonStyle(true),
                      backgroundColor: '#9ca3af',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                    }}
                    disabled
                  >
                    <UserPlus size={14} style={{ marginRight: 4, display: 'inline' }} />
                    Dodaj do bazy klientów
                  </button>
                )}
                <button
                  style={{
                    ...buttonStyle(false),
                    cursor: 'not-allowed',
                    opacity: 0.6,
                  }}
                  disabled
                >
                  <X size={14} style={{ marginRight: 4, display: 'inline' }} />
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CustomClientsPage;
