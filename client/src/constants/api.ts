// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    VERIFY_OTP: '/api/auth/verify-otp',
    LOGOUT: '/api/auth/logout',
  },
  
  // Dashboard
  DASHBOARD: {
    METRICS: '/api/dashboard/metrics',
  },
  
  // User Management
  USERS: {
    BASE: '/api/users',
    PROPERTY_MANAGERS: '/api/property-managers',
  },
  
  // Property Management
  PROPERTIES: {
    BASE: '/api/properties',
    COUNTS: '/api/properties/counts',
  },
  
  // Secondary Marketplace
  MARKETPLACE: {
    LISTINGS: '/api/marketplace/listings',
    METRICS: '/api/marketplace/metrics',
  },
  
  // Investment Oversight
  INVESTMENT_OVERSIGHT: {
    LISTINGS: '/api/investment-oversight/listings',
  },
  
  // Tokenization
  TOKENIZATION: {
    PROPERTIES: '/api/tokenization/properties',
  },
  
  // Settings
  SETTINGS: {
    BASE: '/api/settings',
  },
};

// Base URL for API calls
export const API_BASE_URL = '';