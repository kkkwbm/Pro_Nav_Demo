import React from 'react';
import { User, Phone, MapPin, Search, Loader2 } from 'lucide-react';

const ClientSelector = ({
  clientSearch,
  onClientSearchChange,
  showClientDropdown,
  setShowClientDropdown,
  searchResults,
  isSearching,
  onClientSelect,
  selectedClient,
  formData,
  setFormData,
  isEditing
}) => {
  return (
    <div style={{
      background: '#f9fafb',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      border: '1px solid #e5e7eb',
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: 16,
        fontWeight: 600,
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <User size={18} />
        Dane klienta
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block',
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 6,
          color: '#374151',
        }}>
          Klient *
        </label>
        <div style={{ position: 'relative' }} data-client-search>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => onClientSearchChange(e.target.value)}
              onFocus={() => setShowClientDropdown(true)}
              placeholder="Wyszukaj klienta po imieniu, nazwisku lub telefonie..."
              disabled={isEditing}
              style={{
                width: '100%',
                padding: '10px 40px 10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
                backgroundColor: isEditing ? '#f3f4f6' : 'white',
              }}
            />
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            {isSearching && (
              <Loader2 
                size={16} 
                className="animate-spin"
                style={{
                  position: 'absolute',
                  right: 40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#3b82f6'
                }}
              />
            )}
          </div>
          
          {showClientDropdown && searchResults.length > 0 && !isEditing && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              maxHeight: 200,
              overflowY: 'auto',
              zIndex: 1000,
            }}>
              {searchResults.map(client => (
                <div
                  key={client.id}
                  onClick={() => onClientSelect(client)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>
                      {client.imie} {client.nazwisko}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {client.telefon}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {client.devices?.length || 0} urządzeń
                  </div>
                </div>
              ))}
            </div>
          )}

          {showClientDropdown && clientSearch.length >= 2 && searchResults.length === 0 && !isSearching && !isEditing && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: 12,
              textAlign: 'center',
              color: '#6b7280',
              zIndex: 1000,
            }}>
              Nie znaleziono klientów
            </div>
          )}
        </div>
      </div>

      {selectedClient && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
              color: '#374151',
            }}>
              Telefon
            </label>
            <div style={{
              padding: '10px 12px',
              backgroundColor: 'white',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              fontSize: 14,
              color: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Phone size={16} color="#9ca3af" />
              {selectedClient.telefon}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
              color: '#374151',
            }}>
              Urządzenie *
            </label>
            <select
              value={formData.deviceId}
              onChange={(e) => setFormData({...formData, deviceId: e.target.value})}
              disabled={isEditing}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
                backgroundColor: isEditing ? '#f3f4f6' : 'white',
              }}
            >
              <option value="">Wybierz urządzenie</option>
              {selectedClient.devices && selectedClient.devices.length > 0 ? (
                selectedClient.devices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.typUrzadzenia} - {device.nazwaUrzadzenia}
                  </option>
                ))
              ) : (
                <option value="" disabled>Brak urządzeń dla tego klienta</option>
              )}
            </select>
            {selectedClient.devices && selectedClient.devices.length === 0 && (
              <div style={{
                marginTop: 8,
                padding: 8,
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: 4,
                fontSize: 12,
              }}>
                Ten klient nie ma żadnych urządzeń. Dodaj urządzenie w sekcji Klienci.
              </div>
            )}
          </div>

          {formData.deviceId && selectedClient.devices && (
            <div>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: '#374151',
              }}>
                Adres
              </label>
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'white',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                fontSize: 14,
                color: '#4b5563',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <MapPin size={16} color="#9ca3af" />
                {(() => {
                  const device = selectedClient.devices.find(d => d.id === parseInt(formData.deviceId));
                  return device ? 
                    `${device.ulica} ${device.nrDomu}${device.nrLokalu ? '/' + device.nrLokalu : ''}, ${device.kodPocztowy} ${device.miejscowosc}` : 
                    '';
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientSelector;