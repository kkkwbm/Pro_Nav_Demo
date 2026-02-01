import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockServiceHistory } from '../../demo/mockData';

class ServiceHistoryAPI {
  /**
   * Get complete service history for a specific device
   */
  static async getDeviceServiceHistory(deviceId) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockServiceHistory[deviceId] || [];
    }
    throw new Error('Demo mode only');
  }

  /**
   * Get service history for a device within a date range
   */
  static async getDeviceServiceHistoryByDateRange(deviceId, startDate, endDate) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const history = mockServiceHistory[deviceId] || [];
      return history.filter(entry => {
        const date = new Date(entry.serviceDate);
        return date >= startDate && date <= endDate;
      });
    }
    throw new Error('Demo mode only');
  }

  /**
   * Get service history for all devices of a client
   */
  static async getClientServiceHistory(clientId) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      // Combine all service history for this client's devices
      const allHistory = [];
      for (const deviceId of Object.keys(mockServiceHistory)) {
        const history = mockServiceHistory[deviceId];
        allHistory.push(...history);
      }
      return allHistory;
    }
    throw new Error('Demo mode only');
  }

  /**
   * Add a service entry (demo - simulates success)
   */
  static async addManualServiceHistory(data) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return { id: Date.now(), ...data };
    }
    throw new Error('Demo mode only');
  }

  /**
   * Update a service entry (demo - simulates success)
   */
  static async updateManualServiceHistory(id, data) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return { id, ...data };
    }
    throw new Error('Demo mode only');
  }

  /**
   * Delete a service entry (demo - simulates success)
   */
  static async deleteManualServiceHistory(id) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return;
    }
    throw new Error('Demo mode only');
  }

  /**
   * Delete any service (demo - simulates success)
   */
  static async deleteService(serviceId) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return;
    }
    throw new Error('Demo mode only');
  }

  /**
   * Get filtered service history with pagination
   */
  static async getFilteredServiceHistory(filter) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const allHistory = [];
      for (const deviceId of Object.keys(mockServiceHistory)) {
        allHistory.push(...mockServiceHistory[deviceId]);
      }
      return { content: allHistory, totalElements: allHistory.length };
    }
    throw new Error('Demo mode only');
  }

  /**
   * Get service history statistics for a device
   */
  static async getServiceHistoryStats(deviceId) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const history = mockServiceHistory[deviceId] || [];
      return {
        totalServices: history.length,
        lastServiceDate: history[0]?.serviceDate || null,
        totalRevenue: history.reduce((sum, h) => sum + (h.price || 0), 0),
      };
    }
    throw new Error('Demo mode only');
  }

  /**
   * Search service history by keywords
   */
  static async searchServiceHistory(keyword) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const allHistory = [];
      for (const deviceId of Object.keys(mockServiceHistory)) {
        allHistory.push(...mockServiceHistory[deviceId]);
      }
      if (!keyword) return allHistory;
      return allHistory.filter(h =>
        h.notes?.toLowerCase().includes(keyword.toLowerCase()) ||
        h.serviceType?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    throw new Error('Demo mode only');
  }

  /**
   * Bulk add service entries (demo - simulates success)
   */
  static async bulkAddManualServiceHistory(entries) {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return entries.map((entry, index) => ({ id: Date.now() + index, ...entry }));
    }
    throw new Error('Demo mode only');
  }
}

export default ServiceHistoryAPI;