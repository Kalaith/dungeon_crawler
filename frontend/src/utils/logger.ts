/**
 * Logging utility with environment-aware debug logging
 * Debug logs only appear in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Debug-level logging (only in development)
   * Use for detailed debugging information
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Info-level logging (only in development)
   * Use for general informational messages
   */
  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Warning-level logging (always shown)
   * Use for recoverable errors or important warnings
   */
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },

  /**
   * Error-level logging (always shown)
   * Use for critical errors that need attention
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};
