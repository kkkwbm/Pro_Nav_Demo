/**
 * Geocoding utility functions for converting addresses to coordinates
 */

// Default coordinates for Poland (Warsaw)
const DEFAULT_COORDINATES = {
  lat: 52.2297,
  lng: 21.0118
};

/**
 * Get company address from storage or configuration
 * @returns {Object|null} Company address object or null if not found
 */
export const getCompanyAddress = () => {
  // Try to get from localStorage first
  const stored = localStorage.getItem('companyAddress');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse stored company address:', error);
    }
  }

  // Fallback to default company address if configured
  return null;
};

/**
 * Get company address with fallback to hardcoded default
 * @returns {Object} Company address object
 */
export const getCompanyAddressOrDefault = () => {
  const companyAddr = getCompanyAddress();
  if (companyAddr) {
    return companyAddr;
  }

  // Hardcoded default company address
  return {
    ulica: 'Stanisława Moniuszki',
    nrDomu: '17',
    nrLokalu: '',
    kodPocztowy: '26-300',
    miejscowosc: 'Opoczno',
    fullAddress: 'Stanisława Moniuszki 17, 26-300 Opoczno',
    coordinates: {
      lat: 51.3757,
      lng: 20.2849
    }
  };
};

/**
 * Geocode an address using Google Maps Geocoding API
 * @param {Object} addressComponents - Address components
 * @param {string} addressComponents.ulica - Street name
 * @param {string} addressComponents.nrDomu - House number
 * @param {string} addressComponents.nrLokalu - Apartment number (optional)
 * @param {string} addressComponents.kodPocztowy - Postal code
 * @param {string} addressComponents.miejscowosc - City
 * @returns {Promise<{status: string, lat: number, lng: number, message?: string, userAddress?: string}>} Geocoding result
 */
export const geocodeAddress = async (addressComponents) => {
  return new Promise((resolve) => {
    // Check if Google Maps is loaded
    if (!window.google?.maps?.Geocoder) {
      console.warn('Google Maps Geocoder not available');
      const companyAddr = getCompanyAddressOrDefault();
      resolve({
        status: 'error',
        lat: companyAddr.coordinates.lat,
        lng: companyAddr.coordinates.lng,
        message: 'Google Maps nie jest dostępny',
        needsConfirmation: true
      });
      return;
    }

    // Build the address string
    const { ulica, nrDomu, nrLokalu, kodPocztowy, miejscowosc } = addressComponents;

    if (!ulica || !nrDomu || !kodPocztowy || !miejscowosc) {
      console.warn('Incomplete address data');
      const companyAddr = getCompanyAddressOrDefault();
      resolve({
        status: 'error',
        lat: companyAddr.coordinates.lat,
        lng: companyAddr.coordinates.lng,
        message: 'Niepełne dane adresowe',
        needsConfirmation: true
      });
      return;
    }

    // Format address string
    const addressString = nrLokalu
      ? `${ulica} ${nrDomu}/${nrLokalu}, ${kodPocztowy} ${miejscowosc}, Poland`
      : `${ulica} ${nrDomu}, ${kodPocztowy} ${miejscowosc}, Poland`;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        address: addressString,
        region: 'PL', // Bias towards Poland
        componentRestrictions: {
          country: 'PL'
        }
      },
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          resolve({
            status: 'success',
            lat: lat,
            lng: lng,
            message: `Współrzędne: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
          });
        } else {
          console.warn('Geocoding failed:', status);
          const companyAddr = getCompanyAddressOrDefault();
          resolve({
            status: 'error',
            lat: companyAddr.coordinates.lat,
            lng: companyAddr.coordinates.lng,
            message: 'Nie udało się określić współrzędnych dla podanego adresu',
            userAddress: addressString,
            needsConfirmation: true
          });
        }
      }
    );
  });
};

/**
 * Debounced geocoding function to avoid too many API calls
 * @param {Object} addressComponents - Address components
 * @param {Function} callback - Callback function to receive coordinates
 * @param {number} delay - Delay in milliseconds (default: 1000)
 */
let geocodeTimeout = null;

export const debouncedGeocode = (addressComponents, callback, delay = 1000) => {
  // Clear previous timeout
  if (geocodeTimeout) {
    clearTimeout(geocodeTimeout);
  }

  // Set new timeout
  geocodeTimeout = setTimeout(async () => {
    try {
      const result = await geocodeAddress(addressComponents);
      callback(result);
    } catch (error) {
      console.error('Geocoding error:', error);
      const companyAddr = getCompanyAddressOrDefault();
      callback({
        status: 'error',
        lat: companyAddr.coordinates.lat,
        lng: companyAddr.coordinates.lng,
        message: 'Błąd podczas geokodowania',
        needsConfirmation: true
      });
    }
  }, delay);
};

/**
 * Validate address components for geocoding
 * @param {Object} addressComponents - Address components to validate
 * @returns {boolean} True if address is valid for geocoding
 */
export const isAddressValidForGeocoding = (addressComponents) => {
  const { ulica, nrDomu, kodPocztowy, miejscowosc } = addressComponents;
  
  return !!(
    ulica && ulica.trim() &&
    nrDomu && nrDomu.trim() &&
    kodPocztowy && kodPocztowy.trim() &&
    miejscowosc && miejscowosc.trim()
  );
};

/**
 * Format coordinates for display
 * @param {Object} coordinates - Coordinates object
 * @param {number} coordinates.lat - Latitude
 * @param {number} coordinates.lng - Longitude
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (coordinates) => {
  if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    return 'N/A';
  }

  return `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
};

/**
 * Check if given coordinates match company address
 * @param {Object} coordinates - Coordinates to check
 * @returns {boolean} True if coordinates match company address
 */
export const isCompanyAddress = (coordinates) => {
  const companyAddr = getCompanyAddress();
  if (!companyAddr || !companyAddr.coordinates || !coordinates) {
    return false;
  }

  // Compare coordinates with small tolerance for floating point precision
  const tolerance = 0.0001;
  const latDiff = Math.abs(coordinates.lat - companyAddr.coordinates.lat);
  const lngDiff = Math.abs(coordinates.lng - companyAddr.coordinates.lng);

  return latDiff < tolerance && lngDiff < tolerance;
};

/**
 * Auto-fill form with company address data
 * @returns {Object} Company address form data
 */
export const autoFillCompanyAddress = () => {
  const companyAddr = getCompanyAddress();
  if (!companyAddr) {
    return {
      ulica: '',
      nrDomu: '',
      nrLokalu: '',
      kodPocztowy: '',
      miejscowosc: '',
      coordinates: DEFAULT_COORDINATES
    };
  }

  return {
    ulica: companyAddr.ulica || '',
    nrDomu: companyAddr.nrDomu || '',
    nrLokalu: companyAddr.nrLokalu || '',
    kodPocztowy: companyAddr.kodPocztowy || '',
    miejscowosc: companyAddr.miejscowosc || '',
    coordinates: companyAddr.coordinates || DEFAULT_COORDINATES
  };
};