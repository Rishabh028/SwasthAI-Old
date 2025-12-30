// Utility functions for page navigation and helpers

/**
 * Convert page name to URL path
 * @param {string} pageName - Page component name (e.g., 'FindDoctor')
 * @returns {string} - URL path (e.g., '/find-doctor')
 */
export const createPageUrl = (pageName) => {
  return '/' + pageName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format time to readable format
 * @param {string} timeString - Time string
 * @returns {string} - Formatted time
 */
export const formatTime = (timeString) => {
  return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
