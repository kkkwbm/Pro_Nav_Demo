export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    ME: '/api/auth/me',
    UPDATE_PROFILE: '/api/auth/profile',
    GET_GOOGLE_TOKEN: '/api/auth/google-token',
    REFRESH_GOOGLE_TOKEN: '/api/auth/google-token/refresh',
  },

  // User management endpoints (Admin only)
  USERS: {
    BASE: '/api/users',
    LIST: '/api/users',
    GET: (id) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
    RESET_PASSWORD: (id) => `/api/users/${id}/reset-password`,
  },

  // Clients endpoints
  CLIENTS: {
    LIST: '/api/clients',
    GET: (id) => `/api/clients/${id}`,
    CREATE: '/api/clients',
    UPDATE: (id) => `/api/clients/${id}`,
    DELETE: (id) => `/api/clients/${id}`,
    SEARCH: '/api/clients/search',
    CHECK_PHONE: (phone) => `/api/clients/check-phone/${phone}`,
    STATS: '/api/clients/stats',
  },

  // Devices endpoints
  DEVICES: {
    LIST: '/api/devices',
    GET: (id) => `/api/devices/${id}`,
    CREATE: '/api/devices',
    UPDATE: (id) => `/api/devices/${id}`,
    DELETE: (id) => `/api/devices/${id}`,
    SEARCH: '/api/devices/search',
    STATS: '/api/devices/stats',
    LIST_BY_CLIENT: (clientId) => `/api/devices/client/${clientId}`,
    UPCOMING_INSPECTIONS: '/api/devices/inspections/upcoming',
    OVERDUE_INSPECTIONS: '/api/devices/inspections/overdue',
    UPDATE_INSPECTION_DATE: (id) => `/api/devices/${id}/inspection-date`,
  },

  // Device Images endpoints
  DEVICE_IMAGES: {
    LIST: (deviceId) => `/api/devices/${deviceId}/images`,
    GET: (deviceId, imageId) => `/api/devices/${deviceId}/images/${imageId}`,
    UPLOAD: (deviceId) => `/api/devices/${deviceId}/images`,
    UPLOAD_BULK: (deviceId) => `/api/devices/${deviceId}/images/bulk`,
    UPDATE: (deviceId, imageId) => `/api/devices/${deviceId}/images/${imageId}`,
    DELETE: (deviceId, imageId) => `/api/devices/${deviceId}/images/${imageId}`,
    DELETE_ALL: (deviceId) => `/api/devices/${deviceId}/images`,
    REORDER: (deviceId) => `/api/devices/${deviceId}/images/reorder`,
    GET_SIGNED_URL: (deviceId, imageId) => `/api/devices/${deviceId}/images/${imageId}/url`,
    STATS: (deviceId) => `/api/devices/${deviceId}/images/stats`,
  },
  
  // Services endpoints
  SERVICES: {
    LIST: '/api/services',
    GET: (id) => `/api/services/${id}`,
    CREATE: '/api/services',
    UPDATE: (id) => `/api/services/${id}`,
    DELETE: (id) => `/api/services/${id}`,
    LIST_BY_DATE_RANGE: '/api/services/range',
    LIST_BY_CLIENT: (clientId) => `/api/services/client/${clientId}`,
    LIST_BY_DEVICE: (deviceId) => `/api/services/device/${deviceId}`,
    LIST_TODAY: '/api/services/today',
    LIST_UPCOMING: '/api/services/upcoming',
    LIST_OVERDUE: '/api/services/overdue',
    LIST_BY_STATUS: (status) => `/api/services/status/${status}`,
    STATS: '/api/services/stats',
    COMPLETE: (id) => `/api/services/${id}/complete`,
    CANCEL: (id) => `/api/services/${id}/cancel`,
    GET_NEXT_FOR_DEVICE: (deviceId) => `/api/services/device/${deviceId}/next`,
    GET_LAST_FOR_DEVICE: (deviceId) => `/api/services/device/${deviceId}/last`,
  },

  // Service History endpoints
  SERVICE_HISTORY: {
    GET_BY_DEVICE: (deviceId) => `/api/service-history/device/${deviceId}`,
    GET_BY_DEVICE_RANGE: (deviceId) => `/api/service-history/device/${deviceId}/range`,
    GET_BY_CLIENT: (clientId) => `/api/service-history/client/${clientId}`,
    CREATE_MANUAL: '/api/service-history/manual',
    UPDATE_MANUAL: (id) => `/api/service-history/manual/${id}`,
    DELETE_MANUAL: (id) => `/api/service-history/manual/${id}`,
    BULK_CREATE_MANUAL: '/api/service-history/manual/bulk',
    FILTER: '/api/service-history/filter',
    GET_STATS: (deviceId) => `/api/service-history/device/${deviceId}/stats`,
    SEARCH: '/api/service-history/search',
  },

  // Google Calendar endpoints
  CALENDAR: {
    LIST_EVENTS: '/api/calendar/events',
    CREATE_EVENT: '/api/calendar/events',
    UPDATE_EVENT: (eventId) => `/api/calendar/events/${eventId}`,
    DELETE_EVENT: (eventId) => `/api/calendar/events/${eventId}`,
  },

  // SMS endpoints
  SMS: {
    SEND_INSPECTION_REMINDER: (deviceId) => `/api/sms/inspection-reminder/${deviceId}`,
    SEND_CUSTOM: '/api/sms/custom',
    SEND_AUTOMATIC_REMINDERS: '/api/sms/automatic-reminders',
    SEND_OVERDUE_NOTIFICATIONS: '/api/sms/overdue-notifications',
    CONFIG_STATUS: '/api/sms/config-status',
    BALANCE: '/api/sms/balance',
    BALANCE_EXTENDED: '/api/sms/balance/extended',
    HISTORY_BY_DEVICE: (deviceId) => `/api/sms/history/device/${deviceId}`,
    HISTORY_BY_CLIENT: (clientId) => `/api/sms/history/client/${clientId}`,
    GET_LAST_SMS_DATE: (deviceId) => `/api/sms/last-sms/device/${deviceId}`,
    ALL_HISTORY: '/api/sms/history',
    PROCESS_PLANNED: '/api/sms/process-planned',
  },

  // Planned SMS endpoints
  PLANNED_SMS: {
    LIST: '/api/planned-sms',
    GET: (id) => `/api/planned-sms/${id}`,
    UPDATE: (id) => `/api/planned-sms/${id}`,
    BY_STATUS: (status) => `/api/planned-sms/status/${status}`,
    BY_CLIENT: (clientId) => `/api/planned-sms/client/${clientId}`,
    BY_DEVICE: (deviceId) => `/api/planned-sms/device/${deviceId}`,
    SEARCH: '/api/planned-sms/search',
    TODAY: '/api/planned-sms/today',
    BY_DATE: (date) => `/api/planned-sms/date/${date}`,
    UPCOMING: '/api/planned-sms/upcoming',
    PENDING: '/api/planned-sms/pending',
    NEXT_7_DAYS: '/api/planned-sms/next-7-days',
    NEXT_30_DAYS: '/api/planned-sms/next-30-days',
    DATE_RANGE: '/api/planned-sms/range',
    STATS: '/api/planned-sms/stats',
    STATS_DAILY: '/api/planned-sms/stats/daily',
    CANCEL: (id) => `/api/planned-sms/${id}/cancel`,
    DELETE: (id) => `/api/planned-sms/${id}`,
    MARK_AS_SENT: (id) => `/api/planned-sms/${id}/mark-as-sent`,
    CLEANUP: '/api/planned-sms/cleanup',
    PLAN_INSPECTION_REMINDERS: '/api/planned-sms/plan/inspection-reminders',
    PLAN_EXPIRATION_NOTIFICATIONS: '/api/planned-sms/plan/expiration-notifications',
    DEBUG_PLANNING_INFO: '/api/planned-sms/debug/planning-info',
    DEBUG_PLAN_WITH_LOGS: '/api/planned-sms/debug/plan-with-logs',
    REFRESH_PLANNING: '/api/planned-sms/refresh-planning',
    FORCE_REPLAN: '/api/planned-sms/debug/force-replan',
  },

  // Advertising endpoints
  ADVERTISING: {
    SEND_TO_ALL: '/api/admin/advertising-sms/send-all',
    SEND_TO_ACTIVE: '/api/admin/advertising-sms/send-active',
    SEND_TO_SELECTED: '/api/admin/advertising-sms/send-selected',
    PREVIEW: '/api/admin/advertising-sms/preview',
    GET_STATISTICS: '/api/admin/advertising-sms/statistics',
    GET_STATUS: '/api/admin/advertising-sms/status',
  },

  // Confirmation endpoints
  CONFIRMATION: {
    GET_INFO: (token) => `/api/confirm/${token}/info`,
    CONFIRM: (token) => `/api/confirm/${token}`,
    CANCEL: (token) => `/api/confirm/${token}`,
    UPDATE_SCHEDULE: (token) => `/api/confirm/${token}/schedule`,
    HISTORY_BY_DEVICE: (deviceId) => `/api/confirm/device/${deviceId}/history`,
    HISTORY_BY_CLIENT: (clientId) => `/api/confirm/client/${clientId}/history`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    INSPECTION_ALERTS: '/api/dashboard/inspections-alert',
    RECENT_ACTIVITY: '/api/dashboard/recent-activity',
    INSPECTIONS_CALENDAR: '/api/dashboard/inspections-calendar',
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/api/settings',
    UPDATE: '/api/settings',
    RESET: '/api/settings/reset',
    PREVIEW_SMS: '/api/settings/preview-sms',
    PREVIEW_SMS_FOR_DEVICE: '/api/settings/preview-sms-for-device',
    PREVIEW_CUSTOM_TEMPLATE: '/api/settings/preview-custom-template',
    GET_PUBLIC_CONTACT: '/api/settings/public/contact',
  },

  // Geocoding endpoints
  GEOCODING: {
    GEOCODE: '/api/geocoding/geocode',
    BATCH_GEOCODE: '/api/geocoding/batch',
    REVERSE_GEOCODE: '/api/geocoding/reverse',
    VALIDATE: '/api/geocoding/validate',
    STATUS: '/api/geocoding/status',
  },

  // External services testing endpoints
  EXTERNAL_SERVICES_TEST: {
    HEALTH: '/api/test/external/health',
    CONFIG: '/api/test/external/config',
    PING_BACKEND: '/api/test/external/ping',
    FRONTEND_CHECK: '/api/test/external/frontend-check',
    TEST_CALENDAR: '/api/test/external/calendar',
    CREATE_TEST_CALENDAR_EVENT: '/api/test/external/calendar/create-test-event',
    TEST_STORAGE: '/api/test/external/storage',
    UPLOAD_TEST_FILE: '/api/test/external/storage/upload-test',
    TEST_GEOCODING: '/api/test/external/geocoding',
    GEOCODE_ADDRESS: '/api/test/external/geocoding/geocode',
    TEST_SMS: '/api/test/external/sms',
    SEND_TEST_SMS: '/api/test/external/sms/test-send',
  },

  // SMS Scheduler endpoints (for automatic reminders)
  SMS_SCHEDULER: {
    GET_SETTINGS: '/api/sms/scheduler/settings',
    UPDATE_SETTINGS: '/api/sms/scheduler/settings',
    ENABLE_REMINDERS: '/api/sms/scheduler/reminders/enable',
    DISABLE_REMINDERS: '/api/sms/scheduler/reminders/disable',
    TOGGLE_REMINDERS: '/api/sms/scheduler/reminders/toggle',
    ENABLE_OVERDUE: '/api/sms/scheduler/overdue/enable',
    DISABLE_OVERDUE: '/api/sms/scheduler/overdue/disable',
    TOGGLE_OVERDUE: '/api/sms/scheduler/overdue/toggle',
    ENABLE_EXPIRATION_DAY: '/api/sms/scheduler/expiration-day/enable',
    DISABLE_EXPIRATION_DAY: '/api/sms/scheduler/expiration-day/disable',
    TOGGLE_EXPIRATION_DAY: '/api/sms/scheduler/expiration-day/toggle',
    TRIGGER_REMINDERS: '/api/sms/scheduler/trigger/reminders',
    TRIGGER_OVERDUE: '/api/sms/scheduler/trigger/overdue',
    TRIGGER_EXPIRATION_DAY: '/api/sms/scheduler/trigger/expiration-day',
    GET_STATUS: '/api/sms/scheduler/status',
    UPDATE_DAYS_AHEAD: '/api/sms/scheduler/days-ahead',
    UPDATE_SEND_TIME: '/api/sms/scheduler/send-time',
  },

  // SMS Rate Limits endpoints
  SMS_RATE_LIMITS: {
    GET_STATUS: '/api/admin/sms/rate-limits/status',
    GET_STATISTICS: '/api/admin/sms/rate-limits/statistics',
    BLOCK: '/api/admin/sms/rate-limits/block',
    UNBLOCK: '/api/admin/sms/rate-limits/unblock',
    CHECK: '/api/admin/sms/rate-limits/check',
    GET_CONFIG: '/api/admin/sms/rate-limits/config',
    TEST: '/api/admin/sms/rate-limits/test',
    CLEANUP: '/api/admin/sms/rate-limits/cleanup',
    GET_BLOCKED: '/api/admin/sms/rate-limits/blocked',
  },

  // Session Management endpoints
  SESSIONS: {
    MY_SESSIONS: '/api/sessions/my-sessions',
    REVOKE_SESSION: (sessionId) => `/api/sessions/revoke/${sessionId}`,
    REVOKE_ALL: '/api/sessions/revoke-all',
  },

  // Secure Images endpoints
  SECURE_IMAGES: {
    GET_DEVICE_IMAGE_URL: (deviceId, imageId) => `/api/secure/images/device/${deviceId}/${imageId}`,
    GET_SERVICE_IMAGE_URL: (serviceId, imageId) => `/api/secure/images/service/${serviceId}/${imageId}`,
  },
};