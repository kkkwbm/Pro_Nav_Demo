import React from 'react';
import { useSecureImage } from '../../hooks/useSecureImage';
import { ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Secure Image component that handles authentication and signed URLs
 * @param {string} type - 'device' or 'service'
 * @param {number} entityId - Device ID or Service ID
 * @param {number} imageId - Image ID
 * @param {string} alt - Alt text for the image
 * @param {string} className - CSS classes
 * @param {Object} style - Inline styles
 * @param {boolean} showLoadingSpinner - Whether to show loading spinner (default: true)
 * @param {boolean} showErrorIcon - Whether to show error icon (default: true)
 * @param {number} durationHours - URL validity duration (default: 24)
 * @param {Function} onClick - Click handler
 * @param {Function} onLoad - Image load handler
 * @param {Function} onError - Image error handler
 */
const SecureImage = ({
  type,
  entityId,
  imageId,
  alt = '',
  className = '',
  style = {},
  showLoadingSpinner = true,
  showErrorIcon = true,
  durationHours = 24,
  onClick,
  onLoad,
  onError,
  ...props
}) => {
  const { imageUrl, loading, error, refresh } = useSecureImage(
    type, 
    entityId, 
    imageId, 
    true, 
    durationHours
  );

  const handleImageError = (e) => {
    console.warn(`Failed to load secure image: ${type}/${entityId}/${imageId}`);
    
    // Try to refresh the URL once in case it expired
    if (imageUrl && !e.target.hasAttribute('data-retry')) {
      e.target.setAttribute('data-retry', 'true');
      refresh();
    }
    
    if (onError) {
      onError(e);
    }
  };

  const handleImageLoad = (e) => {
    // Remove retry flag on successful load
    e.target.removeAttribute('data-retry');
    
    if (onLoad) {
      onLoad(e);
    }
  };

  // Loading state
  if (loading) {
    if (!showLoadingSpinner) {
      return null;
    }

    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ minHeight: '100px', ...style }}
      >
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state
  if (error || !imageUrl) {
    if (!showErrorIcon) {
      return null;
    }

    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ minHeight: '100px', ...style }}
        title={error ? `Error loading image: ${error.message}` : 'Image not available'}
      >
        <AlertCircle size={24} className="mb-2" />
        <span className="text-xs text-center">
          {error ? 'Nie udało się załadować' : 'Niedostępne'}
        </span>
      </div>
    );
  }

  // Success state - render image
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
      onLoad={handleImageLoad}
      onError={handleImageError}
      {...props}
    />
  );
};

/**
 * Secure thumbnail component with common styling
 */
export const SecureThumbnail = ({ type, entityId, imageId, alt, onClick, ...props }) => {
  return (
    <SecureImage
      type={type}
      entityId={entityId}
      imageId={imageId}
      alt={alt}
      onClick={onClick}
      className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
      {...props}
    />
  );
};

/**
 * Secure image gallery item
 */
export const SecureGalleryImage = ({ type, entityId, imageId, alt, onClick, ...props }) => {
  return (
    <SecureImage
      type={type}
      entityId={entityId}
      imageId={imageId}
      alt={alt}
      onClick={onClick}
      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
      {...props}
    />
  );
};

export default SecureImage;