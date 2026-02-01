import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Calendar, Clock, User, FileText, AlertCircle, Camera, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';

const ServiceForm = ({ 
  device, 
  client,
  serviceEntry = null, 
  onSave, 
  onCancel,
  loading = false 
}) => {
  const { user } = useAuth();
  const notification = useNotification();

  // Helper function to format date for date input (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to format time for time input (HH:MM)
  const formatTimeForInput = (date) => {
    if (!date) return '09:00';
    const localDate = new Date(date);
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  const [formData, setFormData] = useState({
    deviceId: device?.id || '',
    date: '',
    startTime: '09:00',
    serviceType: 'KONSERWACJA',
    duration: 60, // Default 60 minutes
    notes: '',
    technician: '',
    createdBy: '',
    photos: [],
  });

  const [errors, setErrors] = useState({});
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const fileInputRef = useRef(null);

  // Load existing photos when editing
  useEffect(() => {
    const loadExistingPhotos = async () => {
      if (serviceEntry && serviceEntry.id) {
        setLoadingPhotos(true);
        try {
          if (DEMO_MODE) {
            await simulateDelay(200);
            // Return empty photos in demo mode
            setExistingPhotos([]);
          } else {
            throw new Error('Demo mode only');
          }
        } catch (error) {
          console.error('Error loading existing photos:', error);
        } finally {
          setLoadingPhotos(false);
        }
      }
    };

    if (serviceEntry) {
      // Editing existing entry
      const serviceDate = serviceEntry.serviceDate ? new Date(serviceEntry.serviceDate) : null;
      setFormData({
        deviceId: serviceEntry.deviceId,
        date: serviceDate ? formatDateForInput(serviceDate) : '',
        startTime: serviceDate ? formatTimeForInput(serviceDate) : '09:00',
        serviceType: serviceEntry.serviceType || 'KONSERWACJA',
        duration: serviceEntry.duration || 60,
        notes: serviceEntry.notes || '',
        technician: serviceEntry.technician || '',
        createdBy: serviceEntry.createdBy || '',
      });
      
      loadExistingPhotos();
    } else if (device) {
      // Creating new entry
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        deviceId: device.id,
        date: formatDateForInput(now),
        startTime: formatTimeForInput(now),
        serviceType: 'KONSERWACJA',
        duration: 60,
      }));
    }
  }, [serviceEntry, device]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Data serwisu jest wymagana';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Godzina rozpoczęcia jest wymagana';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Typ serwisu jest wymagany';
    }

    if (!formData.duration || formData.duration < 30 || formData.duration > 480) {
      newErrors.duration = 'Czas trwania jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Combine date and time into LocalDateTime format for backend
    const startDateTime = `${formData.date}T${formData.startTime}:00`;
    
    // Calculate end time (add duration in minutes)
    const durationMinutes = formData.duration || 60;
    
    // Create proper start date object
    const startDate = new Date(`${formData.date}T${formData.startTime}:00`);
    
    // Add duration to get end date
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    // Format end date time in local time (not UTC)
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    const hours = String(endDate.getHours()).padStart(2, '0');
    const minutes = String(endDate.getMinutes()).padStart(2, '0');
    const seconds = String(endDate.getSeconds()).padStart(2, '0');
    
    const endDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
    // Determine status based on service date compared to today
    const serviceDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    serviceDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    const serviceStatus = serviceDate < today ? 'COMPLETED' : 'SCHEDULED';

    const submitData = {
      clientId: client?.id || device?.clientId || null,
      deviceId: device?.id,
      serviceType: formData.serviceType,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      duration: durationMinutes,
      notes: formData.notes,
      technician: formData.technician,
      manualEntry: true, // Mark as manual entry for unified service handling
      createGoogleEvent: true, // Ensure Google Calendar event is created
      // Services created through ClientsPage status depends on the date
      ...(serviceEntry ? 
        { 
          updatedBy: user?.name || user?.username || 'Nieznany użytkownik',
          status: serviceStatus
        } : 
        { 
          createdBy: user?.name || user?.username || 'Nieznany użytkownik',
          status: serviceStatus // Status depends on whether service date is before today
        }
      ),
    };

    try {
      const serviceResult = await onSave(submitData);

      // Upload only new photos (not existing ones)
      const newPhotos = uploadedPhotos.filter(photo => !photo.isExisting);
      if (newPhotos.length > 0) {
        try {
          // Get the service ID from the result
          const serviceId = serviceEntry ? serviceEntry.id : serviceResult?.id;

          if (serviceId) {
            await uploadServicePhotos(serviceId, newPhotos);
          } else {
            console.error('ServiceForm: No service ID found for photo upload');
          }
        } catch (photoError) {
          console.error('Error uploading photos:', photoError);
          notification.showError('Nie udało się dodać zdjęcia');
          // Don't fail the whole process if photo upload fails
        }
      }
    } catch (error) {
      console.error('Error saving service entry:', error);
    }
  };

  // Photo handling functions
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxPhotos = parseInt(import.meta.env.VITE_MAX_SERVICE_PHOTOS || '5', 10);
    const currentPhotoCount = existingPhotos.length + uploadedPhotos.length;
    const availableSlots = Math.max(0, maxPhotos - currentPhotoCount);
    
    if (availableSlots === 0) {
      notification.showError(`Maksymalna liczba zdjęć (${maxPhotos}) została osiągnięta`);
      return;
    }
    
    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      notification.showWarning(`Można dodać tylko ${availableSlots} zdjęć. Dodano pierwsze ${availableSlots} plików.`);
    }
    
    const newPhotos = filesToUpload.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      preview: URL.createObjectURL(file),
      uploaded: false,
      isExisting: false
    }));
    
    const updatedPhotos = [...uploadedPhotos, ...newPhotos];
    setUploadedPhotos(updatedPhotos);
    setFormData(prev => ({...prev, photos: updatedPhotos}));
  };

  const removePhoto = (photoId, isExisting) => {
    if (isExisting) {
      setExistingPhotos(existingPhotos.filter(photo => photo.id !== photoId));
    } else {
      const updatedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
      setUploadedPhotos(updatedPhotos);
      setFormData(prev => ({...prev, photos: updatedPhotos}));
    }
  };

  // Function to upload photos for a service
  const uploadServicePhotos = async (serviceId, photos) => {
    if (DEMO_MODE) {
      // In demo mode, just simulate upload
      await simulateDelay(300);
      console.log('Demo mode: Simulating photo upload for service', serviceId);
      return;
    }
    throw new Error('Demo mode only');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const serviceTypes = [
    { value: 'KONSERWACJA', label: 'Konserwacja' },
    { value: 'NAPRAWA', label: 'Naprawa' },
    { value: 'PRZEGLAD_OKRESOWY', label: 'Przegląd okresowy' },
    { value: 'INSTALACJA', label: 'Instalacja' },
    { value: 'DIAGNOSTYKA', label: 'Diagnostyka' },
    { value: 'MODERNIZACJA', label: 'Modernizacja' },
    { value: 'AWARIA', label: 'Awaria' },
  ];

  const durations = [
    { value: 30, label: '30 minut' },
    { value: 60, label: '1 godzina' },
    { value: 90, label: '1.5 godziny' },
    { value: 120, label: '2 godziny' },
    { value: 180, label: '3 godziny' },
    { value: 240, label: '4 godziny' },
    { value: 360, label: '6 godzin' },
    { value: 480, label: '8 godzin' },
  ];

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

  const modalStyle = {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 600,
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid #e5e7eb',
  };

  const formRowStyle = {
    marginBottom: 16,
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
    minHeight: 80,
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid #e5e7eb',
  };

  const primaryButtonStyle = {
    flex: 1,
    padding: '12px 16px',
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
    gap: 8,
    opacity: 0.6,
  };

  const secondaryButtonStyle = {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  const deviceInfoStyle = {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 13,
    color: '#6b7280',
  };

  // Combine existing and new photos for display
  const allPhotos = [...existingPhotos, ...uploadedPhotos];
  const maxPhotos = parseInt(import.meta.env.VITE_MAX_SERVICE_PHOTOS || '5', 10);
  const canUploadMore = allPhotos.length < maxPhotos;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            {serviceEntry ? 'Edytuj wpis serwisowy' : 'Dodaj wpis serwisowy'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
            disabled={loading}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {device && (
          <div style={deviceInfoStyle}>
            <strong>Urządzenie:</strong> {device.deviceType}
            {device.deviceName && <> ({device.deviceName})</>}
            <br />
            <strong>Adres:</strong> {device.address}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={formRowStyle}>
              <label style={labelStyle}>
                <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} />
                Data serwisu *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.date ? '#dc2626' : '#d1d5db',
                }}
                required
                disabled={loading}
              />
              {errors.date && (
                <div style={errorStyle}>
                  <AlertCircle size={12} />
                  {errors.date}
                </div>
              )}
            </div>

            <div style={formRowStyle}>
              <label style={labelStyle}>
                <Clock size={16} style={{ display: 'inline', marginRight: 6 }} />
                Godzina rozpoczęcia *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.startTime ? '#dc2626' : '#d1d5db',
                }}
                required
                disabled={loading}
              />
              {errors.startTime && (
                <div style={errorStyle}>
                  <AlertCircle size={12} />
                  {errors.startTime}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={formRowStyle}>
              <label style={labelStyle}>Typ serwisu *</label>
              <select
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.serviceType ? '#dc2626' : '#d1d5db',
                }}
                required
                disabled={loading}
              >
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <div style={errorStyle}>
                  <AlertCircle size={12} />
                  {errors.serviceType}
                </div>
              )}
            </div>

            <div style={formRowStyle}>
              <label style={labelStyle}>Czas trwania *</label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                style={{
                  ...inputStyle,
                  borderColor: errors.duration ? '#dc2626' : '#d1d5db',
                }}
                required
                disabled={loading}
              >
                {durations.map(duration => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
              {errors.duration && (
                <div style={errorStyle}>
                  <AlertCircle size={12} />
                  {errors.duration}
                </div>
              )}
            </div>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>
              <User size={16} style={{ display: 'inline', marginRight: 6 }} />
              Technik
            </label>
            <input
              type="text"
              value={formData.technician}
              onChange={(e) => handleInputChange('technician', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errors.technician ? '#dc2626' : '#d1d5db',
              }}
              placeholder="Imię i nazwisko technika wykonującego serwis"
              disabled={loading}
            />
            {errors.technician && (
              <div style={errorStyle}>
                <AlertCircle size={12} />
                {errors.technician}
              </div>
            )}
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>
              <FileText size={16} style={{ display: 'inline', marginRight: 6 }} />
              Notatki
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              style={textareaStyle}
              placeholder="Opis wykonanych prac, wyników przeglądu, uwagi, zalecenia, itp..."
              disabled={loading}
            />
          </div>

          {/* Photos section */}
          <div style={{
            ...formRowStyle,
            marginTop: 20,
            paddingTop: 20,
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <label style={labelStyle}>
                <Camera size={16} style={{ display: 'inline', marginRight: 6 }} />
                Zdjęcia serwisu ({allPhotos.length}/{maxPhotos})
                {loadingPhotos && <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>Ładowanie...</span>}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || loadingPhotos || !canUploadMore}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  backgroundColor: loading || loadingPhotos || !canUploadMore ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: loading || loadingPhotos || !canUploadMore ? 'not-allowed' : 'pointer',
                }}
              >
                <Upload size={14} />
                {canUploadMore ? 'Dodaj zdjęcia' : 'Limit osiągnięty'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                disabled={loading || loadingPhotos}
              />
            </div>

            {allPhotos.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 12,
              }}>
                {allPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    style={{
                      position: 'relative',
                      backgroundColor: '#f9fafb',
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: photo.isExisting ? '2px solid #10b981' : '1px solid #e5e7eb',
                    }}
                  >
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      style={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      width: '100%',
                      height: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      fontSize: 10,
                    }}>
                      <Camera size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id, photo.isExisting)}
                      disabled={loading}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(220, 38, 38, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: 2,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={12} />
                    </button>
                    <div style={{
                      padding: '6px 8px',
                      fontSize: 10,
                      color: '#6b7280',
                      backgroundColor: 'white',
                      borderTop: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {photo.isExisting && <span style={{ color: '#10b981', fontWeight: 600 }}>✓ </span>}
                      {photo.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '20px 0',
                color: '#9ca3af',
                fontSize: 13,
                backgroundColor: '#f9fafb',
                borderRadius: 6,
                border: '1px dashed #d1d5db',
              }}>
                Brak zdjęć. Kliknij "Dodaj zdjęcia" aby przesłać zdjęcia z serwisu.
              </div>
            )}
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="submit"
              style={primaryButtonStyle}
              disabled
            >
              <Save size={16} />
              {serviceEntry ? 'Zapisz zmiany' : 'Dodaj wpis'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;