
import { PlatformFee } from './types';

export const mockPlatformFees: PlatformFee[] = [
  {
    id: '1',
    feeType: 'Flat',
    value: 50,
    appliesTo: 'Residential',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    feeType: '%',
    value: 3.5,
    appliesTo: 'Commercial',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    feeType: 'Flat',
    value: 75,
    appliesTo: 'Both',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
  {
    id: '4',
    feeType: '%',
    value: 2.8,
    appliesTo: 'Residential',
    createdAt: '2024-01-20T16:45:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
  },
  {
    id: '5',
    feeType: 'Flat',
    value: 125,
    appliesTo: 'Commercial',
    createdAt: '2024-01-22T11:20:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },
];
