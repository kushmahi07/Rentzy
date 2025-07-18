
import { useState } from "react";
import { BookingData, RefundFormData } from '../types';

export function useBookingManagement() {
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundFormData, setRefundFormData] = useState<RefundFormData>({
    amount: "",
    paymentType: "fiat",
    walletAddress: "",
    bankAccountNumber: "",
    swiftCode: ""
  });

  const handleViewBookingDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleCloseBookingDetails = () => {
    setSelectedBooking(null);
    setShowBookingDetails(false);
  };

  const handleOpenRefundModal = (booking: BookingData) => {
    setSelectedBooking(booking);
    setRefundFormData({
      amount: booking.amount.toString(),
      paymentType: booking.paymentType,
      walletAddress: "",
      bankAccountNumber: "",
      swiftCode: ""
    });
    setShowRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setSelectedBooking(null);
    setShowRefundModal(false);
    setRefundFormData({
      amount: "",
      paymentType: "fiat",
      walletAddress: "",
      bankAccountNumber: "",
      swiftCode: ""
    });
  };

  const handleRefundFormChange = (field: string, value: string) => {
    setRefundFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProcessRefund = () => {
    console.log("Processing refund:", refundFormData);
    handleCloseRefundModal();
  };

  return {
    // State
    showBookingDetails,
    selectedBooking,
    showRefundModal,
    refundFormData,
    
    // Handlers
    handleViewBookingDetails,
    handleCloseBookingDetails,
    handleOpenRefundModal,
    handleCloseRefundModal,
    handleRefundFormChange,
    handleProcessRefund
  };
}
