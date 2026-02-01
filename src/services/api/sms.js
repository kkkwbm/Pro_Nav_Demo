import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockSmsHistory } from '../../demo/mockData';

// SMS API
export const smsApi = {
  // Send inspection reminder for a device
  sendInspectionReminder: async (deviceId) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true, message: 'SMS wysłany pomyślnie (tryb demo)' };
    }
    throw new Error('Demo mode only');
  },

  // Send custom SMS message
  sendCustomMessage: async (phoneNumber, message, deviceId = null) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true, message: 'SMS wysłany pomyślnie (tryb demo)' };
    }
    throw new Error('Demo mode only');
  },

  // Send automatic reminders
  sendAutomaticReminders: async (days = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true, sentCount: 0, message: 'Tryb demo - nie wysłano SMS' };
    }
    throw new Error('Demo mode only');
  },

  // Send overdue notifications
  sendOverdueNotifications: async () => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true, sentCount: 0, message: 'Tryb demo - nie wysłano SMS' };
    }
    throw new Error('Demo mode only');
  },

  // Get SMS configuration status
  getSmsConfigStatus: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { configured: true, provider: 'SMS-FLY (Demo)' };
    }
    throw new Error('Demo mode only');
  },

  // Get SMS-FLY account balance
  getSmsBalance: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { balance: 125.50, currency: 'PLN' };
    }
    throw new Error('Demo mode only');
  },

  // Get SMS-FLY extended account balance
  getExtendedSmsBalance: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { smsBalance: 100.00, viberBalance: 25.50, currency: 'PLN' };
    }
    throw new Error('Demo mode only');
  },

  // Get SMS history for a device
  getHistoryForDevice: async (deviceId) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockSmsHistory.filter(sms => sms.deviceId === deviceId);
    }
    throw new Error('Demo mode only');
  },

  // Get SMS history for a client
  getHistoryForClient: async (clientId) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockSmsHistory;
    }
    throw new Error('Demo mode only');
  },

  // Get last SMS date for device
  getLastSmsDateForDevice: async (deviceId) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const deviceSms = mockSmsHistory.filter(sms => sms.deviceId === deviceId);
      return deviceSms.length > 0 ? deviceSms[0].sentAt : null;
    }
    throw new Error('Demo mode only');
  },

  // Get all SMS history (for dashboard)
  getAllSmsHistory: async (limit = 10) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockSmsHistory.slice(0, limit);
    }
    throw new Error('Demo mode only');
  },
};

// SMS History Mapper
export const smsHistoryMapper = {
  formatSmsHistory: (smsRecord) => {
    const sentDate = new Date(smsRecord.sentAt);
    
    return {
      id: smsRecord.id,
      deviceId: smsRecord.deviceId,
      deviceName: smsRecord.deviceName || 'Nieznane urządzenie',
      deviceType: smsRecord.deviceType || 'Nieznany typ',
      clientId: smsRecord.clientId,
      clientName: smsRecord.clientName || 'Nieznany klient',
      phoneNumber: smsRecord.phoneNumber,
      message: smsRecord.message,
      sentAt: smsRecord.sentAt,
      success: smsRecord.success,
      smsType: smsRecord.smsType,
      errorMessage: smsRecord.errorMessage,
      // Formatted display fields
      displayDate: sentDate.toLocaleDateString('pl-PL'),
      displayTime: sentDate.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      displayType: getDisplayType(smsRecord.smsType),
      automationStatus: getAutomationStatus(smsRecord.smsType),
      statusText: smsRecord.success ? 'Wysłane' : 'Błąd',
      statusIcon: smsRecord.success ? '✓' : '✗',
    };
  },
};

// Helper function to get display type
function getDisplayType(smsType) {
  const typeMap = {
    'INSPECTION_REMINDER': 'Automatyczne przypomnienie o przeglądzie',
    'MANUAL_INSPECTION_REMINDER': 'Ręczne przypomnienie o przeglądzie', 
    'EXPIRATION_DATE_NOTIFICATION': 'Automatyczne powiadomienie w dniu wygaśnięcia',
    'MANUAL_EXPIRATION_NOTIFICATION': 'Ręczne powiadomienie w dniu wygaśnięcia',
    'CUSTOM': 'Wiadomość niestandardowa',
    'MANUAL_CUSTOM': 'Ręczna wiadomość niestandardowa',
    'SERVICE_CONFIRMATION': 'Potwierdzenie serwisu',
    'GENERAL_NOTIFICATION': 'Powiadomienie ogólne',
    'ADVERTISING': 'SMS reklamowy',
    // Legacy types
    'OLD_INSPECTION_REMINDER': 'Przypomnienie o przeglądzie',
    'OLD_EXPIRATION_DATE_NOTIFICATION': 'Powiadomienie w dniu wygaśnięcia',
  };
  return typeMap[smsType] || smsType || 'Nieznany typ';
}

// Helper function to get automation status
function getAutomationStatus(smsType) {
  const automaticTypes = [
    'INSPECTION_REMINDER',
    'EXPIRATION_DATE_NOTIFICATION'
  ];
  
  const manualTypes = [
    'MANUAL_INSPECTION_REMINDER',
    'MANUAL_EXPIRATION_NOTIFICATION', 
    'CUSTOM',
    'MANUAL_CUSTOM'
  ];
  
  if (automaticTypes.includes(smsType)) {
    return 'Automatyczne';
  } else if (manualTypes.includes(smsType)) {
    return 'Ręczne';
  } else {
    return 'Inne';
  }
}