import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Hooks
import { useUserManagement } from './hooks/useUserManagement';

// Components
import {
  UserSearchFilters,
  UserTable,
  UserProfileHeader,
  Pagination
} from './components';

// Mock data
import { sampleBookings, sampleInvestments, sampleActivities } from './mockData';

// Utils
import { getUserDisplayName, getUserRoleDisplay, calculateGainLoss } from './utils';

// Types
import { BookingData, InvestmentData, ActivityData } from './types';

export default function UserManagement() {
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    kycFilter,
    setKycFilter,
    selectedUser,
    showUserProfile,
    currentPage,
    setCurrentPage,
    users,
    pagination,
    userDetails,
    isLoading,
    isLoadingUserDetails,
    error,
    handleUserSelect,
    handleBackToUserList,
    downloadUserReport
  } = useUserManagement();

  // Booking details modal state
  const [showBookingDetails, setShowBookingDetails] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<BookingData | null>(null);

  const handleViewBookingDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleCloseBookingDetails = () => {
    setSelectedBooking(null);
    setShowBookingDetails(false);
  };

  // Render user profile full-page view
  if (showUserProfile && selectedUser) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToUserList}
            className="hover:text-blue-600 transition-colors"
          >
            User Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">User Profile</span>
        </div>

        {/* User Profile Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Profile Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <UserProfileHeader
              user={selectedUser}
              userDetails={userDetails}
              isLoading={isLoadingUserDetails}
              onDownloadReport={downloadUserReport}
            />
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* User Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{userDetails?.email || selectedUser.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{userDetails?.mobile || userDetails?.phoneNumber || selectedUser.mobile || selectedUser.phoneNumber || '+1234567890'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">KYC Status</p>
                <Badge className={
                  (userDetails?.kycStatus || userDetails?.kyc?.status || selectedUser.kycStatus || selectedUser.kyc?.status) === 'verified' ? 'bg-green-100 text-green-800' :
                  (userDetails?.kycStatus || userDetails?.kyc?.status || selectedUser.kycStatus || selectedUser.kyc?.status) === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }>
                  {(userDetails?.kycStatus || userDetails?.kyc?.status || selectedUser.kycStatus || selectedUser.kyc?.status || 'pending').charAt(0).toUpperCase() + (userDetails?.kycStatus || userDetails?.kyc?.status || selectedUser.kycStatus || selectedUser.kyc?.status || 'pending').slice(1)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">User Type</p>
                <p className="font-medium">{getUserRoleDisplay(userDetails?.userRoles || selectedUser.userRoles)}</p>
              </div>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue={(userDetails?.userRoles || selectedUser.userRoles)?.includes("renter") ? "renter" : "investor"}>
              <TabsList className="grid w-full grid-cols-3">
                {(userDetails?.userRoles || selectedUser.userRoles)?.includes("renter") && (
                  <TabsTrigger value="renter">Renter Profile</TabsTrigger>
                )}
                {(userDetails?.userRoles || selectedUser.userRoles)?.includes("investor") && (
                  <TabsTrigger value="investor">Investor Profile</TabsTrigger>
                )}
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              {/* Renter Tab Content */}
              {(userDetails?.userRoles || selectedUser.userRoles)?.includes("renter") && (
                <TabsContent value="renter" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>Complete booking history for this user</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const bookings = sampleBookings[selectedUser._id] || sampleBookings[selectedUser.id] || sampleBookings.default;
                        return bookings?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Booking ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Property Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">From Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">To Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Booking Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.id}</td>
                                  <td className="py-3 px-4 text-sm text-gray-900">{booking.propertyName}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600">{booking.checkIn}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600">{booking.checkOut}</td>
                                  <td className="py-3 px-4 text-sm">
                                    <Badge className={booking.paymentType === 'crypto' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                      {booking.paymentType === 'crypto' ? 'Crypto' : 'Fiat'}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {booking.paymentType === 'crypto' && booking.tokenAmount && booking.tokenSymbol ? (
                                      <div>
                                        <span>{booking.tokenAmount} {booking.tokenSymbol}</span>
                                        <div className="text-xs text-gray-500">(~${booking.amount.toLocaleString()})</div>
                                      </div>
                                    ) : (
                                      `$${booking.amount.toLocaleString()}`
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <Badge className={booking.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <Badge className={
                                      booking.bookingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                      booking.bookingStatus === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                      'bg-red-100 text-red-800'
                                    }>
                                      {booking.bookingStatus}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <Button size="sm" variant="outline" onClick={() => handleViewBookingDetails(booking)}>
                                      View Details
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No bookings found</p>
                      );
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Investor Tab Content */}
              {(userDetails?.userRoles || selectedUser.userRoles)?.includes("investor") && (
                <TabsContent value="investor" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Portfolio</CardTitle>
                      <CardDescription>All property investments by this user</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {sampleInvestments[selectedUser._id]?.length > 0 ? (
                        <div className="space-y-4">
                          {sampleInvestments[selectedUser._id].map((investment) => {
                            const gainLoss = calculateGainLoss(investment.purchaseValue, investment.currentValue);
                            return (
                              <div key={investment.id} className="border rounded-lg p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium">{investment.propertyName}</h4>
                                    <p className="text-sm text-gray-600">{investment.tokensOwned} tokens</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">${investment.currentValue.toLocaleString()}</p>
                                    <p className={`text-sm ${gainLoss.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                      {gainLoss.isPositive ? '+' : ''}{gainLoss.percentage}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No investments found</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Activity Tab Content */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest user actions and transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sampleActivities[selectedUser._id]?.length > 0 ? (
                      <div className="space-y-4">
                        {sampleActivities[selectedUser._id].map((activity) => (
                          <div key={activity.id} className="border rounded-lg p-4">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">No recent activity</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Booking Details Modal */}
        <Dialog open={showBookingDetails} onOpenChange={handleCloseBookingDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {selectedBooking.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount</p>
                  <p className="font-semibold">${selectedBooking.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge className={selectedBooking.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        
      </div>
    );
  }

  // Render user list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage platform users and view detailed profiles</p>
        </div>
      </div>

      {/* Search and Filters */}
      <UserSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        kycFilter={kycFilter}
        setKycFilter={setKycFilter}
      />

      {/* Platform Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Users ({pagination?.totalUsers || 0})
          </CardTitle>
          <CardDescription>
            View and manage all registered platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            onUserSelect={handleUserSelect}
            isLoading={isLoading}
            error={error}
          />

          {/* Pagination */}
          {pagination && (
            <Pagination
              currentPage={currentPage}
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}