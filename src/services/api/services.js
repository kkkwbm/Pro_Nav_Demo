import axiosInstance from '../../config/axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { DEMO_MODE, simulateDelay, generateServiceId } from '../../demo/demoMode';
import { mockClients, mockServices } from '../../demo/mockData';

// Local storage for demo services (allows CRUD operations in demo mode)
let demoServices = [...mockServices];

// Helper to find device by ID from mockClients
const findDeviceById = (deviceId) => {
  for (const client of mockClients) {
    const device = client.devices?.find(d => d.id === deviceId || d.deviceId === deviceId);
    if (device) return device;
  }
  return null;
};

// Transform mock service for calendar display
const transformServiceForCalendar = (service) => {
  // Get device data for address fields
  const device = findDeviceById(service.deviceId);

  return {
    id: service.id,
    googleEventId: service.googleEventId,
    clientId: service.clientId,
    deviceId: service.deviceId,
    clientName: service.clientName,
    clientPhone: service.clientPhone,
    deviceName: service.deviceName,
    deviceType: service.deviceType,
    serviceType: service.serviceType,
    startDateTime: service.start instanceof Date ? service.start.toISOString() : service.start,
    endDateTime: service.end instanceof Date ? service.end.toISOString() : service.end,
    location: service.location,
    description: service.description,
    status: service.status,
    title: service.title,
    // Address fields for ServiceCard
    street: service.street || device?.ulica || '',
    houseNumber: service.houseNumber || device?.nrDomu || '',
    apartmentNumber: service.apartmentNumber || device?.nrLokalu || '',
    postalCode: service.postalCode || device?.kodPocztowy || '',
    city: service.city || device?.miejscowosc || '',
  };
};

class ServicesAPI {
  static async getServicesForDateRange(startDate, endDate) {
    if (DEMO_MODE) {
      await simulateDelay();
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filteredServices = demoServices.filter(service => {
        const serviceDate = service.start instanceof Date ? service.start : new Date(service.start);
        return serviceDate >= start && serviceDate <= end;
      });

      return filteredServices.map(transformServiceForCalendar);
    }

    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_BY_DATE_RANGE, {
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });

