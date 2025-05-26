// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  },
  PROJECTS: {
    GET_ALL: '/projects',
    GET_ONE: '/projects/:id',
    CREATE: '/projects',
    UPDATE: '/projects/:id',
    DELETE: '/projects/:id'
  },
  BLOG: {
    GET_ALL: '/blog',
    GET_ONE: '/blog/:id',
    CREATE: '/blog',
    UPDATE: '/blog/:id',
    DELETE: '/blog/:id'
  },
  SKILLS: {
    GET_ALL: '/skills',
    CREATE: '/skills',
    UPDATE: '/skills/:id',
    DELETE: '/skills/:id'
  },
  CONTACT: {
    SUBMIT: '/contact',
    GET_ALL: '/contact'
  },
  ANALYTICS: '/analytics',
  UPLOAD: '/upload'
};

// Application Constants
export const APP_CONFIG = {
  NAME: 'Sai Chandhan Reddy Portfolio',
  VERSION: '1.0.0',
  AUTHOR: 'Sai Chandhan Reddy Annapureddy',
  DESCRIPTION: 'Full Stack Developer Portfolio',
  EMAIL: 'chandhansai17@gmail.com',
  PHONE: '+91 9133437430',
  LOCATION: 'Kadapa, Andhra Pradesh, India'
};

// Social Media Links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/SAI-CHANDHAN',
  LINKEDIN: 'https://linkedin.com/in/saichandhanannapureddy',
  TWITTER: 'https://twitter.com/saichandhan',
  INSTAGRAM: 'https://instagram.com/saichandhan',
  WEBSITE: 'https://saichandhanreddy.com'
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  DARK: '#1f2937',
  LIGHT: '#f9fafb'
};

// Skills Categories
export const SKILL_CATEGORIES = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  TOOLS: 'Tools',
  LANGUAGES: 'Languages',
  FRAMEWORKS: 'Frameworks'
};

// Project Categories
export const PROJECT_CATEGORIES = {
  WEB: 'Web Application',
  MOBILE: 'Mobile Application',
  DESKTOP: 'Desktop Application',
  API: 'API/Backend',
  LIBRARY: 'Library/Package',
  OTHER: 'Other'
};

// Blog Categories
export const BLOG_CATEGORIES = {
  TECH: 'Technology',
  TUTORIAL: 'Tutorial',
  PERSONAL: 'Personal',
  NEWS: 'News',
  REVIEW: 'Review'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Animation Durations
export const ANIMATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  SENT: 'Message sent successfully!'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  }
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm'
};

export default {
  API_ENDPOINTS,
  APP_CONFIG,
  SOCIAL_LINKS,
  COLORS,
  SKILL_CATEGORIES,
  PROJECT_CATEGORIES,
  BLOG_CATEGORIES,
  PAGINATION,
  UPLOAD_CONFIG,
  ANIMATIONS,
  BREAKPOINTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  DATE_FORMATS
};