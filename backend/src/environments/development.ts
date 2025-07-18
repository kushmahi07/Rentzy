export const developmentConfig = {
  NODE_ENV: 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || 'postgresql://localhost:5432/dev_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret-key',

  // Email configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@example.com',

  // Redis configuration (for sessions/cache)
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // External API keys
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  // File upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Rate limiting
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED === 'true',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // Development specific
  DEBUG: true,
  HOT_RELOAD: true,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourplatform.com',
};