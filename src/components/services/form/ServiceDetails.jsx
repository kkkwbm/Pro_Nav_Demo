import React from 'react';
import { Calendar, Clock, FileText, User, Camera, Upload } from 'lucide-react';

const ServiceDetails = ({ formData, setFormData, editingService = null }) => {
  const serviceTypes = [
    { value: 'PRZEGLAD_OKRESOWY', label: 'Przegląd okresowy' },
    { value: 'KONSERWACJA', label: 'Konserwacja' },
    { value: 'NAPRAWA', label: 'Naprawa' },
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

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: '#374151',
  };

  const formRowStyle = {
    marginBottom: 16,
  };

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
        <Camera size={18} />
        Szczegóły serwisu
      </h3>

      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={formRowStyle}>
            <label style={labelStyle}>
              <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
              Data serwisu *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={inputStyle}
              required
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>
              <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
              Godzina rozpoczęcia *
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={formRowStyle}>
            <label style={labelStyle}>Typ serwisu *</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
              style={inputStyle}
              required
            >
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Czas trwania *</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              style={inputStyle}
              required
            >
              {durations.map(duration => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>
            <User size={14} style={{ display: 'inline', marginRight: 4 }} />
            Technik
          </label>
          <input
            type="text"
            value={formData.technician || ''}
            onChange={(e) => setFormData({...formData, technician: e.target.value})}
            style={inputStyle}
            placeholder="Imię i nazwisko technika"
          />
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>
            <FileText size={14} style={{ display: 'inline', marginRight: 4 }} />
            Notatki
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            style={{
              ...inputStyle,
              minHeight: 80,
              resize: 'vertical',
            }}
            placeholder="Opis wykonanych prac, wyników przeglądu, wymienione części, uwagi, zalecenia..."
          />
        </div>

        {/* Photos section */}
        <div style={formRowStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <label style={{
              ...labelStyle,
              marginBottom: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <Camera size={14} />
              Zdjęcia serwisu
            </label>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                backgroundColor: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'not-allowed',
                opacity: 0.7,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              <Upload size={14} />
              Dodaj zdjęcia
            </span>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px 0',
            color: '#9ca3af',
            fontSize: 13,
          }}>
            W pełnej wersji aplikacji można dodawać zdjęcia do serwisu.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;