import { useState, useEffect, useCallback } from 'react';
import { DEMO_MODE, simulateDelay } from '../demo/demoMode';
import { mockServiceHistory } from '../demo/mockData';

export const useServiceHistory = (deviceId, onDeviceUpdate) => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch service history for a device
  const fetchServiceHistory = useCallback(async (devId) => {
    if (!devId) return;

    setLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        // Get mock history for this device
        const history = mockServiceHistory[devId] || [];
        setServiceHistory(history);
        return;
      }

      setError('Demo mode only');
      setServiceHistory([]);
    } catch (err) {
      console.error('Error fetching service history:', err);
      setError(err.message || 'Nie udało się załadować historii serwisów');
      setServiceHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch service history statistics
  const fetchStats = useCallback(async (devId) => {
    if (!devId) return;

    if (DEMO_MODE) {
      const history = mockServiceHistory[devId] || [];
      const statsData = {
        totalServices: history.length,
        lastServiceDate: history[0]?.serviceDate || null,
        totalCost: history.reduce((sum, h) => sum + (h.price || 0), 0),
      };
      setStats(statsData);
      return;
    }
  }, []);

  // Add service entry
  const addManualEntry = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        const newEntry = {
          id: Date.now(),
          deviceId: deviceId,
          serviceDate: new Date().toISOString().split('T')[0],
          serviceType: data.serviceType || 'Przegląd okresowy',
          notes: data.notes || '',
          price: data.price || 0,
          technician: 'Demo Technik',
        };

        setServiceHistory(prev => [newEntry, ...prev]);

        if (onDeviceUpdate && typeof onDeviceUpdate === 'function') {
          try {
            await onDeviceUpdate(deviceId);
          } catch (updateError) {
            console.warn('Device update callback failed:', updateError);
          }
        }

        return newEntry;
      }

      throw new Error('Demo mode only');
    } catch (err) {
      console.error('Error adding service entry:', err);
      setError(err.message || 'Nie udało się dodać wpisu serwisowego');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deviceId, onDeviceUpdate]);

  // Update service entry
  const updateManualEntry = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setServiceHistory(prev => prev.map(entry =>
          entry.id === id ? { ...entry, ...data } : entry
        ));

        return { id, ...data };
      }

      throw new Error('Demo mode only');
    } catch (err) {
      console.error('Error updating service entry:', err);
      setError(err.message || 'Nie udało się zaktualizować wpisu serwisowego');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete service entry
  const deleteManualEntry = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setServiceHistory(prev => prev.filter(entry => entry.id !== id));
        return;
      }

      throw new Error('Demo mode only');
    } catch (err) {
      console.error('Error deleting service entry:', err);
      setError(err.message || 'Nie udało się usunąć wpisu serwisowego');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete any service
  const deleteService = useCallback(async (serviceId, isManualEntry = false) => {
    setLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(300);

        setServiceHistory(prev => prev.filter(entry => entry.id !== serviceId));
        return;
      }

      throw new Error('Demo mode only');
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.message || 'Nie udało się usunąć serwisu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get filtered service history
  const getFilteredHistory = useCallback(async (filter) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return serviceHistory;
    }
    return [];
  }, [serviceHistory]);

  // Search service history
  const searchHistory = useCallback(async (keyword) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      if (!keyword) return serviceHistory;
      return serviceHistory.filter(entry =>
        entry.notes?.toLowerCase().includes(keyword.toLowerCase()) ||
        entry.serviceType?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    return [];
  }, [serviceHistory]);

  // Refresh data
  const refresh = useCallback(() => {
    if (deviceId) {
      fetchServiceHistory(deviceId);
      fetchStats(deviceId);
    }
  }, [deviceId, fetchServiceHistory, fetchStats]);

  // Load initial data when deviceId changes
  useEffect(() => {
    if (deviceId) {
      fetchServiceHistory(deviceId);
      fetchStats(deviceId);
    }
  }, [deviceId]);

  return {
    serviceHistory,
    stats,
    loading,
    error,
    actions: {
      fetchServiceHistory,
      addManualEntry,
      updateManualEntry,
      deleteManualEntry,
      deleteService,
      getFilteredHistory,
      searchHistory,
      refresh
    }
  };
};
