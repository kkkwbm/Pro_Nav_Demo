export const isInspectionSoon = (dateString, daysThreshold = 30) => {
  const diffDays = (new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24);
  return diffDays <= daysThreshold && diffDays >= 0;
};

export const getInspectionPeriod = (dateString) => {
  const diffDays = (new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'overdue'; // Past due
  if (diffDays <= 30) return 'urgent'; // Less than 1 month
  if (diffDays <= 90) return 'soon'; // 1-3 months
  return 'later'; // More than 3 months
};

// All available device types
export const ALL_DEVICE_TYPES = ['Pompa ciepła', 'Kocioł gazowy', 'Kocioł olejowy', 'Klimatyzator'];

// All available inspection periods
export const ALL_INSPECTION_PERIODS = ['overdue', 'urgent', 'soon', 'later'];

export const filterClients = (clients, { searchQuery, filterTypes, inspectionFilters, confirmationFilter }) => {
  if (!clients || !Array.isArray(clients)) return [];

  return clients.filter((client) => {
    if (!client) return false;

    const search = (searchQuery || '').toLowerCase();

    // Handle both client and device objects
    // For Map Page: device objects have both id (clientId) and deviceId
    // For ClientsPage: client objects have just id
    const clientId = client.id || client.clientId || '';
    const deviceId = client.deviceId || '';
    const name = client.name || client.clientName || '';
    const address = client.address || '';
    const phone = client.phone || client.clientPhone || '';

    const matchesSearch = search === '' || (
      (clientId && clientId.toString().includes(search)) ||
      (deviceId && deviceId.toString().includes(search)) ||
      name.toLowerCase().includes(search) ||
      address.toLowerCase().includes(search) ||
      phone.includes(search)
    );

    // Multi-select: if array has all types or is empty, show all; otherwise filter by selected types
    const typesArray = Array.isArray(filterTypes) ? filterTypes : [];
    const allTypesSelected = typesArray.length === 0 || typesArray.length === ALL_DEVICE_TYPES.length;
    const matchesType = allTypesSelected || typesArray.includes(client.deviceType);

    // Multi-select for inspection periods
    const periodsArray = Array.isArray(inspectionFilters) ? inspectionFilters : [];
    const allPeriodsSelected = periodsArray.length === 0 || periodsArray.length === ALL_INSPECTION_PERIODS.length;
    let matchesInspection = true;
    if (!allPeriodsSelected && client.nextInspectionDate) {
      const period = getInspectionPeriod(client.nextInspectionDate);
      matchesInspection = periodsArray.includes(period);
    } else if (!allPeriodsSelected && !client.nextInspectionDate) {
      // If no inspection date and specific periods are selected, hide this client
      matchesInspection = false;
    }

    let matchesConfirmation = true;
    if (confirmationFilter === 'confirmed') {
      matchesConfirmation = client.serviceConfirmed === true;
    }

    return matchesSearch && matchesType && matchesInspection && matchesConfirmation;
  });
};

export const getClientStats = (clients) => {
  if (!clients || !Array.isArray(clients)) {
    return {
      total: 0,
      heatPumps: 0,
      gasBoilers: 0,
      urgentInspections: 0,
      soonInspections: 0,
      overdueInspections: 0
    };
  }

  const validClients = clients.filter(c => c && c.deviceType);
  const total = validClients.length;
  const heatPumps = validClients.filter(c => c.deviceType === 'Pompa ciepła').length;
  const gasBoilers = validClients.filter(c => c.deviceType === 'Kocioł gazowy').length;
  const urgentInspections = validClients.filter(c => c.nextInspectionDate && getInspectionPeriod(c.nextInspectionDate) === 'urgent').length;
  const soonInspections = validClients.filter(c => c.nextInspectionDate && getInspectionPeriod(c.nextInspectionDate) === 'soon').length;
  const overdueInspections = validClients.filter(c => c.nextInspectionDate && getInspectionPeriod(c.nextInspectionDate) === 'overdue').length;

  return {
    total,
    heatPumps,
    gasBoilers,
    urgentInspections,
    soonInspections,
    overdueInspections
  };
};
