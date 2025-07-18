
export interface BookingData {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyAddress: string;
  homeownerName?: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  disputeStatus: 'none' | 'open' | 'resolved';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  updatedAt: string;
  disputeReason?: string;
  chatHistory?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'admin' | 'tenant';
  message: string;
  timestamp: string;
}

export interface BookingFiltersType {
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CancellationData {
  reason: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  bookingsPerPage: number;
}
