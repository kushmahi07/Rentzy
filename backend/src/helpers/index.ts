import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { environment } from '@environments/index.js';
import { ApiResponse } from '@/@types/express/index.js';

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token
 */
export const generateToken = (payload: object, expiresIn: string = '15m'): string => {
  return jwt.sign(payload, environment.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, environment.JWT_SECRET);
};

/**
 * Generate a refresh token
 */
export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, environment.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

/**
 * Verify a refresh token
 */
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, environment.JWT_REFRESH_SECRET);
};

/**
 * Generate a random string
 */
export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a random numeric code
 */
export const generateRandomCode = (length: number = 6): string => {
  return Math.random().toString().slice(2, 2 + length);
};

/**
 * Create a standard API response
 */
export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): ApiResponse<T> => {
  return {
    success,
    message,
    ...(data && { data }),
    ...(error && { error }),
  };
};

/**
 * Create a paginated response
 */
export const createPaginatedResponse = <T>(
  success: boolean,
  message: string,
  data: T[],
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
): ApiResponse<T[]> => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    success,
    message,
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    },
  };
};

/**
 * Parse pagination parameters
 */
export const parsePaginationParams = (query: any) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

/**
 * Sanitize filename for uploads
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Generate a unique filename
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const ext = originalName.split('.').pop();
  return `${timestamp}_${random}.${ext}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Remove sensitive fields from object
 */
export const removeSensitiveFields = <T extends Record<string, any>>(
  obj: T,
  fields: string[] = ['password', 'token', 'refreshToken']
): Omit<T, keyof typeof fields> => {
  const result = { ...obj };
  fields.forEach(field => {
    delete result[field];
  });
  return result;
};
