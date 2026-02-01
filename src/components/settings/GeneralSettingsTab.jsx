import React from 'react';
import { DollarSign, Calendar, Phone, Info } from 'lucide-react';

const GeneralSettingsTab = ({ formData, onInputChange }) => {
  const sectionStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid #f3f4f6',
  };

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 16,
  };

  const infoBoxStyle = {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    color: '#1e40af',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  };

  return (
    <>
      {/* Pricing Section */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <DollarSign size={20} color="#e67e22" />
          <h2 style={sectionTitleStyle}>Cennik usług</h2>
        </div>

        <div style={gridStyle}>
          <div style={formRowStyle}>
            <label style={labelStyle}>Cena przeglądu pompy ciepła (PLN)</label>
            <input
              type="number"
              min="0"
              step="10"
              value={formData.heatPumpMaintenancePrice || 0}
              onChange={(e) => onInputChange('heatPumpMaintenancePrice', parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Cena przeglądu kotła gazowego (PLN)</label>
            <input
              type="number"
              min="0"
              step="10"
              value={formData.gasBoilerMaintenancePrice || 0}
              onChange={(e) => onInputChange('gasBoilerMaintenancePrice', parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Cena przeglądu kotła olejowego (PLN)</label>
            <input
              type="number"
              min="0"
              step="10"
              value={formData.oilBoilerMaintenancePrice || 0}
              onChange={(e) => onInputChange('oilBoilerMaintenancePrice', parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Cena przeglądu klimatyzatora (PLN)</label>
            <input
              type="number"
              min="0"
              step="10"
              value={formData.airConditionerMaintenancePrice || 0}
              onChange={(e) => onInputChange('airConditionerMaintenancePrice', parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Inspection Intervals Section */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <Calendar size={20} color="#f59e0b" />
          <h2 style={sectionTitleStyle}>Interwały przeglądów</h2>
        </div>

        <div style={gridStyle}>
          <div style={formRowStyle}>
            <label style={labelStyle}>Pompa ciepła (miesiące)</label>
            <select
              value={formData.heatPumpInspectionInterval || 12}
              onChange={(e) => onInputChange('heatPumpInspectionInterval', parseInt(e.target.value))}
              style={inputStyle}
            >
              <option value={6}>6 miesięcy</option>
              <option value={12}>12 miesięcy (1 rok)</option>
              <option value={18}>18 miesięcy</option>
              <option value={24}>24 miesiące (2 lata)</option>
              <option value={36}>36 miesięcy (3 lata)</option>
              <option value={60}>60 miesięcy (5 lat)</option>
            </select>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Kocioł gazowy (miesiące)</label>
            <select
              value={formData.gasBoilerInspectionInterval || 12}
              onChange={(e) => onInputChange('gasBoilerInspectionInterval', parseInt(e.target.value))}
              style={inputStyle}
            >
              <option value={6}>6 miesięcy</option>
              <option value={12}>12 miesięcy (1 rok)</option>
              <option value={18}>18 miesięcy</option>
              <option value={24}>24 miesiące (2 lata)</option>
              <option value={36}>36 miesięcy (3 lata)</option>
              <option value={60}>60 miesięcy (5 lat)</option>
            </select>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Kocioł olejowy (miesiące)</label>
            <select
              value={formData.oilBoilerInspectionInterval || 12}
              onChange={(e) => onInputChange('oilBoilerInspectionInterval', parseInt(e.target.value))}
              style={inputStyle}
            >
              <option value={6}>6 miesięcy</option>
              <option value={12}>12 miesięcy (1 rok)</option>
              <option value={18}>18 miesięcy</option>
              <option value={24}>24 miesiące (2 lata)</option>
              <option value={36}>36 miesięcy (3 lata)</option>
              <option value={60}>60 miesięcy (5 lat)</option>
            </select>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Klimatyzator (miesiące)</label>
            <select
              value={formData.airConditionerInspectionInterval || 12}
              onChange={(e) => onInputChange('airConditionerInspectionInterval', parseInt(e.target.value))}
              style={inputStyle}
            >
              <option value={6}>6 miesięcy</option>
              <option value={12}>12 miesięcy (1 rok)</option>
              <option value={18}>18 miesięcy</option>
              <option value={24}>24 miesiące (2 lata)</option>
              <option value={36}>36 miesięcy (3 lata)</option>
              <option value={60}>60 miesięcy (5 lat)</option>
            </select>
          </div>
        </div>

        <div style={infoBoxStyle}>
          <Info size={16} />
          <div>
            Te interwały będą używane przy aktualizacji terminów przeglądów dla konkretnych typów urządzeń.
          </div>
        </div>
      </div>

      {/* Company Contact Section */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <Phone size={20} color="#27ae60" />
          <h2 style={sectionTitleStyle}>Dane kontaktowe firmy</h2>
        </div>

        <div style={gridStyle}>
          <div style={formRowStyle}>
            <label style={labelStyle}>Numer kontaktowy firmy</label>
            <input
              type="tel"
              value={formData.contactPhoneNumber || ''}
              onChange={(e) => onInputChange('contactPhoneNumber', e.target.value)}
              style={inputStyle}
              placeholder="+48 123 456 789"
            />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
              Ten numer będzie używany w wiadomościach SMS do klientów
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralSettingsTab;