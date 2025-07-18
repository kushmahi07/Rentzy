
import { InvestorEarningsFormat } from './types';

export const mockInvestorEarningsFormats: InvestorEarningsFormat[] = [
  {
    id: '1',
    format: 'PDF',
    fieldsIncluded: ['Investor Name', 'Earnings', 'Date', 'Property Name', 'Token Holdings'],
    quarterStart: '2024-01-01',
    quarterEnd: '2024-03-31',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    format: 'CSV',
    fieldsIncluded: ['Investor Name', 'Earnings', 'Date', 'Quarterly ROI', 'Total Investment'],
    quarterStart: '2024-04-01',
    quarterEnd: '2024-06-30',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-01T10:00:00Z'
  },
  {
    id: '3',
    format: 'PDF',
    fieldsIncluded: ['Investor Name', 'Earnings', 'Date', 'Property Name', 'Dividends Paid', 'Market Value'],
    quarterStart: '2024-07-01',
    quarterEnd: '2024-09-30',
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-01T10:00:00Z'
  },
  {
    id: '4',
    format: 'CSV',
    fieldsIncluded: ['Investor Name', 'Earnings', 'Date', 'Capital Gains', 'Tax Information'],
    quarterStart: '2024-10-01',
    quarterEnd: '2024-12-31',
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z'
  },
  {
    id: '5',
    format: 'PDF',
    fieldsIncluded: ['Investor Name', 'Earnings', 'Date', 'Token Holdings', 'Percentage Owned', 'Quarterly ROI'],
    quarterStart: '2023-10-01',
    quarterEnd: '2023-12-31',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-01T10:00:00Z'
  }
];
