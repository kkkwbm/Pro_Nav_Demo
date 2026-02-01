import { useMemo } from 'react';
import { getInspectionPeriod } from '@/services/utils/clientUtils';

/**
 * Custom hook for filtering and sorting clients
 */
export const useClientsFilters = (clients, filters) => {
  const {
    searchQuery,
    deviceTypeFilter,
    inspectionFilter,
    confirmationFilter,
    sortOption
  } = filters;

  // Helper function to get urgency score for a client
  const getClientUrgencyScore = (client) => {
    let mostUrgentScore = Infinity;

    if (!client.devices || !Array.isArray(client.devices)) {
      return mostUrgentScore;
    }

    client.devices.forEach(device => {
      const diffDays = (new Date(device.nextInspectionDate) - new Date()) / (1000 * 60 * 60 * 24);
      mostUrgentScore = Math.min(mostUrgentScore, diffDays < 0 ? diffDays : diffDays);
    });

    return mostUrgentScore;
  };

  const filteredAndSortedClients = useMemo(() => {
    if (!Array.isArray(clients)) {
      console.warn('[useClientsFilters] Clients is not an array:', clients);
      return [];
    }

    // First, filter the clients
    const filtered = clients.filter(client => {
      if (!client) return false;

      const search = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || (
        // Client data - always check these regardless of devices
        (client.id && client.id.toString().includes(search)) ||
        (client.name || '').toLowerCase().includes(search) ||
        (client.firstName || '').toLowerCase().includes(search) ||
        (client.lastName || '').toLowerCase().includes(search) ||
        (client.phone || '').toLowerCase().includes(search) ||

        // Device data - only check if devices exist
        ((client.devices && client.devices.length > 0) && (client.devices || []).some(device =>
          // Basic device info
          (device.address || '').toLowerCase().includes(search) ||
          (device.deviceName || '').toLowerCase().includes(search) ||
          (device.deviceType || '').toLowerCase().includes(search) ||
          (device.notes || '').toLowerCase().includes(search) ||

          // Dates (search by year, month, or full date)
          (device.installationDate || '').includes(search) ||
          (device.nextInspectionDate || '').includes(search) ||

          // Address components
          (device.ulica || '').toLowerCase().includes(search) ||
          (device.nrDomu || '').toLowerCase().includes(search) ||
          (device.nrLokalu || '').toLowerCase().includes(search) ||
          (device.kodPocztowy || '').toLowerCase().includes(search) ||
          (device.miejscowosc || '').toLowerCase().includes(search) ||

          // Service confirmation status
          (device.serviceConfirmed ? 'potwierdzony serwis' : 'niepotwierdzony serwis').includes(search) ||

          // Formatted dates for more natural search
          (device.installationDate && new Date(device.installationDate).toLocaleDateString('pl-PL').includes(search)) ||
          (device.nextInspectionDate && new Date(device.nextInspectionDate).toLocaleDateString('pl-PL').includes(search))
        )) ||

        // Special search terms for clients without devices
        ((!client.devices || client.devices.length === 0) &&
         ('brak urządzeń'.includes(search) || 'bez urządzeń'.includes(search) || 'nowe'.includes(search))
        )
      );

      // Filter by device type and inspection period
      const hasMatchingDevice = (client.devices || []).some(device => {
        const matchesDeviceType = deviceTypeFilter === 'all' || device.deviceType === deviceTypeFilter;

        let matchesInspection = true;
        if (inspectionFilter !== 'all') {
          const period = getInspectionPeriod(device.nextInspectionDate);
          const diffDays = (new Date(device.nextInspectionDate) - new Date()) / (1000 * 60 * 60 * 24);

          switch (inspectionFilter) {
            case 'week':
              matchesInspection = diffDays <= 7 && diffDays >= 0;
              break;
            case 'twoweeks':
              matchesInspection = diffDays <= 14 && diffDays >= 0;
              break;
            case 'overdue':
              matchesInspection = diffDays < 0;
              break;
            default:
              matchesInspection = true;
          }
        }

        // Filter by service confirmation
        let matchesConfirmation = true;
        if (confirmationFilter === 'confirmed') {
          matchesConfirmation = device.serviceConfirmed === true;
        }

        return matchesDeviceType && matchesInspection && matchesConfirmation;
      });

      // Check if client has no devices
      const hasNoDevices = !client.devices || client.devices.length === 0;

      // For clients without devices, only apply search filter
      if (hasNoDevices) {
        // If any device-specific filters are applied, exclude clients without devices
        if (deviceTypeFilter !== 'all' || inspectionFilter !== 'all' || confirmationFilter !== 'all') {
          return false;
        }
        return matchesSearch;
      }

      // For clients with devices, apply device filters
      return matchesSearch && hasMatchingDevice;
    });

    // Then, sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'surname-asc':
          const lastNameA = a.lastName || a.name?.split(' ').pop() || '';
          const lastNameB = b.lastName || b.name?.split(' ').pop() || '';
          return lastNameA.localeCompare(lastNameB, 'pl', { sensitivity: 'base' });

        case 'surname-desc':
          const lastNameA2 = a.lastName || a.name?.split(' ').pop() || '';
          const lastNameB2 = b.lastName || b.name?.split(' ').pop() || '';
          return lastNameB2.localeCompare(lastNameA2, 'pl', { sensitivity: 'base' });

        case 'urgency':
          const urgencyA = getClientUrgencyScore(a);
          const urgencyB = getClientUrgencyScore(b);
          return urgencyA - urgencyB;

        default:
          return (a.id || 0) - (b.id || 0);
      }
    });

    return sorted;
  }, [clients, searchQuery, deviceTypeFilter, inspectionFilter, confirmationFilter, sortOption]);

  return {
    filteredAndSortedClients,
    getClientUrgencyScore
  };
};