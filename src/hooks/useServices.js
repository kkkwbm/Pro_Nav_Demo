import { useState, useEffect } from 'react';
import { DEMO_MODE, simulateDelay, generateServiceId } from '../demo/demoMode';
import { mockServices as initialMockServices } from '../demo/mockData';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store mock services in state for modifications
  const [mockServicesState, setMockServicesState] = useState(() =>
    JSON.parse(JSON.stringify(initialMockServices))
  );

  useEffect(() => {
    loadServices();
  }, [selectedDate, viewMode]);

  const getViewStartDate = () => {
    const date = new Date(selectedDate);
    if (viewMode === 'week') {
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - dayOfWeek + 1); // Monday
      return startOfWeek;
    } else {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
  };

  const getViewEndDate = () => {
    const date = new Date(selectedDate);
    if (viewMode === 'week') {
      const dayOfWeek = date.getDay();
      const endOfWeek = new Date(date);
      endOfWeek.setDate(date.getDate() - dayOfWeek + 7); // Sunday
      return endOfWeek;
    } else {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = getViewStartDate();
      const endDate = getViewEndDate();

      if (DEMO_MODE) {
        await simulateDelay(300);

        // Filter mock services by date range
        const filteredServices = mockServicesState.filter(service => {
          const serviceStart = new Date(service.start);
          return serviceStart >= startDate && serviceStart <= endDate;
        });

        setServices(filteredServices);
        return;
      }

      // Non-demo code would go here
      setError('Demo mode only');
      setServices([]);

    } catch (error) {
      console.error('Error loading services:', error);
      setError('Nie udało się załadować kalendarza serwisów');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        const newService = {
          id: generateServiceId(),
          googleEventId: `demo-event-${Date.now()}`,
          title: `Serwis: ${serviceData.clientName} - ${serviceData.deviceType}`,
          start: new Date(serviceData.startDateTime),
          end: new Date(serviceData.endDateTime),
          location: serviceData.address,
          description: serviceData.notes,
          status: 'SCHEDULED',
          clientId: serviceData.clientId,
          deviceId: serviceData.deviceId,
          clientName: serviceData.clientName,
          clientPhone: serviceData.phone,
          deviceName: serviceData.deviceName,
          deviceType: serviceData.deviceType,
          serviceType: serviceData.serviceType,
        };

        setMockServicesState(prev => [...prev, newService]);
        await loadServices();
        return;
      }

      throw new Error('Demo mode only');

    } catch (error) {
      console.error('Error creating service:', error);
      setError('Błąd podczas tworzenia serwisu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId, serviceData) => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setMockServicesState(prev => prev.map(service =>
          service.id === serviceId
            ? {
                ...service,
                start: new Date(serviceData.startDateTime),
                end: new Date(serviceData.endDateTime),
                description: serviceData.notes,
                serviceType: serviceData.serviceType,
              }
            : service
        ));

        await loadServices();
        return;
      }

      throw new Error('Demo mode only');

    } catch (error) {
      console.error('Error updating service:', error);
      setError('Błąd podczas aktualizacji serwisu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (service) => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setMockServicesState(prev => prev.filter(s => s.id !== service.id));
        await loadServices();
        return;
      }

      throw new Error('Demo mode only');

    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Błąd podczas usuwania serwisu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeService = async (serviceId, notes) => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setMockServicesState(prev => prev.map(service =>
          service.id === serviceId
            ? { ...service, status: 'COMPLETED' }
            : service
        ));

        await loadServices();
        return;
      }

      throw new Error('Demo mode only');

    } catch (error) {
      console.error('Error completing service:', error);
      setError('Błąd podczas zakończenia serwisu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelService = async (serviceId, reason) => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setMockServicesState(prev => prev.map(service =>
          service.id === serviceId
            ? { ...service, status: 'CANCELLED' }
            : service
        ));

        await loadServices();
        return;
      }

      throw new Error('Demo mode only');

    } catch (error) {
      console.error('Error cancelling service:', error);
      setError('Błąd podczas anulowania serwisu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTodayServices = async () => {
    if (DEMO_MODE) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return mockServicesState.filter(service => {
        const serviceStart = new Date(service.start);
        return serviceStart >= today && serviceStart < tomorrow;
      });
    }
    return [];
  };

  const getUpcomingServices = async (days = 7) => {
    if (DEMO_MODE) {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + days);

      return mockServicesState.filter(service => {
        const serviceStart = new Date(service.start);
        return serviceStart >= today && serviceStart <= futureDate;
      });
    }
    return [];
  };

  const getOverdueServices = async () => {
    if (DEMO_MODE) {
      const today = new Date();
      return mockServicesState.filter(service => {
        const serviceStart = new Date(service.start);
        return serviceStart < today && service.status !== 'COMPLETED' && service.status !== 'CANCELLED';
      });
    }
    return [];
  };

  return {
    services,
    selectedDate,
    viewMode,
    loading,
    error,
    setSelectedDate,
    setViewMode,
    createService,
    updateService,
    deleteService,
    completeService,
    cancelService,
    loadServices,
    refreshServices: loadServices,
    getTodayServices,
    getUpcomingServices,
    getOverdueServices,
  };
};