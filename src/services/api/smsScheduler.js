import axiosInstance from '../../config/axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockSettings } from '../../demo/mockData';

// Demo state for scheduler settings
let demoSchedulerSettings = {
  remindersEnabled: true,
  expirationDayEnabled: mockSettings.smsTemplates.expirationDayEnabled,
  daysAhead: mockSettings.smsSettings.reminderDaysAhead,
  sendTime: 9,
};

// SMS Scheduler API
export const smsSchedulerApi = {
  // Get scheduler status and settings
  getStatus: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      return {
        running: true,
        lastRun: new Date().toISOString(),
        nextRun: new Date(Date.now() + 86400000).toISOString(),
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SMS_SCHEDULER.GET_STATUS);
    return response.data;
  },

  getSettings: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SMS_SCHEDULER.GET_SETTINGS);
    return response.data;
  },

  // Toggle before-deadline reminders (X days before)
  toggleReminders: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.remindersEnabled = !demoSchedulerSettings.remindersEnabled;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.TOGGLE_REMINDERS);
    return response.data;
  },

  // Toggle expiration day notifications (day of service)
  toggleExpirationDay: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.expirationDayEnabled = !demoSchedulerSettings.expirationDayEnabled;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.TOGGLE_EXPIRATION_DAY);
    return response.data;
  },

  // Enable/disable specific notification types
  enableReminders: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.remindersEnabled = true;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.ENABLE_REMINDERS);
    return response.data;
  },

  disableReminders: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.remindersEnabled = false;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.DISABLE_REMINDERS);
    return response.data;
  },

  enableExpirationDay: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.expirationDayEnabled = true;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.ENABLE_EXPIRATION_DAY);
    return response.data;
  },

  disableExpirationDay: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.expirationDayEnabled = false;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.DISABLE_EXPIRATION_DAY);
    return response.data;
  },

  // Manual triggers
  triggerReminders: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, message: 'Przypomnienia wysłane (tryb demo)', sentCount: 3 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.TRIGGER_REMINDERS);
    return response.data;
  },

  triggerExpirationDay: async () => {
    if (DEMO_MODE) {
      await simulateDelay();
      return { success: true, message: 'Powiadomienia wysłane (tryb demo)', sentCount: 2 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SMS_SCHEDULER.TRIGGER_EXPIRATION_DAY);
    return response.data;
  },

  // Update settings
  updateDaysAhead: async (days) => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.daysAhead = days;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.put(API_ENDPOINTS.SMS_SCHEDULER.UPDATE_DAYS_AHEAD, null, {
      params: { days }
    });
    return response.data;
  },

  updateSendTime: async (hour) => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings.sendTime = hour;
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.put(API_ENDPOINTS.SMS_SCHEDULER.UPDATE_SEND_TIME, null, {
      params: { hour }
    });
    return response.data;
  },

  updateSettings: async (settings) => {
    if (DEMO_MODE) {
      await simulateDelay();
      demoSchedulerSettings = { ...demoSchedulerSettings, ...settings };
      return demoSchedulerSettings;
    }
    const response = await axiosInstance.put(API_ENDPOINTS.SMS_SCHEDULER.UPDATE_SETTINGS, settings);
    return response.data;
  },
};