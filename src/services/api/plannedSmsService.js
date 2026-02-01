import { plannedSmsApi, plannedSmsMapper } from './plannedSms';

export const plannedSmsService = {
  // Get all planned SMS with pagination
  getAllPlannedSms: async (page = 0, size = 20) => {
    try {
      const response = await plannedSmsApi.getAllPlannedSms(page, size);
      return {
        content: response.content.map(plannedSmsMapper.formatForTable),
        totalPages: response.totalPages,
        totalElements: response.totalElements
      };
    } catch (error) {
      console.error('Error fetching all planned SMS:', error);
      throw error;
    }
  },

  // Get planned SMS by status
  getPlannedSmsByStatus: async (status, page = 0, size = 20) => {
    try {
      const response = await plannedSmsApi.getPlannedSmsByStatus(status, page, size);
      return {
        content: response.content.map(plannedSmsMapper.formatForTable),
        totalPages: response.totalPages,
        totalElements: response.totalElements
      };
    } catch (error) {
      console.error('Error fetching planned SMS by status:', error);
      throw error;
    }
  },

  // Get SMS scheduled for today
  getScheduledForToday: async () => {
    try {
      const response = await plannedSmsApi.getScheduledForToday();
      return response.map(plannedSmsMapper.formatForTable);
    } catch (error) {
      console.error('Error fetching today\'s scheduled SMS:', error);
      throw error;
    }
  },

  // Get SMS scheduled for next 7 days
  getScheduledForNext7Days: async () => {
    try {
      const response = await plannedSmsApi.getScheduledForNext7Days();
      return response.map(plannedSmsMapper.formatForTable);
    } catch (error) {
      console.error('Error fetching SMS for next 7 days:', error);
      throw error;
    }
  },

  // Get SMS scheduled for next 30 days
  getScheduledForNext30Days: async () => {
    try {
      const response = await plannedSmsApi.getScheduledForNext30Days();
      return response.map(plannedSmsMapper.formatForTable);
    } catch (error) {
      console.error('Error fetching SMS for next 30 days:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      return await plannedSmsApi.getStatistics();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Cancel planned SMS
  cancelPlannedSms: async (id, reason = 'Anulowane przez użytkownika') => {
    try {
      return await plannedSmsApi.cancelPlannedSms(id, reason);
    } catch (error) {
      console.error('Error cancelling planned SMS:', error);
      throw error;
    }
  },

  // Delete planned SMS
  deletePlannedSms: async (id) => {
    try {
      return await plannedSmsApi.deletePlannedSms(id);
    } catch (error) {
      console.error('Error deleting planned SMS:', error);
      throw error;
    }
  },

  // Mark planned SMS as sent
  markPlannedSmsAsSent: async (id) => {
    try {
      return await plannedSmsApi.markPlannedSmsAsSent(id);
    } catch (error) {
      console.error('Error marking planned SMS as sent:', error);
      throw error;
    }
  },

  // Update planned SMS
  updatePlannedSms: async (id, updateData) => {
    try {
      return await plannedSmsApi.updatePlannedSms(id, updateData);
    } catch (error) {
      console.error('Error updating planned SMS:', error);
      throw error;
    }
  },

  // Process planned SMS
  processPlannedSms: async () => {
    try {
      return await plannedSmsApi.processPlannedSms();
    } catch (error) {
      console.error('Error processing planned SMS:', error);
      throw error;
    }
  },

  // Plan SMS with full debug logs
  planWithFullDebugLogs: async () => {
    try {
      return await plannedSmsApi.planWithFullDebugLogs();
    } catch (error) {
      console.error('Error planning SMS with debug logs:', error);
      throw error;
    }
  },

  // Refresh planning by adding new SMS without deleting existing ones
  refreshPlanning: async (daysAhead = 14) => {
    try {
      return await plannedSmsApi.refreshPlanning(daysAhead);
    } catch (error) {
      console.error('Error refreshing planning:', error);
      throw error;
    }
  },

  // Force re-plan by clearing all SCHEDULED SMS and planning fresh
  forceReplan: async (daysAhead = 14) => {
    try {
      return await plannedSmsApi.forceReplan(daysAhead);
    } catch (error) {
      console.error('Error forcing replan:', error);
      throw error;
    }
  },

  // Load data based on filters
  loadFilteredData: async (filters, page = 0, size = 20) => {
    const { timeFilter } = filters;

    try {
      if (timeFilter === 'next7days') {
        const data = await plannedSmsService.getScheduledForNext7Days();
        return {
          content: data,
          totalPages: Math.ceil(data.length / size),
          totalElements: data.length
        };
      } else if (timeFilter === 'month') {
        const data = await plannedSmsService.getScheduledForNext30Days();
        return {
          content: data,
          totalPages: Math.ceil(data.length / size),
          totalElements: data.length
        };
      } else if (timeFilter === 'sixmonths') {
        // Get all SMS and filter for next 6 months (180 days)
        const allData = await plannedSmsService.getAllPlannedSms(0, 1000);
        const now = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        const filtered = allData.content.filter(sms => {
          const scheduledDate = new Date(sms.scheduledAt);
          return scheduledDate >= now && scheduledDate <= sixMonthsLater;
        });

        return {
          content: filtered,
          totalPages: Math.ceil(filtered.length / size),
          totalElements: filtered.length
        };
      } else {
        // 'all' - return everything (one year)
        return await plannedSmsService.getAllPlannedSms(page, size);
      }
    } catch (error) {
      console.error('Error loading filtered data:', error);
      throw error;
    }
  }
};