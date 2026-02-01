import { useState, useEffect } from 'react';
import { DEMO_MODE, simulateDelay, demoNotifications } from '../demo/demoMode';
import { mockSettings as initialMockSettings } from '../demo/mockData';
import logger from '../utils/logger';

export const useSettings = () => {
  // In demo mode, start with mock settings
  const [settings, setSettings] = useState(DEMO_MODE ? initialMockSettings : {
    smsTemplates: {
      reminder: 'Reminder: Your {deviceType} inspection is due on {date}. Click here to confirm: {link}',
      confirmation: 'Thank you for confirming your appointment on {date}',
      cancellation: 'Your appointment has been cancelled'
    },
    pricing: {
      heatPump: 250,
      gasBoiler: 200,
      airConditioner: 150,
      other: 180
    },
    inspectionIntervals: {
      heatPump: 12,
      gasBoiler: 12,
      airConditioner: 6,
      other: 12
    },
    companyInfo: {
      name: 'SerwisPro',
      phone: '123 456 789',
      email: 'service@serwispro.pl',
      address: 'ul. Przykładowa 1, 00-000 Warszawa'
    }
  });
  const [loading, setLoading] = useState(DEMO_MODE ? false : true);
  const [error, setError] = useState(null);

  // Fetch settings - in demo mode, use mock data (already set)
  const fetchSettings = async () => {
    if (DEMO_MODE) {
      // Settings already initialized from mock data
      logger.debug('[Settings] Demo mode: Using mock settings');
      setLoading(false);
      return;
    }

    // Non-demo code would go here
    setLoading(false);
    setError('Demo mode only');
  };

  // Load settings on mount
  useEffect(() => {
    if (!DEMO_MODE) {
      fetchSettings();
    }
  }, []);

  // Update settings
  const updateSettings = async (updates) => {
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        // Merge updates into current settings
        setSettings(prev => ({
          ...prev,
          smsTemplates: { ...prev.smsTemplates, ...updates.smsTemplates },
          pricing: { ...prev.pricing, ...updates.pricing },
          inspectionIntervals: { ...prev.inspectionIntervals, ...updates.inspectionIntervals },
          companyInfo: { ...prev.companyInfo, ...updates.companyInfo },
          smsSettings: { ...prev.smsSettings, ...updates.smsSettings },
        }));

        logger.debug('[Settings] Demo: Settings updated');
        return { success: true };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('Error updating settings:', err);
      return { success: false, error: 'Nie udało się zaktualizować ustawień' };
    }
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        // Reset to initial mock settings
        setSettings(JSON.parse(JSON.stringify(initialMockSettings)));

        logger.debug('[Settings] Demo: Settings reset to defaults');
        return { success: true };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('Error resetting settings:', err);
      return { success: false, error: 'Nie udało się zresetować ustawień' };
    }
  };

  // Preview SMS message
  const previewSms = async (data) => {
    try {
      if (DEMO_MODE) {
        // Generate preview from template
        let template = settings.smsTemplates?.reminder || '';
        Object.keys(data || {}).forEach(key => {
          template = template.replace(new RegExp(`{${key}}`, 'g'), data[key] || '');
        });
        return { success: true, preview: template };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('Error previewing SMS:', err);
      return { success: false, error: 'Failed to preview SMS' };
    }
  };

  // Helper functions
  const mapDeviceTypeToKey = (deviceType) => {
    const mappings = {
      'Pompa ciepła': 'heatPump',
      'Kocioł gazowy': 'gasBoiler', 
      'Klimatyzator': 'airConditioner',
      'Inne': 'other'
    };
    return mappings[deviceType] || 'other';
  };

  const getInspectionInterval = (deviceType) => {
    const key = mapDeviceTypeToKey(deviceType);
    return settings.inspectionIntervals?.[key] || settings.inspectionIntervals?.other || 12;
  };

  const getMaintenancePrice = (deviceType) => {
    const key = mapDeviceTypeToKey(deviceType);
    return settings.pricing?.[key] || settings.pricing?.other || 180;
  };

  const generateSMSMessage = (type, data) => {
    // Check if settings and smsTemplates exist
    if (!settings || !settings.smsTemplates) {
      logger.warn('SMS templates not loaded yet');
      return `Przypomnienie o przeglądzie ${data.deviceType} w dniu ${data.date}. Adres: ${data.address}`;
    }

    let template = settings.smsTemplates[type];
    if (!template) {
      logger.warn(`SMS template for type '${type}' not found`);
      return `Przypomnienie o przeglądzie ${data.deviceType} w dniu ${data.date}. Adres: ${data.address}`;
    }

    // Replace placeholders with actual data
    Object.keys(data || {}).forEach(key => {
      const placeholder = `{${key}}`;
      template = template.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    return template;
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    previewSms,
    getInspectionInterval,
    getMaintenancePrice,
    generateSMSMessage
  };
};