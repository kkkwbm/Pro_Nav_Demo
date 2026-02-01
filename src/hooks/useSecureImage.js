import { useState, useEffect, useCallback } from 'react';
import { secureImagesApi } from '../services/api/secureImages';

/**
 * Hook for loading secure image URLs
 * @param {string} type - 'device' or 'service'
 * @param {number} entityId - Device ID or Service ID
 * @param {number} imageId - Image ID
 * @param {boolean} enabled - Whether to load the image (default: true)
 * @param {number} durationHours - URL validity duration (default: 24)
 */
export const useSecureImage = (type, entityId, imageId, enabled = true, durationHours = 24) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadImage = useCallback(async () => {
    if (!enabled || !type || !entityId || !imageId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await secureImagesApi.getCachedSecureUrl(type, entityId, imageId, durationHours);
      setImageUrl(result.url);
    } catch (err) {
      console.error(`Failed to load secure image URL:`, err);
      setError(err);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  }, [type, entityId, imageId, enabled, durationHours]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const refresh = useCallback(() => {
    // Clear cache and reload
    const cacheKey = `secure_url_${type}_${entityId}_${imageId}`;
    localStorage.removeItem(cacheKey);
    loadImage();
  }, [type, entityId, imageId, loadImage]);

  return {
    imageUrl,
    loading,
    error,
    refresh
  };
};

/**
 * Hook for loading multiple secure image URLs
 * @param {Array} images - Array of {type, entityId, imageId} objects
 * @param {boolean} enabled - Whether to load images (default: true)
 * @param {number} durationHours - URL validity duration (default: 24)
 */
export const useSecureImages = (images = [], enabled = true, durationHours = 24) => {
  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loadImages = useCallback(async () => {
    if (!enabled || !images.length) {
      return;
    }

    setLoading(true);
    setErrors({});

    const newUrls = {};
    const newErrors = {};

    // Load all images in parallel
    const promises = images.map(async (image) => {
      const key = `${image.type}_${image.entityId}_${image.imageId}`;
      
      try {
        const result = await secureImagesApi.getCachedSecureUrl(
          image.type, 
          image.entityId, 
          image.imageId, 
          durationHours
        );
        newUrls[key] = result.url;
      } catch (err) {
        console.error(`Failed to load secure image URL for ${key}:`, err);
        newErrors[key] = err;
      }
    });

    await Promise.allSettled(promises);

    setImageUrls(newUrls);
    setErrors(newErrors);
    setLoading(false);
  }, [images, enabled, durationHours]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const refresh = useCallback(() => {
    // Clear all cached URLs for these images
    images.forEach(image => {
      const cacheKey = `secure_url_${image.type}_${image.entityId}_${image.imageId}`;
      localStorage.removeItem(cacheKey);
    });
    loadImages();
  }, [images, loadImages]);

  const getImageUrl = useCallback((type, entityId, imageId) => {
    const key = `${type}_${entityId}_${imageId}`;
    return imageUrls[key];
  }, [imageUrls]);

  return {
    imageUrls,
    loading,
    errors,
    refresh,
    getImageUrl
  };
};

export default useSecureImage;