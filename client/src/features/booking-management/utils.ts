
import { BookingData, BookingFiltersType } from './types';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getDisputeStatusColor = (status: string): string => {
  switch (status) {
    case 'none':
      return 'bg-gray-100 text-gray-800';
    case 'open':
      return 'bg-orange-100 text-orange-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'refunded':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const canCancelBooking = (status: string): boolean => {
  return status === 'pending' || status === 'confirmed';
};

export const canOpenDispute = (disputeStatus: string): boolean => {
  return disputeStatus === 'open';
};

export const filterBookings = (
  bookings: BookingData[],
  filters: BookingFiltersType
): BookingData[] => {
  return bookings.filter(booking => {
    const matchesStatus = !filters.status || filters.status === 'all' || booking.status === filters.status;
    
    let matchesDateRange = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const bookingStart = new Date(booking.startDate);
      const filterStart = new Date(filters.dateRange.start);
      const filterEnd = new Date(filters.dateRange.end);
      matchesDateRange = bookingStart >= filterStart && bookingStart <= filterEnd;
    }
    
    return matchesStatus && matchesDateRange;
  });
};

export const sortBookings = (
  bookings: BookingData[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): BookingData[] => {
  return [...bookings].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'startDate':
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case 'totalPrice':
        comparison = a.totalPrice - b.totalPrice;
        break;
      case 'bookingId':
        comparison = a.bookingId.localeCompare(b.bookingId);
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};
