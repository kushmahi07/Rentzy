
import { DocumentType } from './types';

export const MOCK_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: '1',
    documentName: 'Property Deed',
    propertyType: 'Residential',
    mandatory: true,
    acceptedFileTypes: ['pdf', 'doc', 'docx'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    documentName: 'Title Insurance',
    propertyType: 'Residential',
    mandatory: true,
    acceptedFileTypes: ['pdf'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    documentName: 'Property Tax Bill',
    propertyType: 'Residential',
    mandatory: true,
    acceptedFileTypes: ['pdf', 'jpg'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '4',
    documentName: 'HOA Documentation',
    propertyType: 'Residential',
    mandatory: false,
    acceptedFileTypes: ['pdf', 'doc', 'docx'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '5',
    documentName: 'Proof of Insurance',
    propertyType: 'Residential',
    mandatory: true,
    acceptedFileTypes: ['pdf'],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '6',
    documentName: 'Commercial Property Deed',
    propertyType: 'Commercial',
    mandatory: true,
    acceptedFileTypes: ['pdf', 'doc', 'docx'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '7',
    documentName: 'Operating Statements',
    propertyType: 'Commercial',
    mandatory: true,
    acceptedFileTypes: ['pdf', 'doc', 'docx'],
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '8',
    documentName: 'Tenant Lease Agreements',
    propertyType: 'Commercial',
    mandatory: true,
    acceptedFileTypes: ['pdf', 'doc', 'docx'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '9',
    documentName: 'Building Inspection Reports',
    propertyType: 'Commercial',
    mandatory: false,
    acceptedFileTypes: ['pdf', 'jpg'],
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: '10',
    documentName: 'Zoning Certificate',
    propertyType: 'Commercial',
    mandatory: true,
    acceptedFileTypes: ['pdf'],
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: '11',
    documentName: 'Environmental Reports',
    propertyType: 'Commercial',
    mandatory: false,
    acceptedFileTypes: ['pdf', 'doc', 'docx'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '12',
    documentName: 'Mortgage Statement',
    propertyType: 'Residential',
    mandatory: true,
    acceptedFileTypes: ['pdf', 'jpg'],
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26')
  }
];

export const FILE_TYPE_OPTIONS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'DOC' },
  { value: 'docx', label: 'DOCX' },
  { value: 'jpg', label: 'JPG' }
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' }
].filter(option => option.value && option.value.trim() !== '');
