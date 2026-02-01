import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockSettings } from '../../demo/mockData';

// Demo helper to generate SMS preview
const generateDemoSmsPreview = (data) => {
  const deviceTypeNames = {
    'HEAT_PUMP': 'pompy ciepła',
    'GAS_BOILER': 'kotła gazowego',
    'OIL_BOILER': 'kotła olejowego',
    'AIR_CONDITIONER': 'klimatyzatora',
  };

  const deviceTypePrices = {
    'HEAT_PUMP': '350 zł',
    'GAS_BOILER': '280 zł',
    'OIL_BOILER': '200 zł',
    'AIR_CONDITIONER': '150 zł',
  };

  const deviceTypeName = deviceTypeNames[data.deviceType] || data.deviceType;
  const price = deviceTypePrices[data.deviceType] || '300 zł';
  const demoConfirmationUrl = 'https://demo.serwispro.pl/confirm/DEMO-TOKEN-123';

  if (data.customTemplate) {
    // Replace variables in custom template
    let message = data.customTemplate;
    message = message.replace(/{deviceType}/g, deviceTypeName);
    message = message.replace(/{deviceName}/g, data.deviceName || deviceTypeName);
    message = message.replace(/{address}/g, data.address || '');
    message = message.replace(/{inspectionDate}/g, data.inspectionDate || 'do ustalenia');
    message = message.replace(/{deviceTypePrice}/g, price);
    message = message.replace(/{customConfirmationURL}/g, demoConfirmationUrl);
    message = message.replace(/{contactPhoneNumber}/g, '123 456 789');
    message = message.replace(/{clientName}/g, data.clientName || '');
    return message;
  }

  // Default template
  return `Dzień dobry! Z tej strony firma SerwisPro. Przypominamy o zbliżającym się przeglądzie ${deviceTypeName} ${data.deviceName || ''} pod adresem ${data.address || ''}. Termin: ${data.inspectionDate || 'do ustalenia'}. Koszt serwisu ${price}. Wejdź w link poniżej aby potwierdzić chęć przeprowadzenia serwisu: ${demoConfirmationUrl}`;
};

// In-memory settings for demo mode
let demoSettings = { ...mockSettings };

// Settings API
export const settingsApi = {
  // Get current settings
  get: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return demoSettings;
    }
    throw new Error('Demo mode only');
  },

  // Update settings
  update: async (settings) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      demoSettings = {
        ...demoSettings,
        ...settings,
      };
      return demoSettings;
    }
    throw new Error('Demo mode only');
  },

  // Reset to defaults
  reset: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      demoSettings = { ...mockSettings };
      return demoSettings;
    }
    throw new Error('Demo mode only');
  },

  // Preview SMS message
  previewSms: async (data) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { message: generateDemoSmsPreview(data) };
    }
    throw new Error('Demo mode only');
  },

  // Preview SMS message for device with real confirmation link
  previewSmsForDevice: async (data) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { message: generateDemoSmsPreview(data) };
    }
    throw new Error('Demo mode only');
  },

  // Preview custom template SMS message with real data and confirmation link
  previewCustomTemplate: async (data) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { message: generateDemoSmsPreview(data) };
    }
    throw new Error('Demo mode only');
  },

  // Get public contact information (no auth required)
  getPublicContact: async () => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      return {
        phone: '123 456 789',
        email: 'kontakt@serwispro.pl',
        address: 'ul. Przykładowa 123, 00-001 Warszawa',
      };
    }
    throw new Error('Demo mode only');
  },
};
