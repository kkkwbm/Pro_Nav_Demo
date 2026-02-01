import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} color="#059669" />;
      case 'error':
        return <AlertCircle size={20} color="#dc2626" />;
      case 'warning':
        return <AlertTriangle size={20} color="#d97706" />;
      case 'info':
      default:
        return <Info size={20} color="#2563eb" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return '#f0fdf4';
      case 'error':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      case 'info':
      default:
        return '#eff6ff';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return '#bbf7d0';
      case 'error':
        return '#fecaca';
      case 'warning':
        return '#fed7aa';
      case 'info':
      default:
        return '#bfdbfe';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return '#065f46';
      case 'error':
        return '#991b1b';
      case 'warning':
        return '#92400e';
      case 'info':
      default:
        return '#1e40af';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        backgroundColor: getBackgroundColor(),
        border: `1px solid ${getBorderColor()}`,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: 12,
        minWidth: 350,
        maxWidth: 500,
        position: 'relative',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {getIcon()}
      <span
        style={{
          color: getTextColor(),
          fontSize: 14,
          fontWeight: 500,
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {notification.message}
      </span>
      <button
        onClick={() => onRemove(notification.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          color: getTextColor(),
          opacity: 0.7,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '1')}
        onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
        title="Zamknij"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    // Check if a notification with the same message and type already exists
    const existingNotification = notifications.find(
      (notification) => notification.message === message && notification.type === type
    );

    // If duplicate exists, don't add a new one
    if (existingNotification) {
      return existingNotification.id;
    }

    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [notifications]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, duration = 4000) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message, duration = 6000) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration = 5000) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration = 4000) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      {notifications.length > 0 && (
        <>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
          
          <div
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRemove={removeNotification}
              />
            ))}
          </div>
        </>
      )}
    </NotificationContext.Provider>
  );
};