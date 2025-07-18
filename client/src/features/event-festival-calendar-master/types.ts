
export interface EventFestival {
  id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  location: string;
  multiplier: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventFestivalFormData {
  eventName: string;
  startDate: string;
  endDate: string;
  location: string;
  multiplier: number;
}

export interface EventFestivalFiltersType {
  location: string;
  startDate: string;
  endDate: string;
}

export interface ValidationErrors {
  eventName?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  multiplier?: string;
  general?: string;
}
