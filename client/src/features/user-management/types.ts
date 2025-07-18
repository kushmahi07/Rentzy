
export interface BookingData {
  id: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingStatus: 'Completed' | 'Upcoming' | 'Cancelled';
  amount: number;
  paymentType: 'fiat' | 'crypto';
  paymentStatus: 'pending' | 'confirmed';
  tokenSymbol?: string;
  tokenAmount?: number;
  transactionId: string;
}

export interface InvestmentData {
  id: string;
  propertyName: string;
  tokensOwned: number;
  purchaseValue: number;
  currentValue: number;
  purchaseDate: string;
}

export interface ActivityData {
  id: string;
  action: string;
  timestamp: string;
}



export interface PlatformUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  kycStatus: string;
  userRoles: string[];
  registrationDate: string;
  lastLogin: string;
}
