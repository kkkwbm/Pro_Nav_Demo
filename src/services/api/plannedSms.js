import axiosInstance from '../../config/axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockPlannedSms } from '../../demo/mockData';

// In-memory state for demo mode
let demoPlannedSmsState = null;

const getDemoState = () => {
  if (!demoPlannedSmsState) {
    demoPlannedSmsState = JSON.parse(JSON.stringify(mockPlannedSms));
  }
  return demoPlannedSmsState;
};

// Planned SMS API
export const plannedSmsApi = {
  // Get all planned SMS with pagination
  getAllPlannedSms: async (page = 0, size = 20) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const data = getDemoState();
      const start = page * size;
      const content = data.slice(start, start + size);
      return {
        content,
        totalPages: Math.ceil(data.length / size),
        totalElements: data.length
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.LIST, {
      params: { page, size }
    });
    return response.data;
  },

  // Get planned SMS by status
  getPlannedSmsByStatus: async (status, page = 0, size = 20) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const data = getDemoState().filter(sms => sms.status === status);
      const start = page * size;
      return {
        content: data.slice(start, start + size),
        totalPages: Math.ceil(data.length / size),
        totalElements: data.length
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.BY_STATUS(status), {
      params: { page, size }
    });
    return response.data;
  },

  // Get planned SMS by ID
  getPlannedSmsById: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      return getDemoState().find(sms => sms.id === id);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.GET(id));
    return response.data;
  },

  // Get planned SMS by client
  getPlannedSmsByClient: async (clientId, page = 0, size = 20) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const data = getDemoState().filter(sms => sms.clientId === clientId);
      return {
        content: data.slice(page * size, (page + 1) * size),
        totalPages: Math.ceil(data.length / size),
        totalElements: data.length
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.BY_CLIENT(clientId), {
      params: { page, size }
    });
    return response.data;
  },

  // Get planned SMS by device
  getPlannedSmsByDevice: async (deviceId, page = 0, size = 20) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const data = getDemoState().filter(sms => sms.deviceId === deviceId);
      return {
        content: data.slice(page * size, (page + 1) * size),
        totalPages: Math.ceil(data.length / size),
        totalElements: data.length
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.BY_DEVICE(deviceId), {
      params: { page, size }
    });
    return response.data;
  },

  // Search planned SMS
  searchPlannedSms: async (searchTerm, page = 0, size = 20) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const term = searchTerm.toLowerCase();
      const data = getDemoState().filter(sms =>
        sms.clientName?.toLowerCase().includes(term) ||
        sms.phoneNumber?.includes(term) ||
        sms.message?.toLowerCase().includes(term)
      );
      return {
        content: data.slice(page * size, (page + 1) * size),
        totalPages: Math.ceil(data.length / size),
        totalElements: data.length
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.SEARCH, {
      params: { q: searchTerm, page, size }
    });
    return response.data;
  },

  // Get scheduled SMS for today
  getScheduledForToday: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const today = new Date().toDateString();
      return getDemoState().filter(sms =>
        new Date(sms.scheduledAt).toDateString() === today &&
        sms.status === 'SCHEDULED'
      );
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.TODAY);
    return response.data;
  },

  // Get scheduled SMS for specific date
  getScheduledForDate: async (date) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const targetDate = new Date(date).toDateString();
      return getDemoState().filter(sms =>
        new Date(sms.scheduledAt).toDateString() === targetDate
      );
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.BY_DATE(date));
    return response.data;
  },

  // Get upcoming SMS
  getUpcomingSms: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const now = new Date();
      return getDemoState().filter(sms =>
        new Date(sms.scheduledAt) > now && sms.status === 'SCHEDULED'
      );
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.UPCOMING);
    return response.data;
  },

  // Get pending SMS (overdue)
  getPendingSms: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return getDemoState().filter(sms => sms.status === 'SCHEDULED');
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.PENDING);
    return response.data;
  },

  // Get scheduled SMS for next 7 days
  getScheduledForNext7Days: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const now = new Date();
      const next7Days = new Date();
      next7Days.setDate(next7Days.getDate() + 7);
      return getDemoState().filter(sms => {
        const scheduledDate = new Date(sms.scheduledAt);
        return scheduledDate >= now && scheduledDate <= next7Days;
      });
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.NEXT_7_DAYS);
    return response.data;
  },

  // Get scheduled SMS for next 30 days
  getScheduledForNext30Days: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const now = new Date();
      const next30Days = new Date();
      next30Days.setDate(next30Days.getDate() + 30);
      return getDemoState().filter(sms => {
        const scheduledDate = new Date(sms.scheduledAt);
        return scheduledDate >= now && scheduledDate <= next30Days;
      });
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.NEXT_30_DAYS);
    return response.data;
  },

  // Get scheduled SMS for date range
  getScheduledForPeriod: async (startDate, endDate) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return getDemoState().filter(sms => {
        const scheduledDate = new Date(sms.scheduledAt);
        return scheduledDate >= start && scheduledDate <= end;
      });
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.DATE_RANGE, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const data = getDemoState();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      return {
        total: data.length,
        scheduled: data.filter(s => s.status === 'SCHEDULED').length,
        sent: data.filter(s => s.status === 'SENT').length,
        failed: data.filter(s => s.status === 'FAILED').length,
        cancelled: data.filter(s => s.status === 'CANCELLED').length,
        scheduledToday: data.filter(s => {
          const d = new Date(s.scheduledAt);
          return d.toDateString() === today.toDateString() && s.status === 'SCHEDULED';
        }).length,
        scheduledThisWeek: data.filter(s => {
          const d = new Date(s.scheduledAt);
          return d >= today && d <= endOfWeek && s.status === 'SCHEDULED';
        }).length,
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.STATS);
    return response.data;
  },

  // Get daily statistics
  getDailyStatistics: async (startDate, endDate) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return [];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.STATS_DAILY, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Cancel planned SMS
  cancelPlannedSms: async (id, reason = 'Cancelled by user') => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const state = getDemoState();
      const index = state.findIndex(s => s.id === id);
      if (index !== -1) {
        state[index].status = 'CANCELLED';
      }
      return { success: true };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.PLANNED_SMS.CANCEL(id), {
      reason
    });
    return response.data;
  },

  // Delete planned SMS
  deletePlannedSms: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      demoPlannedSmsState = getDemoState().filter(s => s.id !== id);
      return { success: true };
    }
    const response = await axiosInstance.delete(API_ENDPOINTS.PLANNED_SMS.DELETE(id));
    return response.data;
  },

  // Mark planned SMS as sent
  markPlannedSmsAsSent: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const state = getDemoState();
      const index = state.findIndex(s => s.id === id);
      if (index !== -1) {
        state[index].status = 'SENT';
        state[index].sentAt = new Date().toISOString();
      }
      return { success: true };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.PLANNED_SMS.MARK_AS_SENT(id));
    return response.data;
  },

  // Update planned SMS message (NEW)
  updatePlannedSms: async (id, data) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const state = getDemoState();
      const index = state.findIndex(s => s.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...data };
      }
      return { success: true };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.PLANNED_SMS.UPDATE(id), data);
    return response.data;
  },

  // Cleanup old planned SMS
  cleanupOldPlannedSms: async (daysToKeep = 30) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return { deletedCount: 0 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.PLANNED_SMS.CLEANUP, null, {
      params: { daysToKeep }
    });
    return response.data;
  },

  // Manually plan inspection reminders
  planInspectionReminders: async (daysAhead = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { count: 0, message: 'Demo: Zaplanowano przypomnienia' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.PLANNED_SMS.PLAN_INSPECTION_REMINDERS, null, {
      params: { daysAhead }
    });
    return response.data;
  },

  // Manually plan expiration notifications
  planExpirationNotifications: async () => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { count: 0, message: 'Demo: Zaplanowano powiadomienia' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.PLANNED_SMS.PLAN_EXPIRATION_NOTIFICATIONS);
    return response.data;
  },

  // Manually trigger processing of pending planned SMS
  processPlannedSms: async () => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true, message: 'Demo: Przetworzono SMS-y' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS.PROCESS_PLANNED);
    return response.data;
  },

  // Debug endpoint to get detailed planning information
  getPlanningDebugInfo: async (daysAhead = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return { debug: 'Demo mode' };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.PLANNED_SMS.DEBUG_PLANNING_INFO, {
      params: { daysAhead }
    });
    return response.data;
  },

  // Enhanced planning with full debug logging
  planWithFullDebugLogs: async (daysAhead = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.PLANNED_SMS.DEBUG_PLAN_WITH_LOGS, null, {
      params: { daysAhead }
    });
    return response.data;
  },

  // Refresh planning by adding new SMS without deleting existing ones
  refreshPlanning: async (daysAhead = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true, addedTotal: 0, message: 'Demo: Odświeżono planowanie' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.PLANNED_SMS.REFRESH_PLANNING, null, {
      params: { daysAhead }
    });
    return response.data;
  },

  // Force re-plan by clearing all SCHEDULED SMS and planning fresh
  forceReplan: async (daysAhead = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return { success: true };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.PLANNED_SMS.FORCE_REPLAN, null, {
      params: { daysAhead }
    });
    return response.data;
  },
};

