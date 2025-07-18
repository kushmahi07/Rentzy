export const RESPONSE_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Resource already exists',
  TOO_MANY_REQUESTS: 'Too many requests',
  
  // Auth specific
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  ACCOUNT_NOT_VERIFIED: 'Please verify your account',
  TOKEN_EXPIRED: 'Access token has expired',
  INVALID_TOKEN: 'Invalid access token',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  
  // User specific
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  PROFILE_UPDATED: 'Profile updated successfully',
  
  // Job specific
  JOB_NOT_FOUND: 'Job not found',
  JOB_CREATED: 'Job created successfully',
  JOB_UPDATED: 'Job updated successfully',
  JOB_DELETED: 'Job deleted successfully',
  
  // Transaction specific
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_CREATED: 'Transaction created successfully',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  
  // Verification specific
  VERIFICATION_CODE_SENT: 'Verification code sent successfully',
  VERIFICATION_CODE_INVALID: 'Invalid verification code',
  VERIFICATION_CODE_EXPIRED: 'Verification code has expired',
  VERIFICATION_SUCCESS: 'Verification completed successfully',
} as const;

export type ResponseMessage = typeof RESPONSE_MESSAGES[keyof typeof RESPONSE_MESSAGES];
