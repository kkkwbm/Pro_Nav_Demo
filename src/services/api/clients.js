import { DEMO_MODE, simulateDelay, generateClientId, generateDeviceId } from '../../demo/demoMode';
import { mockClients, mockDevices } from '../../demo/mockData';

// In-memory store for demo mode
let demoClients = [...mockClients];

// Clients API
export const clientsApi = {
  // Get all clients (with optional devices)
  getAll: async (withDevices = false) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return demoClients.map(client => ({
        ...client,
        devices: withDevices ? client.devices : undefined,
      }));
    }
    throw new Error('Demo mode only');
  },

  // Get client by ID
  getById: async (id, withDevices = false) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const client = demoClients.find(c => c.id === parseInt(id));
      if (!client) throw new Error('Klient nie znaleziony');
      return {
        ...client,
        devices: withDevices ? client.devices : undefined,
      };
    }
    throw new Error('Demo mode only');
  },

  // Create new client
  create: async (clientData) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const newClient = {
        id: generateClientId(),
        name: `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim(),
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        imie: clientData.firstName || '',
        nazwisko: clientData.lastName || '',
        phone: clientData.phone,
        telefon: clientData.phone,
        devices: [],
      };
      demoClients.push(newClient);
      return newClient;
    }
    throw new Error('Demo mode only');
  },

  // Create new client with their first device
  createWithDevice: async (clientData) => {
    if (DEMO_MODE) {
      await simulateDelay(400);
      const clientId = generateClientId();
      const deviceId = generateDeviceId();

      const newDevice = {
        id: deviceId,
        deviceId: deviceId,
        clientId: clientId,
        clientName: `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim(),
        address: `${clientData.ulica} ${clientData.nrDomu}${clientData.nrLokalu ? '/' + clientData.nrLokalu : ''}, ${clientData.kodPocztowy} ${clientData.miejscowosc}`,
        position: clientData.position || { lat: 52.2297, lng: 21.0118 },
        deviceType: clientData.deviceType,
        typUrzadzenia: clientData.deviceType,
        deviceName: clientData.deviceName || '',
        nazwaUrzadzenia: clientData.deviceName || '',
        installationDate: clientData.installationDate,
        nextInspectionDate: clientData.nextInspectionDate,
        notes: clientData.notes || '',
        serviceConfirmed: false,
        ulica: clientData.ulica,
        nrDomu: clientData.nrDomu,
        nrLokalu: clientData.nrLokalu,
        kodPocztowy: clientData.kodPocztowy,
        miejscowosc: clientData.miejscowosc,
        latitude: clientData.position?.lat || 52.2297,
        longitude: clientData.position?.lng || 21.0118,
      };

      const newClient = {
        id: clientId,
        name: `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim(),
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        imie: clientData.firstName || '',
        nazwisko: clientData.lastName || '',
        phone: clientData.phone,
        telefon: clientData.phone,
        devices: [newDevice],
      };

      demoClients.push(newClient);
      return newClient;
    }
    throw new Error('Demo mode only');
  },

  // Update client
  update: async (id, clientData) => {
    if (DEMO_MODE) {
      await simulateDelay(250);
      const index = demoClients.findIndex(c => c.id === parseInt(id));
      if (index === -1) throw new Error('Klient nie znaleziony');

      demoClients[index] = {
        ...demoClients[index],
        name: `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim(),
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        imie: clientData.firstName || '',
        nazwisko: clientData.lastName || '',
        phone: clientData.phone,
        telefon: clientData.phone,
      };
      return demoClients[index];
    }
    throw new Error('Demo mode only');
  },

  // Delete client
  delete: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const index = demoClients.findIndex(c => c.id === parseInt(id));
      if (index === -1) throw new Error('Klient nie znaleziony');
      demoClients.splice(index, 1);
      return { success: true };
    }
    throw new Error('Demo mode only');
  },

  // Search clients
  search: async (query) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const lowerQuery = query.toLowerCase();
      return demoClients.filter(client =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.phone.includes(query)
      );
    }
    throw new Error('Demo mode only');
  },

  // Check if phone exists
  checkPhone: async (phone) => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      const exists = demoClients.some(c => c.phone === phone || c.telefon === phone);
      return { exists };
    }
    throw new Error('Demo mode only');
  },

  // Get client stats
  getStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const totalDevices = demoClients.reduce((sum, c) => sum + (c.devices?.length || 0), 0);
      return {
        totalClients: demoClients.length,
        totalDevices: totalDevices,
        activeClients: demoClients.length,
      };
    }
    throw new Error('Demo mode only');
  },
};

