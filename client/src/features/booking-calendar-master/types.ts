
export interface BookingRule {
  id: string;
  minDays: number;
  maxDays: number;
  blackoutDates: {
    start: string;
    end: string;
  };
  bookingBufferPeriod: number;
  propertyLevelToggle: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRuleFilters {
  blackoutDateRange: {
    start: string;
    end: string;
  };
}

export interface BookingRuleFormData {
  minDays: number;
  maxDays: number;
  blackoutDates: {
    start: string;
    end: string;
  };
  bookingBufferPeriod: number;
  propertyLevelToggle: boolean;
}

export interface ValidationErrors {
  minDays?: string;
  maxDays?: string;
  blackoutDates?: string;
  bookingBufferPeriod?: string;
  general?: string;
}
