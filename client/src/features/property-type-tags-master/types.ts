
export interface PropertyTypeTag {
  id: string;
  tagName: string;
  description: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyTypeTagFormData {
  tagName: string;
  description: string;
  sortOrder: number | '';
}

export interface PropertyTypeTagFiltersType {
  search: string;
}

export interface ValidationErrors {
  tagName?: string;
  description?: string;
  sortOrder?: string;
}
