
import { BookingData } from './types';

// Enhanced mock data for homeowner properties bookings
export const homeownerBookingsData: Record<string, BookingData[]> = {
  'USER789': [ // Jane Smith
    {
      id: 'hb1',
      bookingId: 'BOOK789',
      propertyId: 'PROP012',
      propertyAddress: '456 Elm St, San Francisco, CA',
      homeownerName: 'Jane Smith',
      tenantName: 'John Doe',
      tenantEmail: 'john.doe@email.com',
      tenantPhone: '+1-555-0189',
      startDate: '2025-09-01',
      endDate: '2025-09-05',
      status: 'confirmed',
      totalPrice: 300.00,
      disputeStatus: 'none',
      paymentStatus: 'paid',
      createdAt: '2025-08-15T10:30:00Z',
      updatedAt: '2025-08-16T14:22:00Z'
    },
    {
      id: 'hb2',
      bookingId: 'BOOK790',
      propertyId: 'PROP013',
      propertyAddress: '789 Market St, San Francisco, CA',
      homeownerName: 'Jane Smith',
      tenantName: 'Alice Johnson',
      tenantEmail: 'alice.johnson@email.com',
      tenantPhone: '+1-555-0190',
      startDate: '2025-09-15',
      endDate: '2025-09-20',
      status: 'pending',
      totalPrice: 450.00,
      disputeStatus: 'none',
      paymentStatus: 'pending',
      createdAt: '2025-08-20T09:15:00Z',
      updatedAt: '2025-08-20T09:15:00Z'
    },
    {
      id: 'hb3',
      bookingId: 'BOOK791',
      propertyId: 'PROP012',
      propertyAddress: '456 Elm St, San Francisco, CA',
      homeownerName: 'Jane Smith',
      tenantName: 'Bob Wilson',
      tenantEmail: 'bob.wilson@email.com',
      tenantPhone: '+1-555-0191',
      startDate: '2025-08-10',
      endDate: '2025-08-15',
      status: 'completed',
      totalPrice: 375.00,
      disputeStatus: 'open',
      paymentStatus: 'paid',
      createdAt: '2025-07-25T16:45:00Z',
      updatedAt: '2025-08-16T11:30:00Z',
      disputeReason: 'Property cleanliness issues upon arrival',
      chatHistory: [
        {
          id: 'msg1',
          sender: 'bot',
          message: 'Hello! I\'m here to help resolve your dispute. Can you please describe the issue?',
          timestamp: '2025-08-16T10:00:00Z'
        },
        {
          id: 'msg2',
          sender: 'tenant',
          message: 'The property was not properly cleaned before my arrival. There were dishes in the sink and the bathroom needed attention.',
          timestamp: '2025-08-16T10:05:00Z'
        },
        {
          id: 'msg3',
          sender: 'admin',
          message: 'I apologize for this inconvenience. We will contact the homeowner immediately and arrange for professional cleaning. We\'ll also provide a partial refund for your trouble.',
          timestamp: '2025-08-16T14:30:00Z'
        }
      ]
    }
  ],
  'USER456': [ // Michael Johnson
    {
      id: 'hb4',
      bookingId: 'BOOK456',
      propertyId: 'PROP020',
      propertyAddress: '123 Ocean Dr, Miami, FL',
      homeownerName: 'Michael Johnson',
      tenantName: 'Sarah Davis',
      tenantEmail: 'sarah.davis@email.com',
      tenantPhone: '+1-555-0456',
      startDate: '2025-09-20',
      endDate: '2025-09-25',
      status: 'confirmed',
      totalPrice: 800.00,
      disputeStatus: 'none',
      paymentStatus: 'paid',
      createdAt: '2025-08-18T13:20:00Z',
      updatedAt: '2025-08-18T13:20:00Z'
    },
    {
      id: 'hb5',
      bookingId: 'BOOK457',
      propertyId: 'PROP021',
      propertyAddress: '456 Beach Ave, Miami, FL',
      homeownerName: 'Michael Johnson',
      tenantName: 'Mike Brown',
      tenantEmail: 'mike.brown@email.com',
      tenantPhone: '+1-555-0457',
      startDate: '2025-10-01',
      endDate: '2025-10-07',
      status: 'pending',
      totalPrice: 1050.00,
      disputeStatus: 'none',
      paymentStatus: 'pending',
      createdAt: '2025-08-25T11:15:00Z',
      updatedAt: '2025-08-25T11:15:00Z'
    }
  ],
  'USER123': [ // Sarah Williams
    {
      id: 'hb6',
      bookingId: 'BOOK123',
      propertyId: 'PROP030',
      propertyAddress: '789 Pine Ave, Denver, CO',
      homeownerName: 'Sarah Williams',
      tenantName: 'Emma Thompson',
      tenantEmail: 'emma.thompson@email.com',
      tenantPhone: '+1-555-0123',
      startDate: '2025-09-10',
      endDate: '2025-09-12',
      status: 'cancelled',
      totalPrice: 240.00,
      disputeStatus: 'none',
      paymentStatus: 'refunded',
      createdAt: '2025-08-20T10:30:00Z',
      updatedAt: '2025-09-01T08:45:00Z'
    }
  ],
  'USER321': [ // David Brown
    {
      id: 'hb7',
      bookingId: 'BOOK321',
      propertyId: 'PROP040',
      propertyAddress: '321 Mountain View Dr, Austin, TX',
      homeownerName: 'David Brown',
      tenantName: 'Chris Lee',
      tenantEmail: 'chris.lee@email.com',
      tenantPhone: '+1-555-0321',
      startDate: '2025-09-25',
      endDate: '2025-09-30',
      status: 'confirmed',
      totalPrice: 650.00,
      disputeStatus: 'resolved',
      paymentStatus: 'paid',
      createdAt: '2025-08-22T15:20:00Z',
      updatedAt: '2025-09-02T12:10:00Z',
      disputeReason: 'WiFi connectivity issues during stay',
      chatHistory: [
        {
          id: 'msg4',
          sender: 'bot',
          message: 'Thank you for contacting support regarding your booking. How can we assist you?',
          timestamp: '2025-08-30T09:00:00Z'
        },
        {
          id: 'msg5',
          sender: 'tenant',
          message: 'The WiFi was not working properly throughout my stay, which affected my work.',
          timestamp: '2025-08-30T09:05:00Z'
        },
        {
          id: 'msg6',
          sender: 'admin',
          message: 'We understand how important reliable internet is. We\'ve contacted the homeowner to upgrade the service and will provide a 20% discount on your next booking.',
          timestamp: '2025-08-30T14:15:00Z'
        }
      ]
    }
  ],
  'USER654': [ // Emily Davis
    {
      id: 'hb8',
      bookingId: 'BOOK654',
      propertyId: 'PROP050',
      propertyAddress: '654 Lake Shore Dr, Chicago, IL',
      homeownerName: 'Emily Davis',
      tenantName: 'Jennifer White',
      tenantEmail: 'jennifer.white@email.com',
      tenantPhone: '+1-555-0654',
      startDate: '2025-10-05',
      endDate: '2025-10-10',
      status: 'pending',
      totalPrice: 725.00,
      disputeStatus: 'none',
      paymentStatus: 'pending',
      createdAt: '2025-08-28T12:45:00Z',
      updatedAt: '2025-08-28T12:45:00Z'
    }
  ]
};