// Planned SMS Status constants
export const PLANNED_SMS_STATUS = {
  SCHEDULED: 'SCHEDULED',
  SENT: 'SENT',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED',
  CANCELLED: 'CANCELLED'
};

// SMS Type constants
export const SMS_TYPE = {
  INSPECTION_REMINDER: 'INSPECTION_REMINDER',
  EXPIRATION_DATE_NOTIFICATION: 'EXPIRATION_DATE_NOTIFICATION',
  MANUAL_CUSTOM: 'MANUAL_CUSTOM',
  ADVERTISING: 'ADVERTISING'
};

// Planned SMS Mapper
export const plannedSmsMapper = {
  formatPlannedSms: (plannedSms) => {
    const scheduledDate = new Date(plannedSms.scheduledAt);
    const createdDate = new Date(plannedSms.createdAt);
    
    return {
      id: plannedSms.id,
      deviceId: plannedSms.device?.id || null,
      deviceName: plannedSms.device?.nazwaUrzadzenia || 'SMS Reklamowy',
      deviceType: plannedSms.device?.typUrzadzenia?.displayName || 'Reklama',
      clientId: plannedSms.client?.id || null,
      clientName: plannedSms.client ? 
        `${plannedSms.client.imie || ''} ${plannedSms.client.nazwisko || ''}`.trim() || 
        `${plannedSms.client.firstName || ''} ${plannedSms.client.lastName || ''}`.trim() : 
        'Nieznany klient',
      phoneNumber: plannedSms.phoneNumber,
      message: plannedSms.message,
      shortMessage: plannedSms.message && plannedSms.message.length > 50 ? 
        plannedSms.message.substring(0, 50) + '...' : 
        plannedSms.message,
      scheduledAt: plannedSms.scheduledAt,
      status: plannedSms.status,
      smsType: plannedSms.smsType,
      createdAt: plannedSms.createdAt,
      updatedAt: plannedSms.updatedAt,
      sentAt: plannedSms.sentAt,
      errorMessage: plannedSms.errorMessage,
      plannedSource: plannedSms.plannedSource,
      retryCount: plannedSms.retryCount || 0,
      maxRetries: plannedSms.maxRetries || 3,
      
      // Formatted display fields
      displayScheduledDate: scheduledDate.toLocaleDateString('pl-PL'),
      displayScheduledTime: scheduledDate.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      displayCreatedDate: createdDate.toLocaleDateString('pl-PL'),
      displayCreatedTime: createdDate.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      displayType: getDisplayType(plannedSms.smsType),
      displayStatus: getDisplayStatus(plannedSms.status),
      automationStatus: getAutomationStatus(plannedSms.plannedSource),
      
      // Status helpers
      isScheduled: plannedSms.status === PLANNED_SMS_STATUS.SCHEDULED,
      isSent: plannedSms.status === PLANNED_SMS_STATUS.SENT,
      isFailed: plannedSms.status === PLANNED_SMS_STATUS.FAILED,
      isSkipped: plannedSms.status === PLANNED_SMS_STATUS.SKIPPED,
      isCancelled: plannedSms.status === PLANNED_SMS_STATUS.CANCELLED,
      isPending: plannedSms.status === PLANNED_SMS_STATUS.SCHEDULED && scheduledDate <= new Date(),
      isFuture: plannedSms.status === PLANNED_SMS_STATUS.SCHEDULED && scheduledDate > new Date(),
      
      // Time helpers
      isToday: scheduledDate.toDateString() === new Date().toDateString(),
      isOverdue: plannedSms.status === PLANNED_SMS_STATUS.SCHEDULED && scheduledDate < new Date(),
      minutesUntilScheduled: plannedSms.status === PLANNED_SMS_STATUS.SCHEDULED ? 
        Math.max(0, Math.floor((scheduledDate - new Date()) / (1000 * 60))) : 0,
        
      // Device relation helpers
      hasDevice: !!plannedSms.device,
      isAdvertising: plannedSms.smsType === SMS_TYPE.ADVERTISING,
    };
  },

  // Format for table display
  formatForTable: (plannedSms) => {
    const formatted = plannedSmsMapper.formatPlannedSms(plannedSms);
    return {
      ...formatted,
      statusColor: getStatusColor(formatted.status),
      statusBadge: getStatusBadge(formatted.status),
      priorityLevel: getPriorityLevel(formatted),
    };
  }
};

