
export interface PlatformFee {
  id: string;
  feeType: 'Flat' | '%';
  value: number;
  appliesTo: 'Residential' | 'Commercial' | 'Both';
  createdAt: string;
  updatedAt: string;
}

export interface PlatformFeeFiltersType {
  feeType: string;
  appliesTo: string;
}

export interface PlatformFeeFormData {
  feeType: 'Flat' | '%' | '';
  value: string;
  appliesTo: 'Residential' | 'Commercial' | 'Both' | '';
}
