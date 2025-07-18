import { BookingData, ChatMessage } from './types';

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    sender: 'tenant',
    message: 'The property was not as described in the listing.',
    timestamp: '2025-01-10T10:30:00Z'
  },
  {
    id: '2',
    sender: 'bot',
    message: 'Thank you for reaching out. We have escalated your concern to our admin team.',
    timestamp: '2025-01-10T10:35:00Z'
  },
  {
    id: '3',
    sender: 'admin',
    message: 'We apologize for the inconvenience. Can you please provide more specific details about the discrepancies?',
    timestamp: '2025-01-10T11:00:00Z'
  },
  {
    id: '4',
    sender: 'tenant',
    message: 'The listing mentioned a pool, but there is no pool on the property.',
    timestamp: '2025-01-10T11:15:00Z'
  }
];

export const mockBookings: BookingData[] = [
  {
    id: '1',
    bookingId: 'BOOK001',
    propertyId: 'PROP001',
    propertyAddress: '123 Main St, New York, NY',
    homeownerName: 'Jane Smith',
    tenantName: 'John Doe',
    tenantEmail: 'john.doe@email.com',
    tenantPhone: '+1-555-0123',
    startDate: '2024-02-01',
    endDate: '2024-02-07',
    status: 'confirmed',
    totalPrice: 750.00,
    disputeStatus: 'none',
    paymentStatus: 'paid',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:22:00Z'
  },
  {
    id: '2',
    bookingId: 'BOOK002',
    propertyId: 'PROP002',
    propertyAddress: '456 Oak Ave, Los Angeles, CA',
    homeownerName: 'Michael Johnson',
    tenantName: 'Jane Smith',
    tenantEmail: 'jane.smith@email.com',
    tenantPhone: '+1-555-0124',
    startDate: '2024-02-15',
    endDate: '2024-02-22',
    status: 'pending',
    totalPrice: 920.00,
    disputeStatus: 'none',
    paymentStatus: 'pending',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    bookingId: 'BOOK003',
    propertyId: 'PROP003',
    propertyAddress: '789 Pine St, Chicago, IL',
    homeownerName: 'Sarah Williams',
    tenantName: 'Mike Johnson',
    tenantEmail: 'mike.johnson@email.com',
    tenantPhone: '+1-555-0125',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: 'completed',
    totalPrice: 540.00,
    disputeStatus: 'resolved',
    paymentStatus: 'paid',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-26T11:30:00Z',
    disputeReason: 'Property was not as described in the listing',
    chatHistory: [
      {
        id: 'msg1',
        sender: 'bot',
        message: 'Thank you for contacting support. How can we help you today?',
        timestamp: '2024-01-21T10:00:00Z'
      },
      {
        id: 'msg2',
        sender: 'tenant',
        message: 'The property had several issues that were not mentioned in the listing.',
        timestamp: '2024-01-21T10:05:00Z'
      },
      {
        id: 'msg3',
        sender: 'admin',
        message: 'We apologize for the inconvenience. We will investigate this matter and get back to you within 24 hours.',
        timestamp: '2024-01-21T14:30:00Z'
      }
    ]
  },
  {
    id: '4',
    bookingId: 'BOOK004',
    propertyId: 'PROP004',
    propertyAddress: '321 Elm Dr, Miami, FL',
    homeownerName: 'David Brown',
    tenantName: 'Sarah Wilson',
    tenantEmail: 'sarah.wilson@email.com',
    tenantPhone: '+1-555-0126',
    startDate: '2024-02-28',
    endDate: '2024-03-05',
    status: 'cancelled',
    totalPrice: 850.00,
    disputeStatus: 'none',
    paymentStatus: 'refunded',
    createdAt: '2024-01-25T13:20:00Z',
    updatedAt: '2024-02-01T08:45:00Z'
  },
  {
    id: '5',
    bookingId: 'BOOK005',
    propertyId: 'PROP005',
    propertyAddress: '654 Maple Ln, Seattle, WA',
    homeownerName: 'Emily Davis',
    tenantName: 'David Brown',
    tenantEmail: 'david.brown@email.com',
    tenantPhone: '+1-555-0127',
    startDate: '2024-03-10',
    endDate: '2024-03-17',
    status: 'confirmed',
    totalPrice: 1200.00,
    disputeStatus: 'open',
    paymentStatus: 'paid',
    createdAt: '2024-02-01T11:15:00Z',
    updatedAt: '2024-02-15T16:20:00Z',
    disputeReason: 'Cancellation requested due to family emergency',
    chatHistory: [
      {
        id: 'msg4',
        sender: 'bot',
        message: 'Welcome to the dispute resolution center. Please describe your issue.',
        timestamp: '2024-02-15T16:00:00Z'
      },
      {
        id: 'msg5',
        sender: 'tenant',
        message: 'I need to cancel my booking due to a family emergency. Can I get a full refund?',
        timestamp: '2024-02-15T16:05:00Z'
      }
    ]
  }
];