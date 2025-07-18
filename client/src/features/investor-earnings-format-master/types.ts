
export interface InvestorEarningsFormat {
  id: string;
  format: 'PDF' | 'CSV';
  fieldsIncluded: string[];
  quarterStart: string;
  quarterEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorEarningsFormatFilters {
  searchTerm: string;
  format: string;
}

export interface InvestorEarningsFormatFormData {
  format: 'PDF' | 'CSV' | '';
  fieldsIncluded: string[];
  quarterStart: string;
  quarterEnd: string;
}

export interface FormErrors {
  format?: string;
  fieldsIncluded?: string;
  quarterStart?: string;
  quarterEnd?: string;
  general?: string;
}

export const AVAILABLE_FIELDS = [
  'Investor Name',
  'Earnings',
  'Date',
  'Property Name',
  'Token Holdings',
  'Percentage Owned',
  'Quarterly ROI',
  'Total Investment',
  'Dividends Paid',
  'Market Value',
  'Capital Gains',
  'Tax Information'
];
