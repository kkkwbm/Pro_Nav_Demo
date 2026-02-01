import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, MapPin, ExternalLink } from 'lucide-react';
import { DEVICE_TYPES } from '../../config/mapConfig';
import { debouncedGeocode, isAddressValidForGeocoding } from '../../services/utils/geocodingUtils';
import customClientsApi from '../../services/api/customClients';

const ServiceRequestForm = ({ onClose, onSuccess }) => {
  // Google Maps is loaded at app level
  const isMapsLoaded = typeof window !== 'undefined' && window.google && window.google.maps;
  const loadError = null;

  const [step, setStep] = useState(1); // 1: Client info, 2: Device info
  const [formData, setFormData] = useState({
    // Client info
    imie: '',
    nazwisko: '',
    telefon: '',

    // Device info
    typUrzadzenia: 'Pompa ciepła',
    nazwaUrzadzenia: '',
    dataInstalacji: '',
    terminPrzegladu: '',
    notatka: '',

    // Address components
    ulica: '',
    nrDomu: '',
    nrLokalu: '',
    kodPocztowy: '',
    miejscowosc: '',

    // Coordinates
    latitude: null,
    longitude: null,
  });

  const [geocodingStatus, setGeocodingStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [installationDateUnknown, setInstallationDateUnknown] = useState(false);
  const [lastInspectionNone, setLastInspectionNone] = useState(false);

  // Map DEVICE_TYPES to Polish names for backend
  const deviceTypeMap = {
    [DEVICE_TYPES.HEAT_PUMP]: 'Pompa ciepła',
    [DEVICE_TYPES.GAS_BOILER]: 'Kocioł gazowy',
    [DEVICE_TYPES.AIR_CONDITIONER]: 'Klimatyzator',
    [DEVICE_TYPES.OIL_BOILER]: 'Kocioł olejowy',
  };

  // Helper functions for map preview
  const formatAddress = (components) => {
    const parts = [
      components.ulica,
      components.nrDomu + (components.nrLokalu ? `/${components.nrLokalu}` : ''),
      components.kodPocztowy,
      components.miejscowosc
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatCoordinates = (coords) => {
    if (!coords || !coords.lat || !coords.lng) return '';
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  };

  const getGoogleMapsUrl = () => {
    if (formData.latitude && formData.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`;
    }
    return '';
  };

  // Geocode address when address fields change
  useEffect(() => {
    // Don't geocode until Google Maps is loaded
    if (!isMapsLoaded) {
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
      setShowMapPreview(false);

      debouncedGeocode(addressComponents, (result) => {
        // Check if geocoding was successful
        if (result.status === 'success' && result.lat && result.lng) {
          setFormData(prev => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lng,
          }));
          setResolvedAddress(formatAddress(addressComponents));
          setGeocodingStatus('success');
          setShowMapPreview(true);
          setTimeout(() => setGeocodingStatus('idle'), 3000);
        } else {
          // Geocoding failed
          console.warn('Geocoding failed:', result.message);
          setFormData(prev => ({
            ...prev,
            latitude: null,
            longitude: null,
          }));
          setShowMapPreview(false);
          setResolvedAddress('');
          setGeocodingStatus('error');
          setTimeout(() => setGeocodingStatus('idle'), 3000);
        }
      }, 1500);
    } else {
      setFormData(prev => ({
        ...prev,
        latitude: null,
        longitude: null,
      }));
      setShowMapPreview(false);
      setResolvedAddress('');
    }
  }, [formData.ulica, formData.nrDomu, formData.nrLokalu, formData.kodPocztowy, formData.miejscowosc, isMapsLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.imie.trim()) {
      newErrors.imie = 'Imię jest wymagane';
    }

    if (!formData.nazwisko.trim()) {
      newErrors.nazwisko = 'Nazwisko jest wymagane';
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefon jest wymagany';
    } else {
      const cleanedPhone = formData.telefon.replace(/\s/g, '');
      const isValidFormat = /^\+48[0-9]{9}$/.test(cleanedPhone) || /^[0-9]{9}$/.test(cleanedPhone);
      if (!isValidFormat) {
        newErrors.telefon = 'Numer telefonu musi zawierać 9 cyfr (format: +48XXXXXXXXX lub XXXXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.nazwaUrzadzenia.trim()) {
      newErrors.nazwaUrzadzenia = 'Nazwa urządzenia jest wymagana';
    }

    if (!formData.ulica.trim()) {
      newErrors.ulica = 'Ulica jest wymagana';
    }

    if (!formData.nrDomu.trim()) {
      newErrors.nrDomu = 'Numer domu jest wymagany';
    }

    if (!formData.kodPocztowy.trim()) {
      newErrors.kodPocztowy = 'Kod pocztowy jest wymagany';
    } else if (!/^[0-9]{2}-[0-9]{3}$/.test(formData.kodPocztowy)) {
      newErrors.kodPocztowy = 'Format: XX-XXX';
    }

    if (!formData.miejscowosc.trim()) {
      newErrors.miejscowosc = 'Miejscowość jest wymagana';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.address = 'Nie udało się znaleźć adresu na mapie. Sprawdź poprawność adresu.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize phone number
      let telefon = formData.telefon.replace(/\s/g, '');
      if (!telefon.startsWith('+48')) {
        telefon = '+48' + telefon;
      }

      // Create client
      const clientData = {
        imie: formData.imie.trim(),
        nazwisko: formData.nazwisko.trim(),
        telefon: telefon,
      };

      let client;
      try {
        client = await customClientsApi.create(clientData);

        // Check if response indicates request already submitted (backend returns 200 with special code)
        if (client?.code === 'REQUEST_ALREADY_SUBMITTED') {
          // Request already submitted - show success message with specific text
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess('Twoje zgłoszenie zostało już przyjęte do systemu, skontaktujemy się z Tobą wkrótce.');
          }
          return; // Exit early, don't continue
        }
      } catch (createError) {
        // Check if it's REQUEST_ALREADY_SUBMITTED (in case interceptor converts 200 to error)
        if (createError.response?.data?.code === 'REQUEST_ALREADY_SUBMITTED') {
          // Request already submitted - show success message with specific text
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess('Twoje zgłoszenie zostało już przyjęte do systemu, skontaktujemy się z Tobą wkrótce.');
          }
          return; // Exit early, don't continue
        }
        // Re-throw other errors to be handled by outer catch
        throw createError;
      }

      // If we get here, client was created successfully and should not be undefined
      if (!client || !client.id) {
        throw new Error('Nie udało się utworzyć klienta - brak ID klienta');
      }

      // Map Polish device type to backend enum value
      const deviceTypeToEnum = {
        'Pompa ciepła': 'POMPA_CIEPLA',
        'Kocioł gazowy': 'KOCIOL_GAZOWY',
        'Kocioł olejowy': 'KOCIOL_OLEJOWY',
        'Klimatyzator': 'KLIMATYZATOR',
      };

      // Build notes with date information
      let additionalNotes = '';
      if (installationDateUnknown) {
        additionalNotes += 'Data instalacji nieznana. ';
      }
      if (lastInspectionNone) {
        additionalNotes += 'Urządzenie nie miało jeszcze przeglądu. ';
      }
      const finalNotes = additionalNotes + formData.notatka.trim();

      // Create device
      const deviceData = {
        typUrzadzenia: deviceTypeToEnum[formData.typUrzadzenia] || 'POMPA_CIEPLA',
        nazwaUrzadzenia: formData.nazwaUrzadzenia.trim(),
        dataInstalacji: installationDateUnknown ? null : (formData.dataInstalacji || new Date().toISOString().split('T')[0]),
        terminPrzegladu: lastInspectionNone ? null : (formData.terminPrzegladu || null),
        notatka: finalNotes.trim(),
        ulica: formData.ulica.trim(),
        nrDomu: formData.nrDomu.trim(),
        nrLokalu: formData.nrLokalu.trim(),
        kodPocztowy: formData.kodPocztowy.trim(),
        miejscowosc: formData.miejscowosc.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      await customClientsApi.addDevice(client.id, deviceData);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting service request:', error);

      // Handle error response from backend
      let errorMessage = 'Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie.';

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle daily limit exceeded (HTTP 429)
        if (errorData.code === 'DAILY_LIMIT_EXCEEDED') {
          errorMessage = errorData.message || 'Dzienny limit zgłoszeń został przekroczony. Proszę spróbować ponownie jutro.';
          alert(errorMessage);
          if (onClose) {
            onClose(); // Close the form since no more submissions are possible today
          }
          return;
        }

        if (errorData.code === 'VALIDATION_ERROR' && errorData.details) {
          // Map backend field names to frontend field names
          const fieldMap = {
            'imie': 'imie',
            'nazwisko': 'nazwisko',
            'telefon': 'telefon',
            'nazwaUrzadzenia': 'nazwaUrzadzenia',
            'ulica': 'ulica',
            'nrDomu': 'nrDomu',
            'kodPocztowy': 'kodPocztowy',
            'miejscowosc': 'miejscowosc',
          };

          const newErrors = {};
          Object.keys(errorData.details).forEach(key => {
            const frontendKey = fieldMap[key] || key;
            newErrors[frontendKey] = errorData.details[key];
          });
          setErrors(newErrors);
          errorMessage = errorData.message;
        } else {
          errorMessage = errorData.message || errorMessage;
        }
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const dialogStyle = {
    backgroundColor: 'white',
    borderRadius: 12,
    maxWidth: 600,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const bodyStyle = {
    padding: 24,
  };

  const stepIndicatorStyle = {
    display: 'flex',
    marginBottom: 32,
    gap: 8,
  };

  const stepStyle = (isActive) => ({
    flex: 1,
    height: 4,
    backgroundColor: isActive ? '#e67e22' : '#e5e7eb',
    borderRadius: 2,
    transition: 'background-color 0.3s',
  });

  const inputGroupStyle = {
    marginBottom: 20,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#c0392b' : '#d1d5db'}`,
    borderRadius: 4,
    fontSize: 14,
    color: '#111827',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  });

  const errorStyle = {
    fontSize: 13,
    color: '#c0392b',
    marginTop: 4,
  };

  const buttonRowStyle = {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  };

  const buttonStyle = (isPrimary, disabled = false) => ({
    flex: 1,
    padding: '12px 16px',
    backgroundColor: disabled ? '#9ca3af' : (isPrimary ? '#e67e22' : '#f3f4f6'),
    color: isPrimary ? 'white' : '#374151',
    border: 'none',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    boxShadow: isPrimary && !disabled ? '0 2px 6px rgba(230, 126, 34, 0.3)' : 'none',
  });

  const mapPreviewStyle = {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fef5e7',
    borderRadius: 4,
    border: '1px solid #e67e22',
  };

  const addressLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    textDecoration: 'none',
    color: '#374151',
    fontSize: 13,
    transition: 'all 0.2s',
    marginBottom: 12,
  };

  return (
    <div style={formStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
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
      <div style={dialogStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Zamów wizytę serwisową</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        <div style={bodyStyle}>
          <div style={stepIndicatorStyle}>
            <div style={stepStyle(step >= 1)} />
            <div style={stepStyle(step >= 2)} />
          </div>

          {step === 1 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
                Krok 1: Dane kontaktowe
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Imię *</label>
                <input
                  type="text"
                  name="imie"
                  value={formData.imie}
                  onChange={handleChange}
                  style={inputStyle(errors.imie)}
                  placeholder="Jan"
                />
                {errors.imie && <div style={errorStyle}>{errors.imie}</div>}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Nazwisko *</label>
                <input
                  type="text"
                  name="nazwisko"
                  value={formData.nazwisko}
                  onChange={handleChange}
                  style={inputStyle(errors.nazwisko)}
                  placeholder="Kowalski"
                />
                {errors.nazwisko && <div style={errorStyle}>{errors.nazwisko}</div>}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Telefon *</label>
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  style={inputStyle(errors.telefon)}
                  placeholder="+48 123 456 789"
                />
                {errors.telefon && <div style={errorStyle}>{errors.telefon}</div>}
              </div>

              <div style={buttonRowStyle}>
                <button
                  type="button"
                  onClick={onClose}
                  style={buttonStyle(false)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  style={buttonStyle(true)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d35400'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e67e22'}
                >
                  Dalej
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
                Krok 2: Informacje o urządzeniu
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Typ urządzenia *</label>
                <select
                  name="typUrzadzenia"
                  value={formData.typUrzadzenia}
                  onChange={handleChange}
                  style={inputStyle(false)}
                >
                  {Object.entries(deviceTypeMap).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Nazwa/Model urządzenia *</label>
                <input
                  type="text"
                  name="nazwaUrzadzenia"
                  value={formData.nazwaUrzadzenia}
                  onChange={handleChange}
                  style={inputStyle(errors.nazwaUrzadzenia)}
                  placeholder="np. Samsung EHS Mono 16kW"
                />
                {errors.nazwaUrzadzenia && <div style={errorStyle}>{errors.nazwaUrzadzenia}</div>}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Data instalacji</label>
                <input
                  type="date"
                  name="dataInstalacji"
                  value={formData.dataInstalacji}
                  onChange={handleChange}
                  style={inputStyle(errors.dataInstalacji)}
                  disabled={installationDateUnknown}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={installationDateUnknown}
                    onChange={(e) => {
                      setInstallationDateUnknown(e.target.checked);
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, dataInstalacji: '' }));
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  Data instalacji nieznana
                </label>
                {errors.dataInstalacji && <div style={errorStyle}>{errors.dataInstalacji}</div>}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Data ostatniego przeglądu</label>
                <input
                  type="date"
                  name="terminPrzegladu"
                  value={formData.terminPrzegladu}
                  onChange={handleChange}
                  style={inputStyle(errors.terminPrzegladu)}
                  disabled={lastInspectionNone}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={lastInspectionNone}
                    onChange={(e) => {
                      setLastInspectionNone(e.target.checked);
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, terminPrzegladu: '' }));
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  Urządzenie nie miało jeszcze przeglądu
                </label>
                {errors.terminPrzegladu && <div style={errorStyle}>{errors.terminPrzegladu}</div>}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Ulica *</label>
                <input
                  type="text"
                  name="ulica"
                  value={formData.ulica}
                  onChange={handleChange}
                  style={inputStyle(errors.ulica)}
                  placeholder="ul. Przykładowa"
                />
                {errors.ulica && <div style={errorStyle}>{errors.ulica}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Numer domu *</label>
                  <input
                    type="text"
                    name="nrDomu"
                    value={formData.nrDomu}
                    onChange={handleChange}
                    style={inputStyle(errors.nrDomu)}
                    placeholder="12"
                  />
                  {errors.nrDomu && <div style={errorStyle}>{errors.nrDomu}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Nr lokalu</label>
                  <input
                    type="text"
                    name="nrLokalu"
                    value={formData.nrLokalu}
                    onChange={handleChange}
                    style={inputStyle(false)}
                    placeholder="5"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Kod pocztowy *</label>
                  <input
                    type="text"
                    name="kodPocztowy"
                    value={formData.kodPocztowy}
                    onChange={handleChange}
                    style={inputStyle(errors.kodPocztowy)}
                    placeholder="00-000"
                  />
                  {errors.kodPocztowy && <div style={errorStyle}>{errors.kodPocztowy}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Miejscowość *</label>
                  <input
                    type="text"
                    name="miejscowosc"
                    value={formData.miejscowosc}
                    onChange={handleChange}
                    style={inputStyle(errors.miejscowosc)}
                    placeholder="Warszawa"
                  />
                  {errors.miejscowosc && <div style={errorStyle}>{errors.miejscowosc}</div>}
                </div>
              </div>

              {geocodingStatus === 'loading' && (
                <div style={{ padding: 12, backgroundColor: '#fef3c7', borderRadius: 6, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    border: '2px solid #f3f4f6',
                    borderTop: '2px solid #92400e',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: 13, color: '#92400e' }}>Określanie współrzędnych...</span>
                </div>
              )}

              {geocodingStatus === 'success' && (
                <div style={{ padding: 12, backgroundColor: '#f0fdf4', borderRadius: 6, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={16} color="#16a34a" />
                  <span style={{ fontSize: 13, color: '#16a34a' }}>
                    Adres znaleziony: {formatCoordinates({ lat: formData.latitude, lng: formData.longitude })}
                  </span>
                </div>
              )}

              {errors.address && (
                <div style={{ padding: 12, backgroundColor: '#fef2f2', borderRadius: 6, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} color="#ef4444" />
                  <span style={{ fontSize: 13, color: '#ef4444' }}>{errors.address}</span>
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
                    <MapPin size={16} color="#e67e22" />
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

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Dodatkowe uwagi</label>
                <textarea
                  name="notatka"
                  value={formData.notatka}
                  onChange={handleChange}
                  style={{ ...inputStyle(false), minHeight: 80, resize: 'vertical' }}
                  placeholder="Dodatkowe informacje o urządzeniu lub problemie..."
                />
              </div>

              <div style={buttonRowStyle}>
                <button
                  type="button"
                  onClick={handleBack}
                  style={buttonStyle(false)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  disabled={true}
                  title="Niedostępne w wersji demo"
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'not-allowed',
                    opacity: 0.7,
                  }}
                >
                  Wyślij zgłoszenie
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
