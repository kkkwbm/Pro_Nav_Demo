import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, MapPin, User, Phone, Home, ExternalLink } from 'lucide-react';
import { DEVICE_TYPES } from '@/config/mapConfig';
import { debouncedGeocode, isAddressValidForGeocoding, formatCoordinates } from '@/services/utils/geocodingUtils';

const ClientForm = ({ client, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState(() => {
    // Populate form with client data if provided (either for editing or pre-filling from request)
    if (client) {
      // If client has devices, take data from first device; otherwise use defaults
      const firstDevice = client.devices && client.devices[0];

      return {
        // Client info
        firstName: client.firstName || client.name?.split(' ')[0] || '',
        lastName: client.lastName || client.name?.split(' ').slice(1).join(' ') || '',
        phone: client.phone || '',

        // Device info (from first device if exists, otherwise defaults for new device)
        deviceType: firstDevice?.deviceType || DEVICE_TYPES.HEAT_PUMP,
        deviceName: firstDevice?.deviceName || '',
        installationDate: firstDevice?.installationDate || new Date().toISOString().split('T')[0],
        nextInspectionDate: firstDevice?.nextInspectionDate || '',
        notes: firstDevice?.notes || '',

        // Address components (from first device if exists)
        ulica: firstDevice?.ulica || '',
        nrDomu: firstDevice?.nrDomu || '',
        nrLokalu: firstDevice?.nrLokalu || '',
        kodPocztowy: firstDevice?.kodPocztowy || '',
        miejscowosc: firstDevice?.miejscowosc || '',

        // Position (from first device if exists, otherwise Warsaw coordinates)
        latitude: firstDevice?.position?.lat || 52.2297,
        longitude: firstDevice?.position?.lng || 21.0118,
      };
    } else {
      // Default values for new client with no data
      return {
        // Client info
        firstName: '',
        lastName: '',
        phone: '',

        // Device info
        deviceType: DEVICE_TYPES.HEAT_PUMP,
        deviceName: '',
        installationDate: new Date().toISOString().split('T')[0],
        nextInspectionDate: '',
        notes: '',

        // Address components
        ulica: '',
        nrDomu: '',
        nrLokalu: '',
        kodPocztowy: '',
        miejscowosc: '',

        // Position
        latitude: 52.2297,
        longitude: 21.0118,
      };
    }
  });

  const [geocodingStatus, setGeocodingStatus] = useState('idle');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [showMapPreview, setShowMapPreview] = useState(() => {
    // Show map preview if client data with valid coordinates is provided
    if (client && client.devices && client.devices[0]) {
      const device = client.devices[0];
      return !!(device.position?.lat && device.position?.lng);
    }
    return false;
  });
  const [errors, setErrors] = useState({});

  // Geocode address when address fields change
  useEffect(() => {
    // Skip geocoding when editing (only updating client info)
    if (isEditing) return;

    const addressComponents = {
      ulica: formData.ulica,
      nrDomu: formData.nrDomu,
      nrLokalu: formData.nrLokalu,
      kodPocztowy: formData.kodPocztowy,
      miejscowosc: formData.miejscowosc,
    };

    if (isAddressValidForGeocoding(addressComponents)) {
      setGeocodingStatus('loading');
      
      // Format address for display and Google Maps
      const formattedAddress = formData.nrLokalu 
        ? `${formData.ulica} ${formData.nrDomu}/${formData.nrLokalu}, ${formData.kodPocztowy} ${formData.miejscowosc}, Polska`
        : `${formData.ulica} ${formData.nrDomu}, ${formData.kodPocztowy} ${formData.miejscowosc}, Polska`;
      
      setResolvedAddress(formattedAddress);
      
      debouncedGeocode(addressComponents, (coordinates) => {
        setFormData(prev => ({
          ...prev,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }));
        setGeocodingStatus('success');
        setShowMapPreview(true);
        
        // Reset status after 3 seconds but keep map preview
        setTimeout(() => setGeocodingStatus('idle'), 3000);
      }, 1500);
    } else {
      setResolvedAddress('');
      setShowMapPreview(false);
    }
  }, [formData.ulica, formData.nrDomu, formData.nrLokalu, formData.kodPocztowy, formData.miejscowosc, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    
    // Client validation (always required)
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    } else {
      // Remove spaces and check format
      const cleanedPhone = formData.phone.replace(/\s/g, '');

      // Check if it's a valid Polish phone number
      // Should be either +48XXXXXXXXX (12 chars) or just 9 digits
      const isValidFormat = /^\+48[0-9]{9}$/.test(cleanedPhone) || /^[0-9]{9}$/.test(cleanedPhone);

      if (!isValidFormat) {
        newErrors.phone = 'Numer telefonu musi zawierać 9 cyfr (format: +48XXXXXXXXX lub XXXXXXXXX)';
      }
    }
    
    // Address and device validation (only for new clients)
    if (!isEditing) {
      if (!formData.ulica.trim()) {
        newErrors.ulica = 'Ulica jest wymagana';
      }
      
      if (!formData.nrDomu.trim()) {
        newErrors.nrDomu = 'Numer domu jest wymagany';
      }
      
      if (!formData.kodPocztowy.trim()) {
        newErrors.kodPocztowy = 'Kod pocztowy jest wymagany';
      } else if (!/^\d{2}-\d{3}$/.test(formData.kodPocztowy)) {
        newErrors.kodPocztowy = 'Kod pocztowy musi mieć format XX-XXX';
      }
      
      if (!formData.miejscowosc.trim()) {
        newErrors.miejscowosc = 'Miejscowość jest wymagana';
      }
      
      if (!formData.nextInspectionDate) {
        newErrors.nextInspectionDate = 'Data przeglądu jest wymagana';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      // When editing, only send client data
      const clientData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };
      
      onSubmit(clientData);
    } else {
      // When adding new client, include device and address data
      // Create full address for display
      const fullAddress = formData.nrLokalu 
        ? `${formData.ulica} ${formData.nrDomu}/${formData.nrLokalu}, ${formData.kodPocztowy} ${formData.miejscowosc}`
        : `${formData.ulica} ${formData.nrDomu}, ${formData.kodPocztowy} ${formData.miejscowosc}`;
      
      const clientData = {
        // Client data
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        
        // Device data
        deviceType: formData.deviceType,
        deviceName: formData.deviceName,
        installationDate: formData.installationDate,
        nextInspectionDate: formData.nextInspectionDate,
        notes: formData.notes,
        
        // Full address for display
        address: fullAddress,
        
        // Individual address fields for backend
        ulica: formData.ulica,
        nrDomu: formData.nrDomu,
        nrLokalu: formData.nrLokalu || null,
        kodPocztowy: formData.kodPocztowy,
        miejscowosc: formData.miejscowosc,
        
        // Position data
        position: {
          lat: formData.latitude,
          lng: formData.longitude
        }
      };
      
      onSubmit(clientData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, '');

    // Ensure + is only at the beginning
    if (cleaned.includes('+') && !cleaned.startsWith('+')) {
      cleaned = cleaned.replace(/\+/g, '');
    }

    // Add +48 if no country code and has digits
    if (!cleaned.startsWith('+') && cleaned.length > 0) {
      if (!cleaned.startsWith('48')) {
        cleaned = '+48' + cleaned;
      } else {
        cleaned = '+' + cleaned;
      }
    }

    // Limit to 9 digits after +48 (total 12 characters)
    if (cleaned.startsWith('+48') && cleaned.length > 12) {
      cleaned = cleaned.substring(0, 12);
    }

    return cleaned;
  };

  const setNextInspectionDate = (years) => {
    const installDate = new Date(formData.installationDate);
    const nextDate = new Date(installDate);
    nextDate.setFullYear(installDate.getFullYear() + years);
    
    handleInputChange('nextInspectionDate', nextDate.toISOString().split('T')[0]);
  };

  const getGoogleMapsUrl = () => {
    if (formData.latitude && formData.longitude && resolvedAddress) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resolvedAddress)}&query=${formData.latitude},${formData.longitude}`;
    }
    return '';
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
  };

  const formCardStyle = {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 600,
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
  };

  const formRowStyle = {
    marginBottom: 16,
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    color: '#374151',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: '#ef4444',
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: 80,
    fontFamily: 'inherit',
  };

  const inspectionButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: 12,
    marginTop: 20,
  };

  const primaryButtonStyle = {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.6,
  };

  const secondaryButtonStyle = {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };

  const sectionHeaderStyle = {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    marginTop: 24,
    paddingBottom: 8,
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const geocodingStatusStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    marginTop: 8,
  };

  const mapPreviewStyle = {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  };

  const addressLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    textDecoration: 'none',
    color: '#374151',
    fontSize: 13,
    transition: 'all 0.2s',
    marginBottom: 12,
  };

  const getGeocodingStatusStyle = () => {
    switch (geocodingStatus) {
      case 'loading':
        return {
          ...geocodingStatusStyle,
          backgroundColor: '#fef3c7',
          color: '#92400e',
        };
      case 'success':
        return {
          ...geocodingStatusStyle,
          backgroundColor: '#d1fae5',
          color: '#065f46',
        };
      default:
        return { display: 'none' };
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .map-iframe {
          width: 100%;
          height: 200px;
          border: none;
          border-radius: 6px;
        }
        .address-link:hover {
          background-color: #f3f4f6 !important;
          border-color: #9ca3af !important;
        }
      `}</style>
      <div style={overlayStyle}>
        <div style={formCardStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              {isEditing ? 'Edytuj klienta' : 'Dodaj nowego klienta'}
            </h2>
            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={24} color="#6b7280" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Client Information */}
            <div style={sectionHeaderStyle}>
              <User size={18} />
              Dane klienta
            </div>
            
            <div style={formGridStyle}>
              <div style={formRowStyle}>
                <label style={labelStyle}>Imię *</label>
                <input
                  type="text"
                  placeholder="Jan"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={errors.firstName ? inputErrorStyle : inputStyle}
                />
                {errors.firstName && <div style={errorTextStyle}>{errors.firstName}</div>}
              </div>

              <div style={formRowStyle}>
                <label style={labelStyle}>Nazwisko *</label>
                <input
                  type="text"
                  placeholder="Kowalski"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={errors.lastName ? inputErrorStyle : inputStyle}
                />
                {errors.lastName && <div style={errorTextStyle}>{errors.lastName}</div>}
              </div>
            </div>

            <div style={formRowStyle}>
              <label style={labelStyle}>
                <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
                Telefon *
              </label>
              <input
                type="text"
                placeholder="+48123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                style={errors.phone ? inputErrorStyle : inputStyle}
                maxLength={12}
              />
              {errors.phone && <div style={errorTextStyle}>{errors.phone}</div>}
              {!errors.phone && (
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  Format: +48 i 9 cyfr (np. +48123456789)
                </div>
              )}
            </div>

            {/* Address Information - only show for new clients */}
            {!isEditing && (
              <>
                <div style={sectionHeaderStyle}>
                  <Home size={18} />
                  Adres urządzenia
                </div>
            
                <div style={formRowStyle}>
                  <label style={labelStyle}>Ulica *</label>
                  <input
                    type="text"
                    placeholder="Warszawska"
                    value={formData.ulica}
                    onChange={(e) => handleInputChange('ulica', e.target.value)}
                    style={errors.ulica ? inputErrorStyle : inputStyle}
                  />
                  {errors.ulica && <div style={errorTextStyle}>{errors.ulica}</div>}
                </div>

                <div style={formGridStyle}>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Numer domu *</label>
                    <input
                      type="text"
                      placeholder="10"
                      value={formData.nrDomu}
                      onChange={(e) => handleInputChange('nrDomu', e.target.value)}
                      style={errors.nrDomu ? inputErrorStyle : inputStyle}
                    />
                    {errors.nrDomu && <div style={errorTextStyle}>{errors.nrDomu}</div>}
                  </div>

                  <div style={formRowStyle}>
                    <label style={labelStyle}>Numer lokalu</label>
                    <input
                      type="text"
                      placeholder="2A (opcjonalnie)"
                      value={formData.nrLokalu}
                      onChange={(e) => handleInputChange('nrLokalu', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={formGridStyle}>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Kod pocztowy *</label>
                    <input
                      type="text"
                      placeholder="00-001"
                      value={formData.kodPocztowy}
                      onChange={(e) => handleInputChange('kodPocztowy', e.target.value)}
                      style={errors.kodPocztowy ? inputErrorStyle : inputStyle}
                    />
                    {errors.kodPocztowy && <div style={errorTextStyle}>{errors.kodPocztowy}</div>}
                  </div>

                  <div style={formRowStyle}>
                    <label style={labelStyle}>Miejscowość *</label>
                    <input
                      type="text"
                      placeholder="Warszawa"
                      value={formData.miejscowosc}
                      onChange={(e) => handleInputChange('miejscowosc', e.target.value)}
                      style={errors.miejscowosc ? inputErrorStyle : inputStyle}
                    />
                    {errors.miejscowosc && <div style={errorTextStyle}>{errors.miejscowosc}</div>}
                  </div>
                </div>

                {/* Geocoding Status */}
                <div style={getGeocodingStatusStyle()}>
                  {geocodingStatus === 'loading' && (
                    <>
                      <div style={{
                        width: 12,
                        height: 12,
                        border: '2px solid #f3f4f6',
                        borderTop: '2px solid #92400e',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Określanie współrzędnych...
                    </>
                  )}
                  {geocodingStatus === 'success' && (
                    <>
                      <MapPin size={12} />
                      Współrzędne zaktualizowane: {formatCoordinates({ lat: formData.latitude, lng: formData.longitude })}
                    </>
                  )}
                </div>

                {/* Map Preview Section */}
                {showMapPreview && resolvedAddress && (
                  <div style={mapPreviewStyle}>
                    <a 
                      href={getGoogleMapsUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={addressLinkStyle}
                      className="address-link"
                    >
                      <MapPin size={16} color="#3b82f6" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>
                          {resolvedAddress}
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>
                          {formatCoordinates({ lat: formData.latitude, lng: formData.longitude })}
                        </div>
                      </div>
                      <ExternalLink size={14} color="#6b7280" />
                    </a>
                    
                    {/* Embedded Google Maps */}
                    <iframe
                      className="map-iframe"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(resolvedAddress)}&zoom=15`}
                    />
                  </div>
                )}

                {/* Device Information */}
                <div style={sectionHeaderStyle}>Dane urządzenia</div>

                <div style={formGridStyle}>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Typ urządzenia *</label>
                    <select
                      value={formData.deviceType}
                      onChange={(e) => handleInputChange('deviceType', e.target.value)}
                      style={inputStyle}
                    >
                      <option value={DEVICE_TYPES.HEAT_PUMP}>{DEVICE_TYPES.HEAT_PUMP}</option>
                      <option value={DEVICE_TYPES.GAS_BOILER}>{DEVICE_TYPES.GAS_BOILER}</option>
                      <option value={DEVICE_TYPES.OIL_BOILER}>{DEVICE_TYPES.OIL_BOILER}</option>
                      <option value={DEVICE_TYPES.AIR_CONDITIONER}>{DEVICE_TYPES.AIR_CONDITIONER}</option>
                    </select>
                  </div>

                  <div style={formRowStyle}>
                    <label style={labelStyle}>Nazwa urządzenia</label>
                    <input
                      type="text"
                      placeholder="np. Viessmann Vitocal 200-S"
                      value={formData.deviceName}
                      onChange={(e) => handleInputChange('deviceName', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={formGridStyle}>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Data instalacji *</label>
                    <input
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) => handleInputChange('installationDate', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={formRowStyle}>
                    <label style={labelStyle}>Data następnego przeglądu *</label>
                    <input
                      type="date"
                      value={formData.nextInspectionDate}
                      onChange={(e) => handleInputChange('nextInspectionDate', e.target.value)}
                      style={errors.nextInspectionDate ? inputErrorStyle : inputStyle}
                    />
                    {errors.nextInspectionDate && <div style={errorTextStyle}>{errors.nextInspectionDate}</div>}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: 8, 
                  marginBottom: 16,
                  flexWrap: 'wrap'
                }}>
                  <button
                    type="button"
                    onClick={() => setNextInspectionDate(1)}
                    style={inspectionButtonStyle}
                  >
                    +1 rok
                  </button>
                  <button
                    type="button"
                    onClick={() => setNextInspectionDate(2)}
                    style={inspectionButtonStyle}
                  >
                    +2 lata
                  </button>
                  <button
                    type="button"
                    onClick={() => setNextInspectionDate(5)}
                    style={inspectionButtonStyle}
                  >
                    +5 lat
                  </button>
                </div>

                <div style={formRowStyle}>
                  <label style={labelStyle}>Notatki</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    style={textareaStyle}
                    placeholder="Dodatkowe informacje o urządzeniu lub kliencie..."
                  />
                </div>
              </>
            )}

            <div style={buttonGroupStyle}>
              <button
                type="submit"
                style={primaryButtonStyle}
                disabled
              >
                <Check size={16} />
                {isEditing ? 'Zapisz zmiany' : 'Dodaj klienta'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                style={secondaryButtonStyle}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClientForm;