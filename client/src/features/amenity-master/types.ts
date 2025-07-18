
export interface Amenity {
  id: string;
  name: string;
  type: 'Indoor' | 'Outdoor';
  icon?: string;
  iconFile?: File;
  createdAt: string;
  updatedAt: string;
}

export interface AmenityFormData {
  name: string;
  type: 'Indoor' | 'Outdoor' | '';
  icon?: string;
  iconFile?: File;
}

export interface AmenityFiltersType {
  search: string;
  type: 'All' | 'Indoor' | 'Outdoor';
}
