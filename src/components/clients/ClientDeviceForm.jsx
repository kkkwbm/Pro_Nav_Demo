import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, MapPin, ExternalLink } from 'lucide-react';
import { DEVICE_TYPES } from '@/config/mapConfig';
import {
  debouncedGeocode,
  isAddressValidForGeocoding,
  formatCoordinates,
  getCompanyAddressOrDefault,
  isCompanyAddress
} from '@/services/utils/geocodingUtils';

const ClientDeviceForm = ({ device, onSave, onCancel, isAddingToExistingClient }) => {
  const [formData, setFormData] = useState({
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
  });

  const [geocodingStatus, setGeocodingStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error', 'fallback'
  const [geocodingMessage, setGeocodingMessage] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [isUsingCompanyAddress, setIsUsingCompanyAddress] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingGeocodingResult, setPendingGeocodingResult] = useState(null);
  const [userProvidedAddress, setUserProvidedAddress] = useState('');

  useEffect(() => {
    if (device) {
      // Parse address if it exists (for editing existing devices)
      let addressParts = { ulica: '', nrDomu: '', nrLokalu: '', kodPocztowy: '', miejscowosc: '' };
      
      if (device.address) {
        // Parse the combined address back into components
        const parts = device.address.split(',');
        if (parts.length >= 2) {
          const streetPart = parts[0].trim();
          const cityPart = parts[1].trim();
          
          // Extract street and numbers
          const streetMatch = streetPart.match(/^(.+?)\s+(\d+\w*)(?:\/(\d+\w*))?$/);
          if (streetMatch) {
            addressParts.ulica = streetMatch[1].replace(/^ul\.\s*/, '');
            addressParts.nrDomu = streetMatch[2];
            addressParts.nrLokalu = streetMatch[3] || '';
          }
          
          // Extract postal code and city
          const cityMatch = cityPart.match(/(\d{2}-\d{3})\s+(.+)/);
          if (cityMatch) {
            addressParts.kodPocztowy = cityMatch[1];
            addressParts.miejscowosc = cityMatch[2];
          } else {
            addressParts.miejscowosc = cityPart;
          }
        }
      }

      setFormData({
        deviceType: device.deviceType || DEVICE_TYPES.HEAT_PUMP,
        deviceName: device.deviceName || '',
        installationDate: device.installationDate || new Date().toISOString().split('T')[0],
        nextInspectionDate: device.nextInspectionDate || '',
        notes: device.notes || '',
        ulica: addressParts.ulica,
        nrDomu: addressParts.nrDomu,
        nrLokalu: addressParts.nrLokalu,
        kodPocztowy: addressParts.kodPocztowy,
        miejscowosc: addressParts.miejscowosc,
        latitude: device.position?.lat || 52.2297,
        longitude: device.position?.lng || 21.0118,
      });
      
      // Check if this is using company address
      if (device.position) {
        setIsUsingCompanyAddress(isCompanyAddress(device.position));
      }
    }
  }, [device]);

  // Geocode address when address fields change (disabled in edit mode to prevent API abuse)
  useEffect(() => {
    // Skip geocoding in edit mode (demo) - prevents unnecessary API calls
    if (device?.id) {
      return;
    }

    const addressComponents = {
      ulica: formData.ulica,
      nrDomu: formData.nrDomu,
      nrLokalu: formData.nrLokalu,
      kodPocztowy: formData.kodPocztowy,
      miejscowosc: formData.miejscowosc,
    };

    if (isAddressValidForGeocoding(addressComponents)) {
      setGeocodingStatus('loading');
      setGeocodingMessage('');
      
      // Format address for display
      const formattedAddress = formData.nrLokalu 
        ? `${formData.ulica} ${formData.nrDomu}/${formData.nrLokalu}, ${formData.kodPocztowy} ${formData.miejscowosc}, Polska`
        : `${formData.ulica} ${formData.nrDomu}, ${formData.kodPocztowy} ${formData.miejscowosc}, Polska`;
      
      setResolvedAddress(formattedAddress);
      
      debouncedGeocode(addressComponents, (result) => {
        if (result.status === 'success') {
          // Success - use geocoded coordinates
          setFormData(prev => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lng,
          }));
          setGeocodingStatus('success');
          setGeocodingMessage(result.message || '');
          setIsUsingCompanyAddress(false);
          setShowMapPreview(true);
          setTimeout(() => setGeocodingStatus('idle'), 3000);
        } else if (result.needsConfirmation) {
          // Error - show confirmation dialog
          setPendingGeocodingResult(result);
          setUserProvidedAddress(result.userAddress || formattedAddress);
          setShowConfirmationDialog(true);
          setGeocodingStatus('error');
          setGeocodingMessage(result.message || '');
        } else {
          // Fallback without confirmation
          setFormData(prev => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lng,
          }));
          setGeocodingStatus('error');
          setGeocodingMessage(result.message || '');
          setIsUsingCompanyAddress(true);
          setShowMapPreview(true);
          setTimeout(() => setGeocodingStatus('idle'), 5000);
        }
      }, 1500);
    } else {
      setResolvedAddress('');
      setShowMapPreview(false);
      setIsUsingCompanyAddress(false);
    }
  }, [device?.id, formData.ulica, formData.nrDomu, formData.nrLokalu, formData.kodPocztowy, formData.miejscowosc]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.ulica.trim()) {
      alert('Proszę wprowadzić nazwę ulicy');
      return;
    }
    
    if (!formData.nrDomu.trim()) {
      alert('Proszę wprowadzić numer domu');
      return;
    }
    
    if (!formData.kodPocztowy.trim()) {
      alert('Proszę wprowadzić kod pocztowy');
      return;
    }
    
    if (!formData.miejscowosc.trim()) {
      alert('Proszę wprowadzić miejscowość');
      return;
    }

    // Validate postal code format
    const postalCodeRegex = /^\d{2}-\d{3}$/;
    if (!postalCodeRegex.test(formData.kodPocztowy)) {
      alert('Kod pocztowy musi mieć format XX-XXX (np. 00-001)');
      return;
    }
    
    // Create full address for frontend display
    const fullAddress = formData.nrLokalu 
      ? `${formData.ulica} ${formData.nrDomu}/${formData.nrLokalu}, ${formData.kodPocztowy} ${formData.miejscowosc}`
      : `${formData.ulica} ${formData.nrDomu}, ${formData.kodPocztowy} ${formData.miejscowosc}`;
    
    const deviceData = {
      deviceType: formData.deviceType,
      deviceName: formData.deviceName,
      installationDate: formData.installationDate,
      nextInspectionDate: formData.nextInspectionDate,
      notes: formData.notes,
      
      // Address data
      address: fullAddress,
      ulica: formData.ulica,
      nrDomu: formData.nrDomu,
      nrLokalu: formData.nrLokalu || null,
      kodPocztowy: formData.kodPocztowy,
      miejscowosc: formData.miejscowosc,
      
      // Position data
      position: {
        lat: formData.latitude,
        lng: formData.longitude
      },
      
      // Flag if using company address
      isUsingCompanyAddress: isUsingCompanyAddress
    };
    
    onSave(deviceData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setNextInspectionDate = (years) => {
    if (!formData.installationDate) {
      alert('Najpierw ustaw datę instalacji');
      return;
    }
    
    const installDate = new Date(formData.installationDate);
    const nextDate = new Date(installDate);
    nextDate.setFullYear(installDate.getFullYear() + years);
    
    handleInputChange('nextInspectionDate', nextDate.toISOString().split('T')[0]);
  };

  const getGoogleMapsUrl = () => {
    if (formData.latitude && formData.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`;
    }
    return '';
  };

  const handleUseCompanyAddress = () => {
    if (pendingGeocodingResult) {
      const companyAddr = getCompanyAddressOrDefault();
      setFormData(prev => ({
        ...prev,
        latitude: pendingGeocodingResult.lat,
        longitude: pendingGeocodingResult.lng,
      }));
      setResolvedAddress(companyAddr.fullAddress);
      setIsUsingCompanyAddress(true);
      setShowMapPreview(true);
      setShowConfirmationDialog(false);
      setPendingGeocodingResult(null);
      setTimeout(() => setGeocodingStatus('idle'), 3000);
    }
  };

  const handleUseUserAddress = () => {
    if (pendingGeocodingResult) {
      // Keep user's entered address but don't update coordinates
      // This means we'll try to geocode again or keep last known coordinates
      setShowConfirmationDialog(false);
      setPendingGeocodingResult(null);
      setGeocodingStatus('idle');
      setIsUsingCompanyAddress(false);
      setShowMapPreview(false);
      // User can manually adjust if needed
    }
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

  const isEditMode = !!device?.id;

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
      case 'fallback':
        return {
          ...geocodingStatusStyle,
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        };
      case 'error':
        return {
          ...geocodingStatusStyle,
          backgroundColor: '#fee2e2',
          color: '#991b1b',
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
              {device?.id ? 'Edytuj urządzenie' : isAddingToExistingClient ? 'Dodaj urządzenie' : 'Nowe urządzenie'}
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
            {/* Address Information */}
            <div style={sectionHeaderStyle}>Adres urządzenia</div>

            <div style={formRowStyle}>
              <label style={labelStyle}>Ulica *</label>
              <input
                required
                type="text"
                placeholder="Warszawska"
                value={formData.ulica}
                onChange={(e) => handleInputChange('ulica', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={formGridStyle}>
              <div style={formRowStyle}>
                <label style={labelStyle}>Numer domu *</label>
                <input
                  required
                  type="text"
                  placeholder="10"
                  value={formData.nrDomu}
                  onChange={(e) => handleInputChange('nrDomu', e.target.value)}
                  style={inputStyle}
                />
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
                  required
                  type="text"
                  placeholder="00-001"
                  pattern="\d{2}-\d{3}"
                  value={formData.kodPocztowy}
                  onChange={(e) => handleInputChange('kodPocztowy', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={formRowStyle}>
                <label style={labelStyle}>Miejscowość *</label>
                <input
                  required
                  type="text"
                  placeholder="Warszawa"
                  value={formData.miejscowosc}
                  onChange={(e) => handleInputChange('miejscowosc', e.target.value)}
                  style={inputStyle}
                />
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
                  {geocodingMessage || `Współrzędne: ${formatCoordinates({ lat: formData.latitude, lng: formData.longitude })}`}
                </>
              )}
              {geocodingStatus === 'fallback' && (
                <>
                  <AlertCircle size={12} />
                  {geocodingMessage || 'Użyto adresu firmy'}
                </>
              )}
              {geocodingStatus === 'error' && (
                <>
                  <AlertCircle size={12} />
                  {geocodingMessage || 'Błąd określania współrzędnych'}
                </>
              )}
            </div>

            {/* Warning message if using company address */}
            {isUsingCompanyAddress && showMapPreview && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                padding: '10px 12px',
                marginTop: 8,
                fontSize: 12,
                color: '#991b1b',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Uwaga!</strong> Nie udało się określić współrzędnych dla podanego adresu. 
                  Używany jest adres firmy: <strong>Stanisława Moniuszki 17, 26-300 Opoczno</strong>.
                  <br />
                  Proszę zweryfikować poprawność wprowadzonego adresu.
                </div>
              </div>
            )}

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
                  <MapPin size={16} color={isUsingCompanyAddress ? '#dc2626' : '#3b82f6'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                      {resolvedAddress}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>
                      {formatCoordinates({ lat: formData.latitude, lng: formData.longitude })}
                    </div>
                    {isUsingCompanyAddress && (
                      <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, marginTop: 4 }}>
                        ⚠️ Adres firmy (domyślny)
                      </div>
                    )}
                  </div>
                  <ExternalLink size={14} color="#6b7280" />
                </a>
                
                {/* Embedded Google Maps */}
                <iframe
                  className="map-iframe"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${formData.latitude},${formData.longitude}&zoom=15`}
                />
              </div>
            )}

            {/* Device Information */}
            <div style={sectionHeaderStyle}>Dane urządzenia</div>

            <div style={formGridStyle}>
              <div style={formRowStyle}>
                <label style={labelStyle}>Typ urządzenia *</label>
                <select
                  required
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
                  required
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => handleInputChange('installationDate', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={formRowStyle}>
                <label style={labelStyle}>Data następnego przeglądu *</label>
                <input
                  required
                  type="date"
                  value={formData.nextInspectionDate}
                  onChange={(e) => handleInputChange('nextInspectionDate', e.target.value)}
                  style={inputStyle}
                />
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
                placeholder="Dodatkowe informacje o urządzeniu..."
              />
            </div>

            <div style={buttonGroupStyle}>
              <button
                type="submit"
                style={primaryButtonStyle}
                disabled
              >
                <Check size={16} />
                {isEditMode ? 'Zapisz zmiany' : 'Dodaj urządzenie'}
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

      {/* Confirmation Dialog */}
      {showConfirmationDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 20,
            }}>
              <AlertCircle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: '0 0 8px 0',
                  color: '#111827'
                }}>
                  Uwaga! Nie udało się określić współrzędnych
                </h3>
                <p style={{
                  fontSize: 14,
                  color: '#6b7280',
                  margin: '0 0 12px 0',
                  lineHeight: 1.5
                }}>
                  {geocodingMessage}
                </p>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: 6,
                  padding: 12,
                  marginTop: 12,
                  fontSize: 13,
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                    Adres wprowadzony:
                  </div>
                  <div style={{ color: '#6b7280', marginBottom: 16 }}>
                    {userProvidedAddress}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                    Adres domyślny (firma):
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    {getCompanyAddressOrDefault().fullAddress}
                    <br />
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {formatCoordinates(getCompanyAddressOrDefault().coordinates)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              fontSize: 14,
              marginBottom: 20,
              color: '#374151',
              lineHeight: 1.6
            }}>
              <strong>Wybierz jedną z opcji:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Użyj adresu firmy jako lokalizacji urządzenia</li>
                <li>Zachowaj wprowadzony adres (możesz go poprawić przed zapisaniem)</li>
              </ul>
            </div>

            <div style={{
              display: 'flex',
              gap: 12,
            }}>
              <button
                onClick={handleUseCompanyAddress}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Użyj adresu firmy
              </button>
              <button
                onClick={handleUseUserAddress}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Zachowaj wprowadzony adres
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientDeviceForm;