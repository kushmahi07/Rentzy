
import { BookingRule } from './types';

export const mockBookingRules: BookingRule[] = [
  {
    id: '1',
    minDays: 3,
    maxDays: 14,
    blackoutDates: {
      start: '2024-12-24',
      end: '2024-12-26'
    },
    bookingBufferPeriod: 1,
    propertyLevelToggle: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    minDays: 7,
    maxDays: 30,
    blackoutDates: {
      start: '2024-07-04',
      end: '2024-07-04'
    },
    bookingBufferPeriod: 2,
    propertyLevelToggle: false,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    minDays: 1,
    maxDays: 7,
    blackoutDates: {
      start: '2024-11-28',
      end: '2024-11-29'
    },
    bookingBufferPeriod: 0,
    propertyLevelToggle: true,
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-25T11:20:00Z'
  },
  {
    id: '4',
    minDays: 5,
    maxDays: 21,
    blackoutDates: {
      start: '2024-08-15',
      end: '2024-08-17'
    },
    bookingBufferPeriod: 3,
    propertyLevelToggle: false,
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-22T13:45:00Z'
  }
];
