
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Building2, X } from 'lucide-react';

// Hooks
import { useBookingManagement } from './hooks/useBookingManagement';

// Components
import {
  BookingTable,
  BookingFilters,
  BookingDetailsModal,
  CancellationModal,
  DisputeChatModal,
  BookingPagination
} from './components';

export default function BookingManagement() {
  const {
    // Data
    bookings,
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
    
    // Homeowner management
    selectedHomeowner,
    availableHomeowners,
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
    handleHomeownerChange,
    getSelectedHomeownerName,
    setCancellationData
  } = useBookingManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-600">Manage property bookings and rental activities</p>
        </div>
      </div>

      {/* Booking Management Tabs */}
      <Tabs defaultValue="admin-properties" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="admin-properties" 
            className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Building2 className="h-4 w-4" />
            Admin Properties Bookings
          </TabsTrigger>
          <TabsTrigger 
            value="homeowner-properties" 
            className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            Homeowner Properties Bookings
          </TabsTrigger>
        </TabsList>

        {/* Admin Properties Bookings Tab */}
        <TabsContent value="admin-properties" className="space-y-6">
          {/* Filters */}
          <BookingFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Admin Properties Bookings ({pagination?.totalBookings || 0})
              </CardTitle>
              <CardDescription>
                Manage bookings for properties added by the admin
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <BookingTable
                bookings={bookings}
                loading={loading}
                error={error}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onViewDetails={handleViewDetails}
                onCancelBooking={handleCancelBooking}
                onOpenDisputeChat={handleOpenDisputeChat}
                onSort={handleSort}
              />

              {/* Pagination */}
              {pagination && (
                <BookingPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Homeowner Properties Bookings Tab */}
        <TabsContent value="homeowner-properties" className="space-y-6">
          {/* Homeowner Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Homeowner Selection
              </CardTitle>
              <CardDescription>
                Select a homeowner to view and manage their property bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="homeowner-select" className="text-sm font-medium text-gray-700">
                    Select Homeowner *
                  </label>
                  <select
                    id="homeowner-select"
                    value={selectedHomeowner || ''}
                    onChange={handleHomeownerChange}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a homeowner...</option>
                    {availableHomeowners.map((homeowner) => (
                      <option key={homeowner.id} value={homeowner.id}>
                        {homeowner.name} ({homeowner.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                {homeownerError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{homeownerError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Management - Only show when homeowner is selected */}
          {selectedHomeowner && !homeownerError && (
            <>
              {/* Filters */}
              <BookingFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Bookings Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Homeowner Properties Bookings ({pagination?.totalBookings || 0})
                  </CardTitle>
                  <CardDescription>
                    Manage bookings for properties owned by {getSelectedHomeownerName()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <BookingTable
                    bookings={bookings}
                    loading={loading}
                    error={error}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onViewDetails={handleViewDetails}
                    onCancelBooking={handleCancelBooking}
                    onOpenDisputeChat={handleOpenDisputeChat}
                    onSort={handleSort}
                    showHomeownerColumn={true}
                  />

                  {/* Pagination */}
                  {pagination && (
                    <BookingPagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={handleCloseModals}
        onCancelBooking={handleCancelBooking}
        onOpenDisputeChat={handleOpenDisputeChat}
      />

      <CancellationModal
        booking={selectedBooking}
        isOpen={showCancelModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmCancellation}
        cancellationData={cancellationData}
        onDataChange={setCancellationData}
      />

      <DisputeChatModal
        booking={selectedBooking}
        isOpen={showDisputeChat}
        onClose={handleCloseModals}
      />
    </div>
  );
}
