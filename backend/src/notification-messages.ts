export const NOTIFICATION_MESSAGES = {
  WELCOME: 'Welcome to our platform!',
  EMAIL_VERIFIED: 'Your email has been successfully verified.',
  PASSWORD_CHANGED: 'Your password has been changed successfully.',
  PROFILE_UPDATED: 'Your profile has been updated.',
  JOB_CREATED: 'New job has been created successfully.',
  JOB_UPDATED: 'Job has been updated successfully.',
  JOB_DELETED: 'Job has been deleted successfully.',
  TRANSACTION_COMPLETED: 'Transaction has been completed successfully.',
  VERIFICATION_CODE_SENT: 'Verification code has been sent to your email.',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked due to suspicious activity.',
  ACCOUNT_UNLOCKED: 'Your account has been unlocked successfully.',
  NEW_MESSAGE: 'You have received a new message.',
  SYSTEM_MAINTENANCE: 'System maintenance is scheduled for tonight.',
} as const;

export type NotificationMessage = typeof NOTIFICATION_MESSAGES[keyof typeof NOTIFICATION_MESSAGES];