// Devices API
export const devicesApi = {
  // Get all devices
  getAll: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockDevices;
    }
    throw new Error('Demo mode only');
  },

  // Get device by ID
  getById: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      for (const client of demoClients) {
        const device = client.devices?.find(d => d.id === parseInt(id));
        if (device) return device;
      }
      throw new Error('Urządzenie nie znalezione');
    }
    throw new Error('Demo mode only');
  },

  // Get devices by client ID
  getByClientId: async (clientId) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const client = demoClients.find(c => c.id === parseInt(clientId));
      return client?.devices || [];
    }
    throw new Error('Demo mode only');
  },

  // Create new device
  create: async (deviceData, clientId) => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const client = demoClients.find(c => c.id === parseInt(clientId));
      if (!client) throw new Error('Klient nie znaleziony');

      const deviceId = generateDeviceId();
      const newDevice = {
        id: deviceId,
        deviceId: deviceId,
        clientId: parseInt(clientId),
        clientName: client.name,
        address: `${deviceData.ulica} ${deviceData.nrDomu}${deviceData.nrLokalu ? '/' + deviceData.nrLokalu : ''}, ${deviceData.kodPocztowy} ${deviceData.miejscowosc}`,
        position: deviceData.position || { lat: 52.2297, lng: 21.0118 },
        deviceType: deviceData.deviceType,
        typUrzadzenia: deviceData.deviceType,
        deviceName: deviceData.deviceName || '',
        nazwaUrzadzenia: deviceData.deviceName || '',
        installationDate: deviceData.installationDate,
        nextInspectionDate: deviceData.nextInspectionDate,
        notes: deviceData.notes || '',
        serviceConfirmed: false,
        ulica: deviceData.ulica,
        nrDomu: deviceData.nrDomu,
        nrLokalu: deviceData.nrLokalu,
        kodPocztowy: deviceData.kodPocztowy,
        miejscowosc: deviceData.miejscowosc,
        latitude: deviceData.position?.lat || 52.2297,
        longitude: deviceData.position?.lng || 21.0118,
      };

      client.devices = client.devices || [];
      client.devices.push(newDevice);
      return newDevice;
    }
    throw new Error('Demo mode only');
  },

  // Update device
  update: async (id, deviceData, clientId) => {
    if (DEMO_MODE) {
      await simulateDelay(250);
      const client = demoClients.find(c => c.id === parseInt(clientId));
      if (!client) throw new Error('Klient nie znaleziony');

      const deviceIndex = client.devices?.findIndex(d => d.id === parseInt(id));
      if (deviceIndex === -1 || deviceIndex === undefined) throw new Error('Urządzenie nie znalezione');

      client.devices[deviceIndex] = {
        ...client.devices[deviceIndex],
        address: `${deviceData.ulica} ${deviceData.nrDomu}${deviceData.nrLokalu ? '/' + deviceData.nrLokalu : ''}, ${deviceData.kodPocztowy} ${deviceData.miejscowosc}`,
        position: deviceData.position || client.devices[deviceIndex].position,
        deviceType: deviceData.deviceType,
        typUrzadzenia: deviceData.deviceType,
        deviceName: deviceData.deviceName || '',
        nazwaUrzadzenia: deviceData.deviceName || '',
        installationDate: deviceData.installationDate,
        nextInspectionDate: deviceData.nextInspectionDate,
        notes: deviceData.notes || '',
        ulica: deviceData.ulica,
        nrDomu: deviceData.nrDomu,
        nrLokalu: deviceData.nrLokalu,
        kodPocztowy: deviceData.kodPocztowy,
        miejscowosc: deviceData.miejscowosc,
        latitude: deviceData.position?.lat || client.devices[deviceIndex].latitude,
        longitude: deviceData.position?.lng || client.devices[deviceIndex].longitude,
      };

      return client.devices[deviceIndex];
    }
    throw new Error('Demo mode only');
  },

  // Update only inspection date
  updateInspectionDate: async (id, newDate) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      for (const client of demoClients) {
        const device = client.devices?.find(d => d.id === parseInt(id));
        if (device) {
          device.nextInspectionDate = newDate;
          return device;
        }
      }
      throw new Error('Urządzenie nie znalezione');
    }
    throw new Error('Demo mode only');
  },

  // Delete device
  delete: async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      for (const client of demoClients) {
        const deviceIndex = client.devices?.findIndex(d => d.id === parseInt(id));
        if (deviceIndex !== -1 && deviceIndex !== undefined) {
          client.devices.splice(deviceIndex, 1);
          return { success: true };
        }
      }
      throw new Error('Urządzenie nie znalezione');
    }
    throw new Error('Demo mode only');
  },

  // Get upcoming inspections
  getUpcomingInspections: async (days = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + days);

      const allDevices = demoClients.flatMap(c => c.devices || []);
      return allDevices.filter(device => {
        const inspectionDate = new Date(device.nextInspectionDate);
        return inspectionDate >= today && inspectionDate <= futureDate;
      });
    }
    throw new Error('Demo mode only');
  },

  // Get overdue inspections
  getOverdueInspections: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const today = new Date();
      const allDevices = demoClients.flatMap(c => c.devices || []);
      return allDevices.filter(device => {
        const inspectionDate = new Date(device.nextInspectionDate);
        return inspectionDate < today;
      });
    }
    throw new Error('Demo mode only');
  },

  // Search devices by name
  searchByName: async (query) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const lowerQuery = query.toLowerCase();
      const allDevices = demoClients.flatMap(c => c.devices || []);
      return allDevices.filter(device =>
        device.deviceName?.toLowerCase().includes(lowerQuery) ||
        device.nazwaUrzadzenia?.toLowerCase().includes(lowerQuery)
      );
    }
    throw new Error('Demo mode only');
  },

  // Get devices by city
  getByCity: async (city) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const lowerCity = city.toLowerCase();
      const allDevices = demoClients.flatMap(c => c.devices || []);
      return allDevices.filter(device =>
        device.miejscowosc?.toLowerCase().includes(lowerCity)
      );
    }
    throw new Error('Demo mode only');
  },

  // Get nearby devices
  getNearby: async (lat, lon, radius = 10) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      // Simplified distance calculation for demo
      const allDevices = demoClients.flatMap(c => c.devices || []);
      return allDevices.filter(device => {
        const distance = Math.sqrt(
          Math.pow(device.latitude - lat, 2) +
          Math.pow(device.longitude - lon, 2)
        ) * 111; // Approximate km per degree
        return distance <= radius;
      });
    }
    throw new Error('Demo mode only');
  },

  // Get device stats
  getStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const allDevices = demoClients.flatMap(c => c.devices || []);
      const today = new Date();

      const byType = {};
      allDevices.forEach(device => {
        const type = device.deviceType || device.typUrzadzenia || 'Inne';
        byType[type] = (byType[type] || 0) + 1;
      });

      return {
        totalDevices: allDevices.length,
        devicesByType: byType,
        overdueCount: allDevices.filter(d => new Date(d.nextInspectionDate) < today).length,
        upcomingCount: allDevices.filter(d => {
          const date = new Date(d.nextInspectionDate);
          const futureDate = new Date(today);
          futureDate.setDate(futureDate.getDate() + 14);
          return date >= today && date <= futureDate;
        }).length,
      };
    }
    throw new Error('Demo mode only');
  },
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard stats
  getStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const allDevices = demoClients.flatMap(c => c.devices || []);
      const today = new Date();

      return {
        totalClients: demoClients.length,
        totalDevices: allDevices.length,
        overdueInspections: allDevices.filter(d => new Date(d.nextInspectionDate) < today).length,
        upcomingInspections: allDevices.filter(d => {
          const date = new Date(d.nextInspectionDate);
          const futureDate = new Date(today);
          futureDate.setDate(futureDate.getDate() + 14);
          return date >= today && date <= futureDate;
        }).length,
      };
    }
    throw new Error('Demo mode only');
  },

  // Get inspection alerts
  getInspectionAlerts: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const allDevices = demoClients.flatMap(c => c.devices || []);
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);

      return allDevices
        .filter(d => {
          const date = new Date(d.nextInspectionDate);
          return date <= futureDate;
        })
        .sort((a, b) => new Date(a.nextInspectionDate) - new Date(b.nextInspectionDate))
        .slice(0, 10);
    }
    throw new Error('Demo mode only');
  },

  // Get recent activity
  getRecentActivity: async () => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      return [
        { type: 'sms', message: 'SMS wysłany do Jan Kowalski', timestamp: new Date().toISOString() },
        { type: 'service', message: 'Serwis zaplanowany dla Anna Nowak', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { type: 'client', message: 'Nowy klient: Piotr Wiśniewski', timestamp: new Date(Date.now() - 7200000).toISOString() },
      ];
    }
    throw new Error('Demo mode only');
  },

  // Get inspections calendar
  getInspectionsCalendar: async (year = new Date().getFullYear()) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const allDevices = demoClients.flatMap(c => c.devices || []);
      const calendar = {};

      allDevices.forEach(device => {
        const date = new Date(device.nextInspectionDate);
        if (date.getFullYear() === year) {
          const month = date.getMonth();
          calendar[month] = (calendar[month] || 0) + 1;
        }
      });

      return calendar;
    }
    throw new Error('Demo mode only');
  },
};

