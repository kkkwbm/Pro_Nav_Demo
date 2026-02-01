import { DEMO_MODE, simulateDelay, generateClientId, generateDeviceId } from '../../demo/demoMode';
import { mockCustomClients } from '../../demo/mockData';
import logger from '../../utils/logger';

// Demo state for custom clients
let demoCustomClients = DEMO_MODE ? JSON.parse(JSON.stringify(mockCustomClients)) : [];

export const customClientsApi = {
  // Get all custom clients
  getAll: async (withDevices = true) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      logger.debug('[CustomClients API] Demo: Returning mock custom clients');
      return demoCustomClients;
    }

    throw new Error('Demo mode only');
  },

  // Get custom client by ID
  getById: async (id, withDevices = true) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const client = demoCustomClients.find(c => c.id === id);
      return client || null;
    }
    throw new Error('Demo mode only');
  },

  // Get uncontacted custom clients
  getUncontacted: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return demoCustomClients.filter(c => !c.contacted);
    }
    throw new Error('Demo mode only');
  },

  // Get custom client stats
  getStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return {
        total: demoCustomClients.length,
        uncontacted: demoCustomClients.filter(c => !c.contacted).length,
        contacted: demoCustomClients.filter(c => c.contacted).length,
      };
    }
    throw new Error('Demo mode only');
  },

  // Create new custom client
  create: async (clientData) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const newClient = {
        id: generateClientId(),
        ...clientData,
        createdAt: new Date().toISOString(),
        contacted: false,
      };
      demoCustomClients.push(newClient);
      return newClient;
    }
    throw new Error('Demo mode only');
  },

  // Update custom client
  update: async (id, clientData) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const index = demoCustomClients.findIndex(c => c.id === id);
      if (index !== -1) {
        demoCustomClients[index] = { ...demoCustomClients[index], ...clientData };
        return demoCustomClients[index];
      }
      throw new Error('Client not found');
    }
    throw new Error('Demo mode only');
  },

  // Mark custom client as contacted
  markAsContacted: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const index = demoCustomClients.findIndex(c => c.id === id);
      if (index !== -1) {
        demoCustomClients[index].contacted = true;
        demoCustomClients[index].contactedAt = new Date().toISOString();
        return demoCustomClients[index];
      }
      throw new Error('Client not found');
    }
    throw new Error('Demo mode only');
  },

  // Delete custom client
  delete: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const index = demoCustomClients.findIndex(c => c.id === id);
      if (index !== -1) {
        demoCustomClients.splice(index, 1);
        return { success: true };
      }
      throw new Error('Client not found');
    }
    throw new Error('Demo mode only');
  },

  // Add device to custom client
  addDevice: async (clientId, deviceData) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const client = demoCustomClients.find(c => c.id === clientId);
      if (client) {
        const newDevice = {
          id: generateDeviceId(),
          ...deviceData,
        };
        client.devices = client.devices || [];
        client.devices.push(newDevice);
        return newDevice;
      }
      throw new Error('Client not found');
    }
    throw new Error('Demo mode only');
  },

  // Update custom device
  updateDevice: async (deviceId, deviceData) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      for (const client of demoCustomClients) {
        if (client.devices) {
          const deviceIndex = client.devices.findIndex(d => d.id === deviceId);
          if (deviceIndex !== -1) {
            client.devices[deviceIndex] = { ...client.devices[deviceIndex], ...deviceData };
            return client.devices[deviceIndex];
          }
        }
      }
      throw new Error('Device not found');
    }
    throw new Error('Demo mode only');
  },

  // Delete custom device
  deleteDevice: async (deviceId) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      for (const client of demoCustomClients) {
        if (client.devices) {
          const deviceIndex = client.devices.findIndex(d => d.id === deviceId);
          if (deviceIndex !== -1) {
            client.devices.splice(deviceIndex, 1);
            return { success: true };
          }
        }
      }
      throw new Error('Device not found');
    }
    throw new Error('Demo mode only');
  },

  // Convert custom client to regular client
  convertToClient: async (id, clientData) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      const index = demoCustomClients.findIndex(c => c.id === id);
      if (index !== -1) {
        // Remove from custom clients
        const [converted] = demoCustomClients.splice(index, 1);
        // Return converted data (in real app, this would be a new regular client)
        return { ...converted, ...clientData, convertedAt: new Date().toISOString() };
      }
      throw new Error('Client not found');
    }
    throw new Error('Demo mode only');
  }
};

export default customClientsApi;
