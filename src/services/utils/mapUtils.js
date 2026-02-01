import { MARKER_COLORS, DEVICE_TYPES } from '@/config/mapConfig';
import { getInspectionPeriod } from './clientUtils';

export const getMarkerIcon = (client) => {
  if (!window.google?.maps) {
    return { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' };
  }

  // Check if this is a custom client (service request)
  if (client.isCustomClient) {
    const color = client.contacted ? '#10b981' : '#ec4899'; // Green if contacted, pink if new

    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="20" y="26" text-anchor="middle" fill="white" font-size="24" font-weight="bold">!</text>
        </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
    };
  }

  const period = getInspectionPeriod(client.nextInspectionDate);
  const deviceType = client.deviceType;
  const isServiceConfirmed = client.serviceConfirmed === true;

  let color;
  let letter;

  if (period === 'overdue') {
    color = '#991b1b'; // Dark red for overdue
  } else if (period === 'urgent') {
    color = MARKER_COLORS.URGENT; // Red for urgent
  } else if (deviceType === DEVICE_TYPES.HEAT_PUMP) {
    color = MARKER_COLORS.HEAT_PUMP; // Blue for heat pumps
  } else if (deviceType === DEVICE_TYPES.OIL_BOILER) {
    color = MARKER_COLORS.OIL_BOILER; // Purple for oil boilers
  } else if (deviceType === DEVICE_TYPES.AIR_CONDITIONER) {
    color = MARKER_COLORS.AIR_CONDITIONER; // Orange for air conditioners
  } else {
    color = MARKER_COLORS.GAS_BOILER; // Green for gas boilers
  }

  if (deviceType === DEVICE_TYPES.HEAT_PUMP) {
    letter = 'P';
  } else if (deviceType === DEVICE_TYPES.OIL_BOILER) {
    letter = 'O';
  } else if (deviceType === DEVICE_TYPES.AIR_CONDITIONER) {
    letter = 'A';
  } else {
    letter = 'K';
  }

  // Add service confirmation indicator (small red dot in upper right corner)
  const serviceIndicator = isServiceConfirmed ? `
    <circle cx="30" cy="10" r="6" fill="#dc2626" stroke="white" stroke-width="2"/>
  ` : '';

  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-weight="bold">${letter}</text>
        ${serviceIndicator}
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
  };
};