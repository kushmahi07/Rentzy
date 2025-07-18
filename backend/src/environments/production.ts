export const productionConfig = {
  NODE_ENV: 'production',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  // Email configuration
  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASS: process.env.EMAIL_PASS!,
  EMAIL_FROM: process.env.EMAIL_FROM!,

  // Redis configuration
  REDIS_URL: process.env.REDIS_URL!,

  // External API keys
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,

  // File upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://yourdomain.com',

  // Rate limiting
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED !== 'false',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Production specific
  DEBUG: false,
  HOT_RELOAD: false,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL!,
};