/**
 * Logging utility that respects environment settings
 * Logs are only shown in development mode
 */

const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;

// Get log level from environment or default to 'warn' in production
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || (isDevelopment ? 'debug' : 'warn');

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};

const currentLevel = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.warn;

const logger = {
  debug: (...args) => {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log('[DEBUG]', ...args);
    }
  },

  info: (...args) => {
    if (currentLevel <= LOG_LEVELS.info) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args) => {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args) => {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error('[ERROR]', ...args);
    }
  },

  // Legacy compatibility - maps console.log to logger.debug
  log: (...args) => {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log(...args);
    }
  }
};

// In production, override global console to prevent accidental logs
if (!isDevelopment) {
  // Keep error and warn, but silence debug/info/log
  const noop = () => {};
  window.console.log = noop;
  window.console.debug = noop;
  window.console.info = noop;
  // Keep console.warn and console.error for critical issues
}

export default logger;
