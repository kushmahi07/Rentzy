
export interface SubscriptionAgreement {
  id: string;
  agreementName: string;
  documentFilename: string;
  documentUrl: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionAgreementFormData {
  agreementName: string;
  document: File | null;
  version: string;
}

export interface SubscriptionAgreementFilters {
  searchTerm: string;
}

export interface ValidationErrors {
  agreementName?: string;
  document?: string;
  version?: string;
}
