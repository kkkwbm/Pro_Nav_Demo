import { useMemo } from 'react';
import { getInspectionPeriod } from '@/services/utils/clientUtils';

export const useClientFiltering = ({
  clients,
  searchQuery,
  deviceTypeFilter,
  inspectionFilter,
  confirmationFilter,
  sortOption
}) => {
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

  const getClientOldestSmsDate = (client) => {
    if (!client.devices || !Array.isArray(client.devices) || client.devices.length === 0) {
      return null;
    }

    // Find the oldest SMS date among all devices
    let oldestDate = null;

    client.devices.forEach(device => {
      if (device.lastSms) {
        const smsDate = new Date(device.lastSms);
        if (!oldestDate || smsDate < oldestDate) {
          oldestDate = smsDate;
        }
      }
    });

    return oldestDate;
  };

  const filteredAndSortedClients = useMemo(() => {
    if (!Array.isArray(clients)) {
      console.warn('[useClientFiltering] Clients is not an array:', clients);
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

        case 'sms-oldest':
          const smsDateA = getClientOldestSmsDate(a);
          const smsDateB = getClientOldestSmsDate(b);

          // Clients without any SMS dates go to the end
          if (!smsDateA && !smsDateB) return 0;
          if (!smsDateA) return 1; // a goes to end
          if (!smsDateB) return -1; // b goes to end

          // Sort by oldest first (earlier dates first)
          return smsDateA - smsDateB;

        case 'sms-newest':
          const smsDateA2 = getClientOldestSmsDate(a);
          const smsDateB2 = getClientOldestSmsDate(b);

          // Clients without any SMS dates go to the end
          if (!smsDateA2 && !smsDateB2) return 0;
          if (!smsDateA2) return 1; // a goes to end
          if (!smsDateB2) return -1; // b goes to end

          // Sort by newest first (later dates first)
          return smsDateB2 - smsDateA2;

        default:
          return (a.id || 0) - (b.id || 0);
      }
    });

    return sorted;
  }, [clients, searchQuery, deviceTypeFilter, inspectionFilter, confirmationFilter, sortOption]);

  return filteredAndSortedClients;
};