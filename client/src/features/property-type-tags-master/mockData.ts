
import { PropertyTypeTag } from './types';

export const mockPropertyTypeTags: PropertyTypeTag[] = [
  {
    id: '1',
    tagName: 'Villa',
    description: 'Luxurious standalone residential properties with private amenities',
    sortOrder: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    tagName: 'Beach House',
    description: 'Properties located near beaches with ocean views',
    sortOrder: 2,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    tagName: 'Penthouse',
    description: 'Top-floor luxury apartments with premium features',
    sortOrder: 3,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    tagName: 'Mountain Cabin',
    description: 'Cozy properties in mountainous regions perfect for retreats',
    sortOrder: 4,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '5',
    tagName: 'City Apartment',
    description: 'Modern apartments located in urban city centers',
    sortOrder: 5,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: '6',
    tagName: 'Historic Home',
    description: 'Properties with historical significance and period architecture',
    sortOrder: 6,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];
