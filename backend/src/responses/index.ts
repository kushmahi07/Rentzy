import { ApiResponse } from '@/@types/express/index.js';

/**
 * Standard success response structure
 */
export const successResponse = <T>(
  message: string,
  data?: T,
  statusCode: number = 200
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

/**
 * Standard error response structure
 */
export const errorResponse = (
  message: string,
  error?: string,
  statusCode: number = 500
): ApiResponse => ({
  success: false,
  message,
  error,
});

/**
 * Paginated response structure
 */
export const paginatedResponse = <T>(
  message: string,
  data: T[],
  currentPage: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number
): ApiResponse<T[]> => ({
  success: true,
  message,
  data,
  pagination: {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  },
});

/**
 * Validation error response
 */
export const validationErrorResponse = (
  errors: Record<string, string[]>
): ApiResponse => ({
  success: false,
  message: 'Validation failed',
  error: 'Validation errors occurred',
  data: errors,
});

/**
 * Not found response
 */
export const notFoundResponse = (resource: string = 'Resource'): ApiResponse => ({
  success: false,
  message: `${resource} not found`,
  error: 'NOT_FOUND',
});

/**
 * Unauthorized response
 */
export const unauthorizedResponse = (message: string = 'Unauthorized'): ApiResponse => ({
  success: false,
  message,
  error: 'UNAUTHORIZED',
});

/**
 * Forbidden response
 */
export const forbiddenResponse = (message: string = 'Access forbidden'): ApiResponse => ({
  success: false,
  message,
  error: 'FORBIDDEN',
});

/**
 * Too many requests response
 */
export const tooManyRequestsResponse = (message: string = 'Too many requests'): ApiResponse => ({
  success: false,
  message,
  error: 'TOO_MANY_REQUESTS',
});

/**
 * Service unavailable response
 */
export const serviceUnavailableResponse = (message: string = 'Service temporarily unavailable'): ApiResponse => ({
  success: false,
  message,
  error: 'SERVICE_UNAVAILABLE',
});

/**
 * Created response for successful resource creation
 */
export const createdResponse = <T>(
  message: string,
  data: T,
  location?: string
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  ...(location && { location }),
});

/**
 * No content response for successful operations without return data
 */
export const noContentResponse = (message: string = 'Operation completed successfully'): ApiResponse => ({
  success: true,
  message,
});

/**
 * Response for accepted operations (async processing)
 */
export const acceptedResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});
