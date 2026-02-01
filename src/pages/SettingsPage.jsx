import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw,
  Settings,
  MessageSquare
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import GeneralSettingsTab from '@/components/settings/GeneralSettingsTab';
import SmsSettingsTab from '@/components/settings/SmsSettingsTab';

const SettingsPage = ({ settings, onUpdateSettings, onResetSettings }) => {
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const notification = useNotification();

  // Update form data when settings change
  useEffect(() => {
    if (settings && settings._backend) {
      // Use the backend structure for form data to match API expectations
      const newFormData = {
        defaultSmsTemplate: settings.smsTemplates?.reminder || settings._backend.defaultSmsTemplate || '',
        expirationSmsTemplate: settings._backend.expirationSmsTemplate || '',
        contactPhoneNumber: settings._backend.contactPhoneNumber || '',
        smsReminderDaysAhead: settings._backend.smsReminderDaysAhead || 14,
        automaticSmsEnabled: settings._backend.automaticSmsEnabled !== undefined ? settings._backend.automaticSmsEnabled : true,
        heatPumpMaintenancePrice: settings.pricing?.heatPump || settings._backend.heatPumpMaintenancePrice || 0,
        gasBoilerMaintenancePrice: settings.pricing?.gasBoiler || settings._backend.gasBoilerMaintenancePrice || 0,
        airConditionerMaintenancePrice: settings.pricing?.airConditioner || settings._backend.airConditionerMaintenancePrice || 0,
        heatPumpInspectionInterval: settings.inspectionIntervals?.heatPump || settings._backend.heatPumpInspectionInterval || 12,
        gasBoilerInspectionInterval: settings.inspectionIntervals?.gasBoiler || settings._backend.gasBoilerInspectionInterval || 12,
        airConditionerInspectionInterval: settings.inspectionIntervals?.airConditioner || settings._backend.airConditionerInspectionInterval || 12,
        // Add any other backend fields FIRST
        ...settings._backend,
        // Then override customSmsTemplates to ensure it's an array
        customSmsTemplates: settings._backend.customSmsTemplates || []
      };
      setFormData(newFormData);
    } else if (settings) {
      // Fallback for when _backend is not available
      const fallbackFormData = {
        defaultSmsTemplate: settings.smsTemplates?.reminder || '',
        expirationSmsTemplate: '',
        contactPhoneNumber: '',
        smsReminderDaysAhead: 14,
        automaticSmsEnabled: true,
        heatPumpMaintenancePrice: settings.pricing?.heatPump || 0,
        gasBoilerMaintenancePrice: settings.pricing?.gasBoiler || 0,
        airConditionerMaintenancePrice: settings.pricing?.airConditioner || 0,
        heatPumpInspectionInterval: settings.inspectionIntervals?.heatPump || 12,
        gasBoilerInspectionInterval: settings.inspectionIntervals?.gasBoiler || 12,
        airConditionerInspectionInterval: settings.inspectionIntervals?.airConditioner || 12,
      };
      setFormData(fallbackFormData);
    }
    setHasChanges(false);
  }, [settings]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // Convert formData to the format expected by updateSettings
      const updateData = {
        smsTemplates: {
          reminder: formData.defaultSmsTemplate,
          expiration: formData.expirationSmsTemplate
        },
        pricing: {
          heatPump: formData.heatPumpMaintenancePrice,
          gasBoiler: formData.gasBoilerMaintenancePrice,
          airConditioner: formData.airConditionerMaintenancePrice
        },
        inspectionIntervals: {
          heatPump: formData.heatPumpInspectionInterval,
          gasBoiler: formData.gasBoilerInspectionInterval,
          airConditioner: formData.airConditionerInspectionInterval
        },
        // Pass backend updates directly
        _backendUpdates: formData
      };
      await onUpdateSettings(updateData);
      setHasChanges(false);
      
      notification.showSuccess('Ustawienia zostały zapisane pomyślnie!');
    } catch (error) {
      console.error('[Settings] Save error:', error);
      notification.showError('Nie udało się zaktualizować ustawień');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Czy na pewno chcesz przywrócić domyślne ustawienia? Ta operacja nie może zostać cofnięta.')) {
      try {
        await onResetSettings();
        setHasChanges(false);
        notification.showSuccess('Ustawienia zostały zresetowane pomyślnie!');
      } catch (error) {
        notification.showError('Nie udało się zaktualizować ustawień');
      }
    }
  };

  // Styles
  const pageStyle = {
    padding: '20px',
    paddingTop: '85px', // Add space for navigation bar (65px height + 20px spacing)
    minHeight: '100%',
    backgroundColor: '#f5f3ef',
  };

  const headerStyle = {
    marginBottom: 32,
  };

  const tabsStyle = {
    display: 'flex',
    gap: 4,
    marginBottom: 24,
    borderBottom: '2px solid #e5e7eb',
  };

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid #e67e22' : '2px solid transparent',
    color: isActive ? '#e67e22' : '#6b7280',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: -2,
    transition: 'all 0.2s',
  });

  const buttonGroupStyle = {
    display: 'flex',
    gap: 12,
    marginTop: 32,
    paddingTop: 24,
    borderTop: '1px solid #e5e7eb',
  };

  const primaryButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    opacity: 0.6,
  };

  const secondaryButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettingsTab 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );

      case 'sms':
        return (
          <SmsSettingsTab
            formData={formData}
            onInputChange={handleInputChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 8, color: '#2c3e50' }}>
          Ustawienia systemu
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div style={tabsStyle}>
        <button
          style={tabStyle(activeTab === 'general')}
          onClick={() => setActiveTab('general')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} />
            Ogólne
          </span>
        </button>
        <button
          style={tabStyle(activeTab === 'sms')}
          onClick={() => setActiveTab('sms')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={16} />
            SMS
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Action Buttons */}
      <div style={buttonGroupStyle}>
          <button
            style={primaryButtonStyle}
            disabled
          >
            <Save size={16} />
            Zapisz ustawienia
          </button>

          <button
            onClick={handleReset}
            style={secondaryButtonStyle}
          >
            <RotateCcw size={16} />
            Przywróć domyślne
          </button>
        </div>

      {hasChanges && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#e67e22',
          color: 'white',
          padding: '12px 16px',
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)',
          zIndex: 1000,
        }}>
          Masz niezapisane zmiany
        </div>
      )}
    </div>
  );
};

export default SettingsPage;