import axiosInstance from '../../config/axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { DEMO_MODE, simulateDelay, demoNotifications } from '../../demo/demoMode';

// Advertising SMS API with corrected endpoints
export const advertisingSmsApi = {
  // Send advertising SMS to all clients
  sendToAll: async (message, testMode = false) => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, message: demoNotifications.smsSuccess, sentCount: 8 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.ADVERTISING.SEND_TO_ALL, {
      message,
      testMode,
    });
    return response.data;
  },

  // Send advertising SMS to active clients only
  sendToActive: async (message, testMode = false) => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, message: demoNotifications.smsSuccess, sentCount: 6 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.ADVERTISING.SEND_TO_ACTIVE, {
      message,
      testMode,
    });
    return response.data;
  },

  // Send advertising SMS to selected clients
  sendToSelected: async (clientIds, message, testMode = false) => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, message: demoNotifications.smsSuccess, sentCount: clientIds.length };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.ADVERTISING.SEND_TO_SELECTED, {
      clientIds,
      message,
      testMode,
    });
    return response.data;
  },

  // Preview advertising message
  preview: async (message) => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { preview: message, charactersCount: message.length };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.ADVERTISING.PREVIEW, {
      message,
    });
    return response.data;
  },

  // Get advertising statistics
  getStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      return {
        totalAdvertisingSent: 45,
        thisMonthSent: 12,
        lastCampaignDate: Math.floor(Date.now() / 1000) - 86400 * 7,
        totalRecipients: 8,
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.ADVERTISING.GET_STATISTICS);
    return response.data;
  },

  // Get advertising status
  getStatus: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { enabled: true, lastRun: new Date().toISOString() };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.ADVERTISING.GET_STATUS);
    return response.data;
  },
};

// SMS History Mapper for advertising SMS
export const advertisingSmsHistoryMapper = {
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
      statusText: smsRecord.success ? 'Wysłane' : 'Błąd',
      statusIcon: smsRecord.success ? '✔' : '✗',
    };
  },
};

// Helper function to get display type
function getDisplayType(smsType) {
  const typeMap = {
    'INSPECTION_REMINDER': 'Przypomnienie o przeglądzie',
    'OVERDUE_NOTIFICATION': 'Powiadomienie o przeterminowaniu',
    'CUSTOM': 'Wiadomość niestandardowa',
    'SERVICE_CONFIRMATION': 'Potwierdzenie serwisu',
    'GENERAL_NOTIFICATION': 'Powiadomienie ogólne',
    'ADVERTISING': 'Reklama',
  };
  return typeMap[smsType] || smsType || 'Nieznany typ';
}

// Helper function to format advertising stats
export const formatAdvertisingStats = (stats) => {
  return {
    totalSent: stats.totalAdvertisingSent || 0,
    thisMonthSent: stats.thisMonthSent || 0,
    lastCampaignDate: stats.lastCampaignDate 
      ? new Date(stats.lastCampaignDate * 1000).toLocaleDateString('pl-PL')
      : 'Brak danych',
    totalRecipients: stats.totalRecipients || 0,
  };
};