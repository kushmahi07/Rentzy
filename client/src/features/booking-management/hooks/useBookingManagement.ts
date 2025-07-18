import { useState, useEffect, useMemo } from 'react';
import { BookingData, BookingFiltersType, PaginationData, CancellationData } from '../types';
import { mockBookings } from '../mockData';
import { homeownerBookingsData } from '../homeownerMockData';
import { filterBookings, sortBookings } from '../utils';

export function useBookingManagement() {
  // State
  const [bookings, setBookings] = useState<BookingData[]>(mockBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BookingFiltersType>({
    status: '',
    dateRange: { start: '', end: '' }
  });
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDisputeChat, setShowDisputeChat] = useState(false);
  const [cancellationData, setCancellationData] = useState<CancellationData>({ reason: '' });

  // Homeowner management states
  const [selectedHomeowner, setSelectedHomeowner] = useState<string | null>(null);
  const [homeownerError, setHomeownerError] = useState<string | null>(null);

  // Mock homeowner data
  const availableHomeowners = [
    { id: 'USER789', name: 'Jane Smith' },
    { id: 'USER456', name: 'Michael Johnson' },
    { id: 'USER123', name: 'Sarah Williams' },
    { id: 'USER321', name: 'David Brown' },
    { id: 'USER654', name: 'Emily Davis' }
  ];

  // Constants
  const bookingsPerPage = 20;

  // Get bookings based on context (homeowner specific or all)
  const contextualBookings = useMemo(() => {
    if (selectedHomeowner && homeownerBookingsData[selectedHomeowner]) {
      return homeownerBookingsData[selectedHomeowner];
    }
    return bookings;
  }, [bookings, selectedHomeowner]);

  // Filtered and sorted bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...contextualBookings];
    const filteredData = filterBookings(filtered, filters);
    return sortBookings(filteredData, sortBy, sortOrder);
  }, [contextualBookings, filters, sortBy, sortOrder]);

  // Paginated bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    return filteredAndSortedBookings.slice(startIndex, startIndex + bookingsPerPage);
  }, [filteredAndSortedBookings, currentPage, bookingsPerPage]);

  // Pagination data
  const pagination = useMemo(() => ({
    currentPage,
    totalPages: Math.ceil(filteredAndSortedBookings.length / bookingsPerPage),
    totalBookings: filteredAndSortedBookings.length,
    bookingsPerPage
  }), [filteredAndSortedBookings.length, currentPage, bookingsPerPage]);

  // Handlers
  const handleViewDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (booking: BookingData) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleOpenDisputeChat = (booking: BookingData) => {
    setSelectedBooking(booking);
    setShowDisputeChat(true);
  };

  const handleConfirmCancellation = () => {
    if (selectedBooking && cancellationData.reason.trim()) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: 'cancelled' as const, paymentStatus: 'refunded' as const }
            : booking
        )
      );
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancellationData({ reason: '' });
    }
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowCancelModal(false);
    setShowDisputeChat(false);
    setSelectedBooking(null);
    setCancellationData({ reason: '' });
  };

  const handleFilterChange = (key: keyof BookingFiltersType, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Homeowner selection handler
  const handleHomeownerSelect = (homeownerId: string) => {
    if (availableHomeowners.find(homeowner => homeowner.id === homeownerId)) {
      setSelectedHomeowner(homeownerId);
      setHomeownerError(null);
      setCurrentPage(1);
    } else {
      setSelectedHomeowner(null);
      setHomeownerError('Invalid homeowner ID.');
    }
  };

  // Initialize data loading
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    // Data
    bookings: paginatedBookings,
    loading,
    error,
    pagination,

    // Filters and sorting
    filters,
    sortBy,
    sortOrder,

    // Modals and selections
    selectedBooking,
    showDetailsModal,
    showCancelModal,
    showDisputeChat,
    cancellationData,

    // Homeowner Management
    availableHomeowners,
    selectedHomeowner,
    homeownerError,

    // Handlers
    handleViewDetails,
    handleCancelBooking,
    handleOpenDisputeChat,
    handleConfirmCancellation,
    handleCloseModals,
    handleFilterChange,
    handleSort,
    handlePageChange,
    setCancellationData,
    handleHomeownerSelect
  };
}