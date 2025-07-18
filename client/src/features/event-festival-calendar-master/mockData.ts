
import { EventFestival } from './types';

export const mockEventFestivals: EventFestival[] = [
  {
    id: '1',
    eventName: 'Aspen Food Festival',
    startDate: '2024-07-15',
    endDate: '2024-07-17',
    location: 'Aspen, Colorado',
    multiplier: 2.5,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    eventName: 'New York Fashion Week',
    startDate: '2024-09-08',
    endDate: '2024-09-15',
    location: 'New York, New York',
    multiplier: 3.0,
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    eventName: 'Miami Art Week',
    startDate: '2024-12-05',
    endDate: '2024-12-08',
    location: 'Miami, Florida',
    multiplier: 2.8,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    eventName: 'Sundance Film Festival',
    startDate: '2024-01-18',
    endDate: '2024-01-28',
    location: 'Park City, Utah',
    multiplier: 4.2,
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
  {
    id: '5',
    eventName: 'SXSW Festival',
    startDate: '2024-03-08',
    endDate: '2024-03-17',
    location: 'Austin, Texas',
    multiplier: 3.5,
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:20:00Z',
  },
];

// Mock locations from Location Master
export const mockLocations = [
  'Aspen, Colorado',
  'New York, New York',
  'Miami, Florida',
  'Park City, Utah',
  'Austin, Texas',
  'Los Angeles, California',
  'Chicago, Illinois',
  'Boston, Massachusetts',
  'Seattle, Washington',
  'Nashville, Tennessee',
];
