
export interface DocumentType {
  id: string;
  documentName: string;
  propertyType: 'Residential' | 'Commercial';
  mandatory: boolean;
  acceptedFileTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTypeFormData {
  documentName: string;
  propertyType: 'Residential' | 'Commercial' | '';
  mandatory: boolean;
  acceptedFileTypes: string[];
}

export interface DocumentTypeFilters {
  propertyType: string;
  searchTerm: string;
}

export interface ValidationErrors {
  documentName?: string;
  propertyType?: string;
  acceptedFileTypes?: string;
}
