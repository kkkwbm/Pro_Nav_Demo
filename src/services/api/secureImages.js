import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';

// Demo placeholder images
const DEMO_PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNCRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlbW8gSW1hZ2U8L3RleHQ+PC9zdmc+';

/**
 * Service for handling secure image access
 */
export const secureImagesApi = {

  /**
   * Get secure URL for device image
   * @param {number} deviceId - Device ID
   * @param {number} imageId - Image ID
   * @param {number} durationHours - URL validity duration in hours (default: 24)
   * @returns {Promise<{url: string, expiresAt: number, durationHours: number}>}
   */
  getDeviceImageUrl: async (deviceId, imageId, durationHours = 24) => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      return {
        url: DEMO_PLACEHOLDER_IMAGE,
        expiresAt: Date.now() + (durationHours * 60 * 60 * 1000),
        durationHours: durationHours,
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Get secure URL for service image
   * @param {number} serviceId - Service ID
   * @param {number} imageId - Image ID
   * @param {number} durationHours - URL validity duration in hours (default: 24)
   * @returns {Promise<{url: string, expiresAt: number, durationHours: number}>}
   */
  getServiceImageUrl: async (serviceId, imageId, durationHours = 24) => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      return {
        url: DEMO_PLACEHOLDER_IMAGE,
        expiresAt: Date.now() + (durationHours * 60 * 60 * 1000),
        durationHours: durationHours,
      };
    }
    throw new Error('Demo mode only');
  },

  /**
   * Get secure URL with caching
   * Uses browser storage to cache URLs until they expire
   */
  getCachedSecureUrl: async (type, entityId, imageId, durationHours = 24) => {
    if (DEMO_MODE) {
      await simulateDelay(100);
      return {
        url: DEMO_PLACEHOLDER_IMAGE,
        expiresAt: Date.now() + (durationHours * 60 * 60 * 1000),
        durationHours: durationHours,
      };
    }

    const cacheKey = `secure_url_${type}_${entityId}_${imageId}`;

    // Try to get from sessionStorage instead of localStorage (safer for sensitive URLs)
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const parsedCache = JSON.parse(cached);
      const now = Date.now();

      // Check if cached URL is still valid (with 1 hour buffer)
      if (parsedCache.expiresAt > now + (60 * 60 * 1000)) {
        return parsedCache;
      } else {
        // Remove expired cache
        sessionStorage.removeItem(cacheKey);
      }
    }

    // Fetch new URL
    let result;
    if (type === 'device') {
      result = await secureImagesApi.getDeviceImageUrl(entityId, imageId, durationHours);
    } else if (type === 'service') {
      result = await secureImagesApi.getServiceImageUrl(entityId, imageId, durationHours);
    } else {
      throw new Error(`Invalid image type: ${type}`);
    }

    // Cache the result in sessionStorage (cleared when browser closes)
    sessionStorage.setItem(cacheKey, JSON.stringify(result));

    return result;
  },

  /**
   * Clear all cached secure URLs
   */
  clearCache: () => {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('secure_url_')) {
        keys.push(key);
      }
    }
    keys.forEach(key => sessionStorage.removeItem(key));
  }
};

export default secureImagesApi;
