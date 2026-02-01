import React, { useState, useEffect } from 'react';
import { Camera, Upload, X, Trash2, Eye, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { secureImagesApi } from '../../services/api/secureImages';
import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';

const ServiceImages = ({ serviceId, isOpen, onClose }) => {
  const notification = useNotification();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({}); // Cache for secure URLs
  const [loadingImages, setLoadingImages] = useState({}); // Track which images are loading

  useEffect(() => {
    if (isOpen && serviceId) {
      fetchImages();
    }
  }, [isOpen, serviceId]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        await simulateDelay(200);
        // Return empty array or mock images for demo
        setImages([]);
        setImageUrls({});
      } else {
        throw new Error('Demo mode only');
      }
    } catch (err) {
      console.error('Error fetching service images:', err);
      setError('Błąd podczas pobierania zdjęć serwisu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(500);
        // Simulate adding images in demo mode
        const newImages = Array.from(files).map((file, index) => ({
          id: Date.now() + index,
          originalName: file.name,
          fileSize: file.size,
          formattedFileSize: `${(file.size / 1024).toFixed(1)} KB`,
          isPdf: file.type === 'application/pdf',
        }));
        setImages(prev => [...prev, ...newImages]);
        notification.showSuccess('Zdjęcia zostały dodane (tryb demo)');
      } else {
        throw new Error('Demo mode only');
      }
    } catch (err) {
      console.error('Error uploading service images:', err);
      notification.showError('Nie udało się dodać zdjęcia');
      setError('Błąd podczas przesyłania zdjęć serwisu');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zdjęcie?')) return;

    try {
      if (DEMO_MODE) {
        await simulateDelay(200);
        setImages(images.filter(img => img.id !== imageId));
        if (selectedImage?.id === imageId) {
          setSelectedImage(null);
        }
        notification.showSuccess('Zdjęcie zostało usunięte (tryb demo)');
      } else {
        throw new Error('Demo mode only');
      }
    } catch (err) {
      console.error('Error deleting service image:', err);
      setError('Błąd podczas usuwania zdjęcia serwisu');
    }
  };

  const openImageViewer = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Helper function to get secure URL for an image
  const getSecureImageUrl = async (imageId) => {
    // Check if we already have a cached URL
    if (imageUrls[imageId]) {
      return imageUrls[imageId];
    }

    // Check if already loading
    if (loadingImages[imageId]) {
      return null;
    }

    setLoadingImages(prev => ({ ...prev, [imageId]: true }));

    try {
      const result = await secureImagesApi.getCachedSecureUrl('service', serviceId, imageId, 6); // 6 hours validity
      setImageUrls(prev => ({ ...prev, [imageId]: result.url }));
      setLoadingImages(prev => ({ ...prev, [imageId]: false }));
      return result.url;
    } catch (error) {
      console.error(`Failed to get secure URL for service image ${imageId}:`, error);
      setLoadingImages(prev => ({ ...prev, [imageId]: false }));
      return null;
    }
  };

  // Component for rendering image with secure URL
  const SecureImage = ({ image, style, onClick, showFallback = true }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      let mounted = true;
      
      const loadSecureUrl = async () => {
        try {
          const url = await getSecureImageUrl(image.id);
          if (mounted) {
            setImageSrc(url);
            setImageError(!url);
          }
        } catch (error) {
          if (mounted) {
            setImageError(true);
          }
        }
      };

      loadSecureUrl();

      return () => {
        mounted = false;
      };
    }, [image.id]);

    if (imageError || (!imageSrc && !loadingImages[image.id])) {
      return (
        <div style={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          fontSize: '12px',
          textAlign: 'center',
          padding: '10px',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}>
          <Camera size={24} color="#9ca3af" style={{ marginBottom: '4px' }} />
          <div>Podgląd niedostępny</div>
          {onClick && <div style={{ fontSize: '10px', marginTop: '4px' }}>Kliknij aby otworzyć</div>}
        </div>
      );
    }

    if (loadingImages[image.id]) {
      return (
        <div style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          fontSize: '12px'
        }}>
          Ładowanie...
        </div>
      );
    }

    return (
      <img
        src={imageSrc}
        alt={image.originalName}
        style={style}
        onClick={onClick}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4000,
      }}>
        <div style={{
          background: 'white',
          borderRadius: 12,
          width: '90%',
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Header */}
          <div style={{
            padding: 20,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              Zdjęcia serwisu
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={24} color="#6b7280" />
            </button>
          </div>

          {/* Upload Section */}
          <div style={{
            padding: 20,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: 6,
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 500,
              opacity: uploading ? 0.7 : 1,
            }}>
              <Upload size={18} />
              {uploading ? 'Przesyłanie...' : 'Dodaj zdjęcia'}
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              {images.length} {images.length === 1 ? 'plik' : 'plików'}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              margin: '16px 20px',
              padding: 12,
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: 6,
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* Images Grid */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: 20,
          }}>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: 40,
                color: '#6b7280',
              }}>
                Ładowanie zdjęć...
              </div>
            ) : images.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 40,
                color: '#9ca3af',
              }}>
                <Camera size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <p>Brak zdjęć dla tego serwisu</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>
                  Kliknij "Dodaj zdjęcia" aby przesłać pierwsze zdjęcie
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 16,
              }}>
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    style={{
                      position: 'relative',
                      backgroundColor: '#f9fafb',
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Image Preview */}
                    <div
                      style={{
                        width: '100%',
                        height: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f4f6',
                      }}
                    >
                      {image.isPdf ? (
                        <div 
                          onClick={async () => {
                            try {
                              const url = await getSecureImageUrl(image.id);
                              if (url) {
                                window.open(url, '_blank');
                              }
                            } catch (error) {
                              console.error('Error opening PDF:', error);
                            }
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            cursor: 'pointer',
                          }}
                        >
                          <FileText size={48} color="#6b7280" />
                          <span style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>PDF</span>
                        </div>
                      ) : (
                        <SecureImage
                          image={image}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onClick={() => openImageViewer(image, index)}
                        />
                      )}
                    </div>

                    {/* Image Info */}
                    <div style={{
                      padding: 8,
                      fontSize: 12,
                    }}>
                      <div style={{
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {image.originalName}
                      </div>
                      <div style={{ color: '#6b7280' }}>
                        {image.formattedFileSize || `${(image.fileSize / 1024).toFixed(1)} KB`}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(220, 38, 38, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: 4,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Usuń zdjęcie"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && !selectedImage.isPdf && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5000,
        }}>
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: 12,
              cursor: 'pointer',
              zIndex: 5001,
            }}
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                style={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: 12,
                  cursor: 'pointer',
                  zIndex: 5001,
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => navigateImage('next')}
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: 12,
                  cursor: 'pointer',
                  zIndex: 5001,
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Display */}
          <div style={{
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <SecureImage
              image={selectedImage}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              showFallback={false}
            />
            
            {/* Image Info */}
            <div style={{
              marginTop: 16,
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                {selectedImage.originalName}
              </div>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                {currentImageIndex + 1} / {images.length} • {selectedImage.formattedFileSize}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceImages;