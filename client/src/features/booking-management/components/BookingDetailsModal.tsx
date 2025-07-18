
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '../types';
import { getStatusColor, getDisputeStatusColor, getPaymentStatusColor, formatCurrency, formatDate, formatDateTime, canCancelBooking, canOpenDispute } from '../utils';

interface BookingDetailsModalProps {
  booking: BookingData | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (booking: BookingData) => void;
  onOpenDisputeChat: (booking: BookingData) => void;
}

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
  onCancelBooking,
  onOpenDisputeChat
}: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" role="dialog">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Booking ID</p>
              <p className="text-lg font-semibold text-gray-900">{booking.bookingId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Property ID</p>
              <p className="text-lg font-semibold text-gray-900">{booking.propertyId}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-base text-gray-900">{booking.propertyAddress}</p>
          </div>

          {booking.homeownerName && (
            <div>
              <p className="text-sm font-medium text-gray-500">Homeowner</p>
              <p className="text-base text-gray-900">{booking.homeownerName}</p>
            </div>
          )}

          <Separator />

          {/* Tenant Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tenant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base text-gray-900">{booking.tenantName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{booking.tenantEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-base text-gray-900">{booking.tenantPhone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-base text-gray-900">{formatDate(booking.startDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-base text-gray-900">{formatDate(booking.endDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Price</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(booking.totalPrice)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Status Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Booking Status</p>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dispute Status</p>
                <Badge className={getDisputeStatusColor(booking.disputeStatus)}>
                  {booking.disputeStatus.charAt(0).toUpperCase() + booking.disputeStatus.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-base text-gray-900">{formatDateTime(booking.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-base text-gray-900">{formatDateTime(booking.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Dispute Section */}
          {booking.disputeStatus === 'open' && booking.disputeReason && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Dispute Information</h3>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Dispute Reason</p>
                  <p className="text-base text-gray-900">{booking.disputeReason}</p>
                </div>
                
                {booking.chatHistory && booking.chatHistory.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Recent Chat Messages</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                      {booking.chatHistory.slice(-3).map((message) => (
                        <div key={message.id} className="text-sm">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-700 capitalize">{message.sender}:</span>
                            <span className="text-xs text-gray-500">{formatDateTime(message.timestamp)}</span>
                          </div>
                          <p className="text-gray-900 mt-1">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            {canCancelBooking(booking.status) && (
              <Button 
                onClick={() => onCancelBooking(booking)} 
                variant="outline" 
                className="flex-1 text-red-600 hover:text-red-700"
              >
                Cancel Booking
              </Button>
            )}
            {canOpenDispute(booking.disputeStatus) && (
              <Button 
                onClick={() => onOpenDisputeChat(booking)} 
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Open Dispute Chat
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
