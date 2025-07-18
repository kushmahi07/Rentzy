import { z } from "zod";

// Base property schema for common fields
export const basePropertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  // Owner information
  ownerName: z.string().min(1, "Owner name is required"),
  ownerEmail: z.string().email("Valid email is required"),
  
  // Property details
  propertyType: z.enum(["residential", "commercial"]),
  squareFootage: z.number().min(1000, "Minimum 1000 square feet required"),
  yearBuilt: z.number().min(1900).max(new Date().getFullYear()).optional(),
  yearRenovated: z.number().min(1900).max(new Date().getFullYear()).optional(),
  
  // Tokenization details
  totalTokens: z.number().min(100, "Minimum 100 tokens required"),
  tokenPrice: z.number().min(1, "Token price must be at least $0.01"),
  tokenName: z.string().min(1, "Token name is required"),
  tokenSymbol: z.string().min(1, "Token symbol is required"),
  
  // Property value
  homeValueEstimate: z.number().min(150000000, "Minimum property value is $1.5M"), // In cents
  
  // Media files
  images: z.array(z.string()).min(1, "At least 1 image is required"),
  videos: z.array(z.string()).default([]),
  view360: z.array(z.string()).default([]),
  
  // Rental/investment details
  zoningPermitsShortTerm: z.boolean(),
  allowsFractionalization: z.boolean(),
  allowsRentziEquity: z.boolean(),
  
  // Optional fields
  thumbnail: z.string().optional(),
  documentsUploaded: z.record(z.boolean()).optional(),
});

// Residential property specific schema
export const residentialPropertySchema = basePropertySchema.extend({
  propertyType: z.literal("residential"),
  bedrooms: z.number().min(1, "At least 1 bedroom required"),
  bathrooms: z.number().min(1, "At least 1 bathroom required"),
  furnished: z.enum(["yes", "no", "needs_setup"]),
  ownershipType: z.enum(["full_owner", "representative", "co_owner"]),
  availableWeeksPerYear: z.number().min(1).max(52),
  
  // Rental specific fields
  nightlyBaseRate: z.number().min(10, "Minimum $10 per night"),
  weekendRate: z.number().min(10).optional(),
  peakSeasonRate: z.number().min(10).optional(),
  cleaningFee: z.number().min(5, "Minimum $5 cleaning fee"),
  minimumStay: z.number().min(1, "Minimum 1 night stay"),
  guestCapacity: z.number().min(1, "At least 1 guest capacity"),
  
  // Amenities
  featuredAmenities: z.array(z.string()).default([]),
  
  // Check-in/out details
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  houseRules: z.string().min(1, "House rules are required"),
  localHighlights: z.string().optional(),
});

// Commercial property specific schema
export const commercialPropertySchema = basePropertySchema.extend({
  propertyType: z.literal("commercial"),
  buildingType: z.enum(["office", "retail", "warehouse", "mixed_use", "hotel", "other"]),
  floors: z.number().min(1, "At least 1 floor required"),
  parkingSpaces: z.number().min(0),
  
  // Commercial specific fields
  monthlyRent: z.number().min(100, "Minimum $100 monthly rent"),
  leaseTermMonths: z.number().min(1, "Minimum 1 month lease"),
  securityDeposit: z.number().min(0),
  
  // Commercial amenities
  businessAmenities: z.array(z.string()).default([]),
  
  // Zoning and usage
  zoningType: z.string().min(1, "Zoning type is required"),
  allowedUsages: z.array(z.string()).min(1, "At least one allowed usage required"),
});

// Union type for any property
export const propertySchema = z.discriminatedUnion("propertyType", [
  residentialPropertySchema,
  commercialPropertySchema,
]);

// Create types from schemas
export type BaseProperty = z.infer<typeof basePropertySchema>;
export type ResidentialProperty = z.infer<typeof residentialPropertySchema>;
export type CommercialProperty = z.infer<typeof commercialPropertySchema>;
export type Property = z.infer<typeof propertySchema>;

// Schema for property updates (all fields optional)
export const propertyUpdateSchema = z.union([
  residentialPropertySchema.partial(),
  commercialPropertySchema.partial()
]);

// Schema for property filters/search
export const propertyFilterSchema = z.object({
  status: z.enum(["live", "pending", "rejected"]).optional(),
  propertyType: z.enum(["residential", "commercial"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minSquareFootage: z.number().optional(),
  maxSquareFootage: z.number().optional(),
  bedrooms: z.number().optional(), // For residential
  bathrooms: z.number().optional(), // For residential
  search: z.string().optional(), // Text search
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;