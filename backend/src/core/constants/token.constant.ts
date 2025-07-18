
export const TOKEN_TRANSACTION_TYPE = {
  BUY: 'buy'
} as const;

export const TOKEN_TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export const TOKEN_LIST_ACTION_TYPE = {
  CREATED: 'created',
  UPDATED: 'updated',
  CANCELLED: 'cancelled',
  SOLD: 'sold',
  EXPIRED: 'expired'
} as const;

export const TOKEN_OWNER_ACTION_TYPE = {
  CREATED: 'created',
  UPDATED: 'updated',
  TRANSFER: 'transfer',
  LISTING: 'listing',
  UNLISTING: 'unlisting',
  SALE: 'sale',
  PURCHASE: 'purchase'
} as const;

// Type exports
export type TokenTransactionType = typeof TOKEN_TRANSACTION_TYPE[keyof typeof TOKEN_TRANSACTION_TYPE];
export type TokenTransactionStatus = typeof TOKEN_TRANSACTION_STATUS[keyof typeof TOKEN_TRANSACTION_STATUS];
export type TokenListActionType = typeof TOKEN_LIST_ACTION_TYPE[keyof typeof TOKEN_LIST_ACTION_TYPE];
export type TokenOwnerActionType = typeof TOKEN_OWNER_ACTION_TYPE[keyof typeof TOKEN_OWNER_ACTION_TYPE];