// Data mappers to convert between backend and frontend formats
export const dataMappers = {
  // Map client from backend to frontend format
  clientFromBackend: (backendClient) => {
    return {
      id: backendClient.id,
      name: `${backendClient.imie} ${backendClient.nazwisko}`,
      firstName: backendClient.imie,
      lastName: backendClient.nazwisko,
      phone: backendClient.telefon,
      devices: backendClient.devices?.map(dataMappers.deviceFromBackend) || [],
    };
  },

  // Map device from backend to frontend format
  deviceFromBackend: (backendDevice) => {
    const address = backendDevice.nrLokalu
      ? `${backendDevice.ulica} ${backendDevice.nrDomu}/${backendDevice.nrLokalu}, ${backendDevice.kodPocztowy} ${backendDevice.miejscowosc}`
      : `${backendDevice.ulica} ${backendDevice.nrDomu}, ${backendDevice.kodPocztowy} ${backendDevice.miejscowosc}`;

    // Map backend device type enum to frontend display string
    const mapDeviceTypeToFrontend = (backendType) => {
      const mapping = {
        'POMPA_CIEPLA': 'Pompa ciepła',
        'KOCIOL_GAZOWY': 'Kocioł gazowy',
        'KOCIOL_OLEJOWY': 'Kocioł olejowy',
        'KLIMATYZATOR': 'Klimatyzator'
      };
      return mapping[backendType] || backendType;
    };

    return {
      id: backendDevice.id,
      address: address,
      position: {
        lat: parseFloat(backendDevice.latitude),
        lng: parseFloat(backendDevice.longitude),
      },
      deviceType: mapDeviceTypeToFrontend(backendDevice.typUrzadzenia),
      deviceName: backendDevice.nazwaUrzadzenia,
      installationDate: backendDevice.dataInstalacji,
      nextInspectionDate: backendDevice.terminPrzegladu,
      notes: backendDevice.notatka || '',
      serviceConfirmed: backendDevice.serviceConfirmed || false,
      serviceConfirmationValid: backendDevice.serviceConfirmationValid || false,
      lastConfirmationToken: backendDevice.lastConfirmationToken || null,
      serviceConfirmedAt: backendDevice.serviceConfirmedAt || null,
      confirmationStatus: backendDevice.serviceConfirmed
        ? `Potwierdzone ${backendDevice.serviceConfirmedAt ? new Date(backendDevice.serviceConfirmedAt).toLocaleDateString('pl-PL') : ''}`
        : 'Nie potwierdzone',
      lastSMS: null,
      clientId: backendDevice.clientId,
      clientName: backendDevice.clientName,
      // Include raw address fields needed for updates
      ulica: backendDevice.ulica,
      nrDomu: backendDevice.nrDomu,
      nrLokalu: backendDevice.nrLokalu,
      kodPocztowy: backendDevice.kodPocztowy,
      miejscowosc: backendDevice.miejscowosc,
      latitude: parseFloat(backendDevice.latitude),
      longitude: parseFloat(backendDevice.longitude),
    };
  },
};
