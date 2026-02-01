import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';

// Mock confirmation history data
const mockConfirmationHistory = [
  {
    token: 'demo-token-1',
    tokenType: 'SERVICE_CONFIRMATION',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    confirmed: true,
    confirmedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    token: 'demo-token-2',
    tokenType: 'SERVICE_CONFIRMATION',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    confirmed: false,
    confirmedAt: null,
    scheduledDate: null,
  },
];

// Confirmation API
export const confirmationApi = {
  // Public endpoints (no authentication required)
  // Confirm a token (when user clicks the link or makes API call)
  confirmToken: async (token) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        message: 'Token potwierdzony pomyślnie (tryb demo)',
        confirmed: true,
        confirmedAt: new Date().toISOString(),
      };
    }
    throw new Error('Demo mode only');
  },

  // Get token information (for preview)
  getTokenInfo: async (token) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return {
        token: token,
        tokenType: 'SERVICE_CONFIRMATION',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        confirmed: false,
        expired: false,
        deviceInfo: {
          deviceName: 'Viessmann Vitocal 200-S',
          deviceType: 'Pompa ciepła',
          address: 'ul. Kwiatowa 15, 00-001 Warszawa',
        },
        clientInfo: {
          name: 'Jan Kowalski',
        },
        scheduledDate: null,
      };
    }
    throw new Error('Demo mode only');
  },

  // Cancel a token (public - token-based access)
  cancelToken: async (token) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        message: 'Token anulowany pomyślnie (tryb demo)',
      };
    }
    throw new Error('Demo mode only');
  },

  // Update schedule with token
  updateSchedule: async (token, scheduledDate) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        message: 'Termin zaktualizowany pomyślnie (tryb demo)',
        scheduledDate: scheduledDate,
      };
    }
    throw new Error('Demo mode only');
  },

  // Authenticated endpoints (for admin/management functions)
  // Get confirmation history for a device
  getDeviceConfirmationHistory: async (deviceId) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockConfirmationHistory;
    }
    throw new Error('Demo mode only');
  },

  // Get confirmation history for a client
  getClientConfirmationHistory: async (clientId) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockConfirmationHistory;
    }
    throw new Error('Demo mode only');
  },
};

// Confirmation data mapper
export const confirmationMapper = {
  formatConfirmationHistory: (history) => {
    return {
      token: history.token,
      tokenType: history.tokenType,
      createdAt: new Date(history.createdAt),
      expiresAt: new Date(history.expiresAt),
      confirmed: history.confirmed,
      confirmedAt: history.confirmedAt ? new Date(history.confirmedAt) : null,
      scheduledDate: history.scheduledDate ? new Date(history.scheduledDate) : null,
      // Display values
      displayCreatedAt: new Date(history.createdAt).toLocaleDateString('pl-PL'),
      displayExpiresAt: new Date(history.expiresAt).toLocaleDateString('pl-PL'),
      displayConfirmedAt: history.confirmedAt
        ? new Date(history.confirmedAt).toLocaleDateString('pl-PL')
        : 'Nie potwierdzono',
      displayScheduledDate: history.scheduledDate
        ? new Date(history.scheduledDate).toLocaleDateString('pl-PL')
        : 'Nie ustalono',
      statusColor: history.confirmed ? '#10b981' :
                   new Date(history.expiresAt) < new Date() ? '#ef4444' : '#f59e0b',
      statusText: history.confirmed ? 'Potwierdzono' :
                  new Date(history.expiresAt) < new Date() ? 'Wygasł' : 'Oczekuje',
    };
  },

  formatTokenInfo: (tokenInfo) => {
    return {
      ...tokenInfo,
      displayCreatedAt: new Date(tokenInfo.createdAt).toLocaleDateString('pl-PL'),
      displayExpiresAt: new Date(tokenInfo.expiresAt).toLocaleDateString('pl-PL'),
      displayConfirmedAt: tokenInfo.confirmedAt
        ? new Date(tokenInfo.confirmedAt).toLocaleDateString('pl-PL')
        : null,
      displayScheduledDate: tokenInfo.scheduledDate
        ? new Date(tokenInfo.scheduledDate).toLocaleDateString('pl-PL')
        : null,
      statusColor: tokenInfo.confirmed ? '#10b981' :
                   tokenInfo.expired ? '#ef4444' : '#f59e0b',
      statusText: tokenInfo.confirmed ? 'Potwierdzony' :
                  tokenInfo.expired ? 'Wygasł' : 'Oczekujący',
    };
  },
};
