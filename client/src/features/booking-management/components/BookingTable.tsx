
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Eye, X, MessageCircle } from 'lucide-react';
import { BookingData } from '../types';
import { getStatusColor, getDisputeStatusColor, formatCurrency, formatDate, canCancelBooking, canOpenDispute } from '../utils';

interface BookingTableProps {
  bookings: BookingData[];
  loading: boolean;
  error: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onViewDetails: (booking: BookingData) => void;
  onCancelBooking: (booking: BookingData) => void;
  onOpenDisputeChat: (booking: BookingData) => void;
  onSort: (field: string) => void;
  showHomeownerColumn?: boolean;
}

export function BookingTable({
  bookings,
  loading,
  error,
  sortBy,
  sortOrder,
  onViewDetails,
  onCancelBooking,
  onOpenDisputeChat,
  onSort,
  showHomeownerColumn = false
}: BookingTableProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  console.log('BookingTable - bookings:', bookings);
  console.log('BookingTable - bookings.length:', bookings.length);

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return (
      <ArrowUpDown 
        className={`h-4 w-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} 
      />
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => onSort('bookingId')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Booking ID
                  {getSortIcon('bookingId')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property & Address
              </th>
              {showHomeownerColumn && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Homeowner
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => onSort('startDate')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Dates
                  {getSortIcon('startDate')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => onSort('totalPrice')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Total Price
                  {getSortIcon('totalPrice')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dispute Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={showHomeownerColumn ? 9 : 8} className="px-6 py-12 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewDetails(booking)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {booking.bookingId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.propertyId}</div>
                      <div className="text-sm text-gray-500">{booking.propertyAddress}</div>
                    </div>
                  </td>
                  {showHomeownerColumn && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.homeownerName}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.tenantName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(booking.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getDisputeStatusColor(booking.disputeStatus)}>
                      {booking.disputeStatus.charAt(0).toUpperCase() + booking.disputeStatus.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(booking)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {canCancelBooking(booking.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelBooking(booking)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      {canOpenDispute(booking.disputeStatus) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenDisputeChat(booking)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Open Dispute
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
