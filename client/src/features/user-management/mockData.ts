
import { BookingData, InvestmentData, ActivityData, PlatformUser } from './types';

export const sampleUsers: PlatformUser[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phoneNumber: "+1 (555) 123-4567",
    kycStatus: "verified",
    userRoles: ["renter", "investor"],
    registrationDate: "2024-01-15",
    lastLogin: "2024-06-30"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com", 
    phoneNumber: "+1 (555) 234-5678",
    kycStatus: "verified",
    userRoles: ["investor"],
    registrationDate: "2024-02-20",
    lastLogin: "2024-06-29"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phoneNumber: "+1 (555) 345-6789",
    kycStatus: "pending",
    userRoles: ["renter"],
    registrationDate: "2024-03-10",
    lastLogin: "2024-06-28"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phoneNumber: "+1 (555) 456-7890",
    kycStatus: "verified",
    userRoles: ["renter", "investor"],
    registrationDate: "2024-04-05",
    lastLogin: "2024-06-30"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@email.com",
    phoneNumber: "+1 (555) 567-8901",
    kycStatus: "rejected",
    userRoles: ["renter"],
    registrationDate: "2024-05-12",
    lastLogin: "2024-06-27"
  }
];

export const sampleBookings: Record<number, BookingData[]> = {
  1: [
    { id: "B001", propertyName: "Luxury Downtown Condo", checkIn: "2024-07-15", checkOut: "2024-07-22", status: "confirmed", bookingStatus: "Upcoming", amount: 2800, paymentType: "fiat", paymentStatus: "confirmed", transactionId: "TXN-001-2024-2800USD" },
    { id: "B002", propertyName: "Beachfront Villa", checkIn: "2024-06-01", checkOut: "2024-06-08", status: "completed", bookingStatus: "Completed", amount: 4200, paymentType: "crypto", paymentStatus: "confirmed", tokenSymbol: "USDC", tokenAmount: 4200, transactionId: "TXN-002-USDC-4200" },
    { id: "B003", propertyName: "Mountain Retreat", checkIn: "2024-08-10", checkOut: "2024-08-17", status: "pending", bookingStatus: "Upcoming", amount: 1900, paymentType: "fiat", paymentStatus: "pending", transactionId: "TXN-003-2024-1900USD" }
  ],
  3: [
    { id: "B004", propertyName: "City Apartment", checkIn: "2024-07-20", checkOut: "2024-07-25", status: "confirmed", bookingStatus: "Upcoming", amount: 1500, paymentType: "crypto", paymentStatus: "confirmed", tokenSymbol: "ETH", tokenAmount: 0.95, transactionId: "TXN-004-ETH-0.95" },
    { id: "B005", propertyName: "Suburban House", checkIn: "2024-05-15", checkOut: "2024-05-20", status: "completed", bookingStatus: "Completed", amount: 1200, paymentType: "fiat", paymentStatus: "confirmed", transactionId: "TXN-005-2024-1200USD" }
  ],
  4: [
    { id: "B006", propertyName: "Penthouse Suite", checkIn: "2024-08-01", checkOut: "2024-08-07", status: "confirmed", bookingStatus: "Upcoming", amount: 3500, paymentType: "fiat", paymentStatus: "confirmed", transactionId: "TXN-006-2024-3500USD" },
    { id: "B007", propertyName: "Lake House", checkIn: "2024-06-20", checkOut: "2024-06-27", status: "completed", bookingStatus: "Completed", amount: 2100, paymentType: "crypto", paymentStatus: "confirmed", tokenSymbol: "BTC", tokenAmount: 0.035, transactionId: "TXN-007-BTC-0.035" }
  ],
  // Add booking data for more user IDs to cover different scenarios
  "6876075ebea51c88afdc908d": [
    { id: "B008", propertyName: "Modern Studio Apartment", checkIn: "2024-09-01", checkOut: "2024-09-05", status: "confirmed", bookingStatus: "Upcoming", amount: 1200, paymentType: "fiat", paymentStatus: "confirmed", transactionId: "TXN-008-2024-1200USD" },
    { id: "B009", propertyName: "Cozy Beach House", checkIn: "2024-08-20", checkOut: "2024-08-25", status: "completed", bookingStatus: "Completed", amount: 1800, paymentType: "crypto", paymentStatus: "confirmed", tokenSymbol: "USDC", tokenAmount: 1800, transactionId: "TXN-009-USDC-1800" },
    { id: "B010", propertyName: "Downtown Loft", checkIn: "2024-10-15", checkOut: "2024-10-20", status: "cancelled", bookingStatus: "Cancelled", amount: 2200, paymentType: "fiat", paymentStatus: "pending", transactionId: "TXN-010-2024-2200USD" }
  ],
  "6875000dd1d4b57763feebb0": [
    { id: "B011", propertyName: "Riverside Cabin", checkIn: "2024-07-10", checkOut: "2024-07-15", status: "completed", bookingStatus: "Completed", amount: 900, paymentType: "fiat", paymentStatus: "confirmed", transactionId: "TXN-011-2024-900USD" },
    { id: "B012", propertyName: "Urban Penthouse", checkIn: "2024-09-12", checkOut: "2024-09-18", status: "confirmed", bookingStatus: "Upcoming", amount: 3200, paymentType: "crypto", paymentStatus: "Pending", tokenSymbol: "ETH", tokenAmount: 2.1, transactionId: "TXN-012-ETH-2.1" }
  ],
  // Default fallback for any other user IDs
  default: [
    { id: "B013", propertyName: "Charming Cottage", checkIn: "2024-08-05", checkOut: "2024-08-10", status: "confirmed", bookingStatus: "Upcoming", amount: 1400, paymentType: "fiat", paymentStatus: "confirmed", transactionId: "TXN-013-2024-1400USD" },
    { id: "B014", propertyName: "City View Suite", checkIn: "2024-07-25", checkOut: "2024-07-30", status: "completed", bookingStatus: "Completed", amount: 1600, paymentType: "crypto", paymentStatus: "confirmed", tokenSymbol: "USDC", tokenAmount: 1600, transactionId: "TXN-014-USDC-1600" }
  ]
};

