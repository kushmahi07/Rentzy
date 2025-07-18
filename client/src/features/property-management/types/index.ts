
export interface Property {
  id: number;
  name: string;
  address: string;
  description: string | null;
  totalTokens: number;
  tokenPrice: number;
  status: 'live' | 'pending' | 'rejected';
  thumbnail: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerMobile?: string;
  listingType?: string;
  liveDate: string | null;
  rejectedDate: string | null;
  rejectionReason: string | null;
  
  // Property submission screening parameters
  propertyType: 'residential' | 'commercial';
  city: string;
  state: string;
  market: string;
  homeValueEstimate: number;
  squareFootage: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  yearRenovated?: number;
  zoningPermitsShortTerm: boolean;
  availableWeeksPerYear: number;
  furnished: 'yes' | 'no' | 'needs_setup';
  ownershipType: 'full_owner' | 'representative' | 'co_owner';
  allowsFractionalization: boolean;
  allowsRentziEquity: boolean;
  
  // Document upload status
  documentsUploaded?: { [key: string]: string };
  
  // Media files
  images?: string[];
  videos?: string[];
  view360?: string[];
  documents?: { [key: string]: string };
  
  // Tokenization fields
  tokenizationStatus: 'not_started' | 'in_progress' | 'completed' | 'failed';
  tokenName?: string;
  tokenSymbol?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCounts {
  live: number;
  pending: number;
  rejected: number;
}

export interface PropertyFormData {
  title: string;
  address: string;
  zipCode: string;
  buildingName: string;
  floorTower: string;
  areaLocalityPincode: string;
  city: string;
  nearbyLandmark: string;
  squareFootage: string;
  zoningClassification: string;
  nightlyRate: string;
  cleaningFee: string;
  bedrooms: string;
  bathrooms: string;
  guestCapacity: string;
  nightlyBaseRate: string;
  weekendRate: string;
  peakSeasonRate: string;
  minimumStay: string;
  houseRules: string;
  checkInTime: string;
  checkOutTime: string;
  localHighlights: string;
  featuredAmenities: string[];
  customAmenities: string;
  furnishingDescription: string;
  smartHomeFeatures: string;
  conciergeServices: string;
  virtualTourUrl: string;
  virtualTourLink: string;
  propertyPhotos: File[];
  propertyVideos: File[];
  view360: File[];
  roomDetails: any[];
  amenities: {
    parking: boolean;
    hvac: boolean;
    adaCompliance: boolean;
    elevator: boolean;
    security: boolean;
    conferenceRoom: boolean;
    kitchen: boolean;
    reception: boolean;
  };
  uploadedFiles: {
    rentRoll: File | null;
    incomeExpenseStatements: File | null;
    propertyDeed: File | null;
    zoningCertificate: File | null;
    certificateOfOccupancy: File | null;
    tenantLeases: File | null;
    environmentalReports: File | null;
  };
}

export interface ZipCodeValidation {
  isValidating: boolean;
  isValid: boolean | null;
  message: string;
}

export interface TokenizationForm {
  tokenCount: string;
  tokenRate: string;
  yieldExpectation: string;
  investmentEndDate: string;
}

export type PropertyCategory = 'commercial' | 'residential' | null;

export type PropertyStatus = 'live' | 'pending' | 'rejected';

export type MediaType = 'images' | 'videos' | '360';
