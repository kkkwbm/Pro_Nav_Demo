import { useState, useEffect, useCallback } from 'react';
import { DEMO_MODE, simulateDelay } from '../demo/demoMode';
import { mockPlannedSms as initialMockPlannedSms } from '../demo/mockData';
import { useNotification } from '../contexts/NotificationContext';

const PLANNED_SMS_STATUS = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const usePlannedSms = () => {
  const [plannedSms, setPlannedSms] = useState([]);
  const [mockPlannedSmsState, setMockPlannedSmsState] = useState(() =>
    JSON.parse(JSON.stringify(initialMockPlannedSms))
  );
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notification = useNotification();

  // Load all planned SMS with pagination
  const loadPlannedSms = useCallback(async (page = 0, size = 20, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (DEMO_MODE) {
        await simulateDelay(300);

        let filteredSms = [...mockPlannedSmsState];

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
          filteredSms = filteredSms.filter(sms => sms.status === filters.status);
        }

        // Format for table display
        const formattedSms = filteredSms.map(sms => ({
          ...sms,
          displayStatus: sms.status === 'PENDING' ? 'Oczekuje' :
                        sms.status === 'SENT' ? 'Wysłane' :
                        sms.status === 'CANCELLED' ? 'Anulowane' : sms.status,
        }));

        setPlannedSms(formattedSms);

        return {
          content: formattedSms,
          totalPages: 1,
          totalElements: formattedSms.length
        };
      }

      return { content: [], totalPages: 0, totalElements: 0 };

    } catch (err) {
      console.error('Error loading planned SMS:', err);
      setError('Nie udało się załadować zaplanowanych SMS');
      return { content: [], totalPages: 0, totalElements: 0 };
    } finally {
      setLoading(false);
    }
  }, [mockPlannedSmsState]);

  // Search planned SMS
  const searchPlannedSms = useCallback(async (searchTerm, page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);

      if (DEMO_MODE) {
        await simulateDelay(300);

        const filteredSms = mockPlannedSmsState.filter(sms =>
          sms.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sms.phoneNumber?.includes(searchTerm)
        );

        const formattedSms = filteredSms.map(sms => ({
          ...sms,
          displayStatus: sms.status === 'PENDING' ? 'Oczekuje' : sms.status,
        }));

        setPlannedSms(formattedSms);

        return {
          content: formattedSms,
          totalPages: 1,
          totalElements: formattedSms.length
        };
      }

      return { content: [], totalPages: 0, totalElements: 0 };

    } catch (err) {
      console.error('Error searching planned SMS:', err);
      setError('Nie udało się wyszukać SMS');
      return { content: [], totalPages: 0, totalElements: 0 };
    } finally {
      setLoading(false);
    }
  }, [mockPlannedSmsState]);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    if (DEMO_MODE) {
      const stats = {
        total: mockPlannedSmsState.length,
        pending: mockPlannedSmsState.filter(s => s.status === 'PENDING').length,
        sent: mockPlannedSmsState.filter(s => s.status === 'SENT').length,
        failed: mockPlannedSmsState.filter(s => s.status === 'FAILED').length,
        cancelled: mockPlannedSmsState.filter(s => s.status === 'CANCELLED').length,
        scheduledToday: 0,
        scheduledThisWeek: mockPlannedSmsState.filter(s => s.status === 'PENDING').length,
      };
      setStatistics(stats);
      return stats;
    }
    return null;
  }, [mockPlannedSmsState]);

  // Cancel planned SMS
  const cancelPlannedSms = useCallback(async (id, reason = 'Anulowane przez użytkownika') => {
    if (DEMO_MODE) {
      await simulateDelay(300);

      setMockPlannedSmsState(prev => prev.map(sms =>
        sms.id === id ? { ...sms, status: PLANNED_SMS_STATUS.CANCELLED } : sms
      ));

      setPlannedSms(prev => prev.map(sms =>
        sms.id === id
          ? { ...sms, status: PLANNED_SMS_STATUS.CANCELLED, displayStatus: 'Anulowane' }
          : sms
      ));

      notification?.showSuccess?.('SMS został anulowany (tryb demo)');
      loadStatistics();

      return true;
    }
    return false;
  }, [notification, loadStatistics]);

  // Delete planned SMS
  const deletePlannedSms = useCallback(async (id) => {
    if (DEMO_MODE) {
      await simulateDelay(300);

      setMockPlannedSmsState(prev => prev.filter(sms => sms.id !== id));
      setPlannedSms(prev => prev.filter(sms => sms.id !== id));

      notification?.showSuccess?.('SMS został usunięty (tryb demo)');
      loadStatistics();

      return true;
    }
    return false;
  }, [notification, loadStatistics]);

  // Process pending planned SMS
  const processPlannedSms = useCallback(async () => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      notification?.showSuccess?.('Przetwarzanie SMS zakończone (tryb demo)');
      return { success: true, message: 'Demo: Przetworzono SMS-y' };
    }
    return { success: false, message: 'Demo mode only' };
  }, [notification]);

  // Plan inspection reminders
  const planInspectionReminders = useCallback(async (daysAhead = 14) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      notification?.showSuccess?.('Zaplanowano przypomnienia (tryb demo)');
      return { count: 0 };
    }
    return null;
  }, [notification]);

  // Plan expiration notifications
  const planExpirationNotifications = useCallback(async () => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      notification?.showSuccess?.('Zaplanowano powiadomienia (tryb demo)');
      return { count: 0 };
    }
    return null;
  }, [notification]);

  // Cleanup old planned SMS
  const cleanupOldPlannedSms = useCallback(async (daysToKeep = 30) => {
    if (DEMO_MODE) {
      await simulateDelay(500);
      notification?.showSuccess?.('Wyczyszczono stare SMS-y (tryb demo)');
      return { deletedCount: 0 };
    }
    return null;
  }, [notification]);

  // Get planned SMS by client
  const getPlannedSmsByClient = useCallback(async (clientId, page = 0, size = 20) => {
    if (DEMO_MODE) {
      const filtered = mockPlannedSmsState.filter(sms => sms.clientId === clientId);
      return {
        content: filtered,
        totalPages: 1,
        totalElements: filtered.length
      };
    }
    return { content: [], totalPages: 0, totalElements: 0 };
  }, [mockPlannedSmsState]);

  // Get planned SMS by device
  const getPlannedSmsByDevice = useCallback(async (deviceId, page = 0, size = 20) => {
    if (DEMO_MODE) {
      const filtered = mockPlannedSmsState.filter(sms => sms.deviceId === deviceId);
      return {
        content: filtered,
        totalPages: 1,
        totalElements: filtered.length
      };
    }
    return { content: [], totalPages: 0, totalElements: 0 };
  }, [mockPlannedSmsState]);

  // Get daily statistics
  const getDailyStatistics = useCallback(async (startDate, endDate) => {
    if (DEMO_MODE) {
      return [];
    }
    return [];
  }, []);

  // Initial load
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    // State
    plannedSms,
    statistics,
    loading,
    error,

    // Methods
    loadPlannedSms,
    searchPlannedSms,
    loadStatistics,
    cancelPlannedSms,
    deletePlannedSms,
    processPlannedSms,
    planInspectionReminders,
    planExpirationNotifications,
    cleanupOldPlannedSms,
    getPlannedSmsByClient,
    getPlannedSmsByDevice,
    getDailyStatistics,

    // Utility
    refresh: () => Promise.all([loadPlannedSms(), loadStatistics()]),
  };
};