export const sampleInvestments: Record<number, InvestmentData[]> = {
  1: [
    { id: "I001", propertyName: "Downtown Office Building", tokensOwned: 250, purchaseValue: 50000, currentValue: 54500, purchaseDate: "2024-01-20" },
    { id: "I002", propertyName: "Residential Complex A", tokensOwned: 150, purchaseValue: 30000, currentValue: 31200, purchaseDate: "2024-03-15" }
  ],
  2: [
    { id: "I003", propertyName: "Shopping Center Plaza", tokensOwned: 500, purchaseValue: 100000, currentValue: 108000, purchaseDate: "2024-02-25" },
    { id: "I004", propertyName: "Industrial Warehouse", tokensOwned: 300, purchaseValue: 60000, currentValue: 58200, purchaseDate: "2024-04-10" },
    { id: "I005", propertyName: "Luxury Resort", tokensOwned: 200, purchaseValue: 80000, currentValue: 85600, purchaseDate: "2024-05-05" }
  ],
  4: [
    { id: "I006", propertyName: "Tech Campus", tokensOwned: 180, purchaseValue: 72000, currentValue: 76320, purchaseDate: "2024-04-12" }
  ]
};

export const sampleActivities: Record<number, ActivityData[]> = {
  1: [
    { id: "A001", action: "Purchased 50 tokens in Downtown Office Building", timestamp: "2024-06-29 14:30" },
    { id: "A002", action: "Completed booking at Beachfront Villa", timestamp: "2024-06-28 09:15" },
    { id: "A003", action: "Updated profile information", timestamp: "2024-06-27 16:45" }
  ],
  2: [
    { id: "A004", action: "Invested in Luxury Resort property", timestamp: "2024-06-30 11:20" },
    { id: "A005", action: "Received dividend payment of $1,200", timestamp: "2024-06-25 10:00" }
  ],
  3: [
    { id: "A006", action: "Submitted KYC documentation", timestamp: "2024-06-28 13:45" },
    { id: "A007", action: "Made booking for City Apartment", timestamp: "2024-06-26 15:30" }
  ],
  4: [
    { id: "A008", action: "Sold 20 tokens from Tech Campus", timestamp: "2024-06-30 12:15" },
    { id: "A009", action: "Booked Penthouse Suite", timestamp: "2024-06-29 18:00" }
  ],
  5: [
    { id: "A010", action: "KYC verification failed", timestamp: "2024-06-27 14:20" },
    { id: "A011", action: "Attempted to update KYC documents", timestamp: "2024-06-26 11:30" }
  ]
};
