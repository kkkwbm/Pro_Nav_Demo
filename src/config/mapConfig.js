export const MAP_CONFIG = {
  containerStyle: { width: '100%', height: '100%' }, // Changed from 100vh to 100%
  defaultCenter: { lat: 52.2297, lng: 21.0122 }, // Centered on Warsaw
  defaultZoom: 11,
  options: {
    disableDefaultUI: true, // Disable all default UI controls
    zoomControl: true, // Re-enable only zoom control
    gestureHandling: 'greedy',
    clickableIcons: false,
  },
};

export const MARKER_COLORS = {
  HEAT_PUMP: '#3b82f6',
  GAS_BOILER: '#10b981',
  OIL_BOILER: '#8b5cf6',
  AIR_CONDITIONER: '#f59e0b',
  URGENT: '#ef4444',
};

export const DEVICE_TYPES = {
  HEAT_PUMP: 'Pompa ciepła',
  GAS_BOILER: 'Kocioł gazowy',
  OIL_BOILER: 'Kocioł olejowy',
  AIR_CONDITIONER: 'Klimatyzator',
};