
export interface Location {
  id: string;
  city: string;
  country: string;
  status: 'Active' | 'Inactive';
  tag?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationFormData {
  city: string;
  country: string;
  status: 'Active' | 'Inactive';
  tag: string;
}

export interface LocationFilters {
  searchQuery: string;
  country: string;
  status: string;
}

export interface ValidationErrors {
  city?: string;
  country?: string;
  tag?: string;
  duplicate?: string;
}

export const COUNTRIES = [
  { value: 'USA', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
] as const;