// Helper function to get display type
function getDisplayType(smsType) {
  const typeMap = {
    'INSPECTION_REMINDER': 'Przypomnienie',
    'EXPIRATION_DATE_NOTIFICATION': 'Wygaśnięcie',
    'MANUAL_CUSTOM': 'Niestandardowa',
    'ADVERTISING': 'Reklamowy',
    'GENERAL_NOTIFICATION': 'Ogólne',
  };
  return typeMap[smsType] || smsType || 'Nieznany typ';
}

// Helper function to get display status
function getDisplayStatus(status) {
  const statusMap = {
    'SCHEDULED': 'Zaplanowane',
    'SENT': 'Wysłane',
    'FAILED': 'Błąd',
    'SKIPPED': 'Pominięte',
    'CANCELLED': 'Anulowane'
  };
  return statusMap[status] || status || 'Nieznany status';
}

// Helper function to get automation status
function getAutomationStatus(plannedSource) {
  if (!plannedSource) return 'Nieznane';
  
  if (plannedSource.includes('AUTOMATIC')) {
    return 'Automatyczne';
  } else if (plannedSource.includes('MANUAL')) {
    return 'Ręczne';
  } else {
    return 'Inne';
  }
}

// Helper function to get status color
function getStatusColor(status) {
  const colorMap = {
    'SCHEDULED': '#3b82f6', // blue
    'SENT': '#22c55e',      // green
    'FAILED': '#ef4444',    // red
    'SKIPPED': '#f59e0b',   // yellow
    'CANCELLED': '#6b7280'  // gray
  };
  return colorMap[status] || '#6b7280';
}

// Helper function to get status badge style
function getStatusBadge(status) {
  const badgeMap = {
    'SCHEDULED': { bg: '#dbeafe', color: '#1e40af' },
    'SENT': { bg: '#dcfce7', color: '#166534' },
    'FAILED': { bg: '#fee2e2', color: '#dc2626' },
    'SKIPPED': { bg: '#fef3c7', color: '#d97706' },
    'CANCELLED': { bg: '#f3f4f6', color: '#4b5563' }
  };
  return badgeMap[status] || { bg: '#f3f4f6', color: '#4b5563' };
}

// Helper function to get priority level
function getPriorityLevel(plannedSms) {
  if (plannedSms.isOverdue) return 'high';
  if (plannedSms.isToday) return 'medium';
  if (plannedSms.minutesUntilScheduled < 60) return 'high';
  if (plannedSms.minutesUntilScheduled < 24 * 60) return 'medium';
  return 'low';
}