    return response.data;
  }

  static async createService(data) {
    if (DEMO_MODE) {
      await simulateDelay();
      const client = mockClients.find(c => c.id === data.clientId);
      const device = client?.devices?.find(d => d.id === data.deviceId);

      const newService = {
        id: generateServiceId(),
        googleEventId: `demo-event-${Date.now()}`,
        clientId: data.clientId,
        deviceId: data.deviceId,
        clientName: client?.name || 'Unknown',
        clientPhone: client?.phone || '',
        deviceName: device?.deviceName || data.deviceName || '',
        deviceType: device?.deviceType || data.deviceType || '',
        serviceType: data.serviceType || 'Przegląd okresowy',
        start: new Date(data.startDateTime),
        end: new Date(data.endDateTime),
        location: device?.address || data.location || '',
        description: data.description || '',
        status: 'SCHEDULED',
        title: `Serwis: ${client?.name || 'Unknown'} - ${device?.deviceType || ''}`,
        // Address fields
        street: device?.ulica || '',
        houseNumber: device?.nrDomu || '',
        apartmentNumber: device?.nrLokalu || '',
        postalCode: device?.kodPocztowy || '',
        city: device?.miejscowosc || '',
      };

      demoServices.push(newService);
      return transformServiceForCalendar(newService);
    }

    const requestData = {
      ...data,
      createGoogleEvent: true
    };

    const response = await axiosInstance.post(API_ENDPOINTS.SERVICES.CREATE, requestData);

    return response.data;
  }

  static async updateService(id, data) {
    if (DEMO_MODE) {
      await simulateDelay();
      const index = demoServices.findIndex(s => s.id === id);
      if (index !== -1) {
        const client = mockClients.find(c => c.id === data.clientId);
        const device = client?.devices?.find(d => d.id === data.deviceId);

        demoServices[index] = {
          ...demoServices[index],
          ...data,
          start: new Date(data.startDateTime),
          end: new Date(data.endDateTime),
          clientName: client?.name || demoServices[index].clientName,
          deviceName: device?.deviceName || demoServices[index].deviceName,
          deviceType: device?.deviceType || demoServices[index].deviceType,
        };
        return transformServiceForCalendar(demoServices[index]);
      }
      throw new Error('Service not found');
    }

    const response = await axiosInstance.put(API_ENDPOINTS.SERVICES.UPDATE(id), data);

    return response.data;
  }

  static async deleteService(id) {
    if (DEMO_MODE) {
      await simulateDelay();
      demoServices = demoServices.filter(s => s.id !== id);
      return;
    }

    await axiosInstance.delete(API_ENDPOINTS.SERVICES.DELETE(id));
  }

  static async getClients() {
    if (DEMO_MODE) {
      await simulateDelay();
      return mockClients;
    }

    const response = await axiosInstance.get(API_ENDPOINTS.CLIENTS.LIST, {
      params: { withDevices: true }
    });

    return response.data;
  }

  static async searchClients(query) {
    if (!query || query.trim().length < 2) {
      return this.getClients();
    }

    if (DEMO_MODE) {
      await simulateDelay();
      const lowerQuery = query.toLowerCase();
      return mockClients.filter(client =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.phone.includes(query)
      );
    }

    const response = await axiosInstance.get(API_ENDPOINTS.CLIENTS.SEARCH, {
      params: { q: query.trim() }
    });

    const searchResults = response.data;

    const clientsWithDevices = await Promise.all(
      searchResults.map(async (client) => {
        try {
          const fullClientResponse = await axiosInstance.get(API_ENDPOINTS.CLIENTS.GET(client.id), {
            params: { withDevices: true }
          });
          return fullClientResponse.data;
        } catch (err) {
          console.warn(`Failed to fetch full details for client ${client.id}:`, err);
          return client;
        }
      })
    );

    return clientsWithDevices;
  }

  static async getServicesByStatus(status) {
    if (DEMO_MODE) {
      await simulateDelay();
      return demoServices.filter(s => s.status === status).map(transformServiceForCalendar);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_BY_STATUS(status));
    return response.data;
  }

  static async getTodayServices() {
    if (DEMO_MODE) {
      await simulateDelay();
      const today = new Date();
      return demoServices.filter(s => {
        const serviceDate = s.start instanceof Date ? s.start : new Date(s.start);
        return serviceDate.toDateString() === today.toDateString();
      }).map(transformServiceForCalendar);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_TODAY);
    return response.data;
  }

  static async getUpcomingServices() {
    if (DEMO_MODE) {
      await simulateDelay();
      const today = new Date();
      return demoServices.filter(s => {
        const serviceDate = s.start instanceof Date ? s.start : new Date(s.start);
        return serviceDate > today;
      }).map(transformServiceForCalendar);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_UPCOMING);
    return response.data;
  }

  static async getOverdueServices() {
    if (DEMO_MODE) {
      await simulateDelay();
      const today = new Date();
      return demoServices.filter(s => {
        const serviceDate = s.start instanceof Date ? s.start : new Date(s.start);
        return serviceDate < today && s.status !== 'COMPLETED';
      }).map(transformServiceForCalendar);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_OVERDUE);
    return response.data;
  }

  static async getServicesByClient(clientId) {
    if (DEMO_MODE) {
      await simulateDelay();
      return demoServices.filter(s => s.clientId === clientId).map(transformServiceForCalendar);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_BY_CLIENT(clientId));
    return response.data;
  }

  static async getServicesByDevice(deviceId) {
    if (DEMO_MODE) {
      await simulateDelay();
      return demoServices.filter(s => s.deviceId === deviceId).map(transformServiceForCalendar);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST_BY_DEVICE(deviceId));
    return response.data;
  }

  static async completeService(id) {
    if (DEMO_MODE) {
      await simulateDelay();
      const index = demoServices.findIndex(s => s.id === id);
      if (index !== -1) {
        demoServices[index].status = 'COMPLETED';
        return transformServiceForCalendar(demoServices[index]);
      }
      throw new Error('Service not found');
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SERVICES.COMPLETE(id));
    return response.data;
  }

  static async cancelService(id) {
    if (DEMO_MODE) {
      await simulateDelay();
      const index = demoServices.findIndex(s => s.id === id);
      if (index !== -1) {
        demoServices[index].status = 'CANCELLED';
        return transformServiceForCalendar(demoServices[index]);
      }
      throw new Error('Service not found');
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SERVICES.CANCEL(id));
    return response.data;
  }

  static async getServiceStats() {
    if (DEMO_MODE) {
      await simulateDelay();
      const today = new Date();
      return {
        total: demoServices.length,
        scheduled: demoServices.filter(s => s.status === 'SCHEDULED').length,
        completed: demoServices.filter(s => s.status === 'COMPLETED').length,
        cancelled: demoServices.filter(s => s.status === 'CANCELLED').length,
        today: demoServices.filter(s => {
          const serviceDate = s.start instanceof Date ? s.start : new Date(s.start);
          return serviceDate.toDateString() === today.toDateString();
        }).length,
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.STATS);
    return response.data;
  }

  static async getNextServiceForDevice(deviceId) {
    if (DEMO_MODE) {
      await simulateDelay();
      const today = new Date();
      const futureServices = demoServices.filter(s => {
        const serviceDate = s.start instanceof Date ? s.start : new Date(s.start);
        return s.deviceId === deviceId && serviceDate > today;
      }).sort((a, b) => new Date(a.start) - new Date(b.start));
      return futureServices.length > 0 ? transformServiceForCalendar(futureServices[0]) : null;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.GET_NEXT_FOR_DEVICE(deviceId));
    return response.data;
  }

  static async getLastServiceForDevice(deviceId) {
    if (DEMO_MODE) {
      await simulateDelay();
      const today = new Date();
      const pastServices = demoServices.filter(s => {
        const serviceDate = s.start instanceof Date ? s.start : new Date(s.start);
        return s.deviceId === deviceId && serviceDate <= today;
      }).sort((a, b) => new Date(b.start) - new Date(a.start));
      return pastServices.length > 0 ? transformServiceForCalendar(pastServices[0]) : null;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.GET_LAST_FOR_DEVICE(deviceId));
    return response.data;
  }
}

export default ServicesAPI;