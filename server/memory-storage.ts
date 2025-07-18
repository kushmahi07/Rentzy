import bcrypt from "bcrypt";
import { 
  type User, 
  type InsertUser, 
  type OtpSession, 
  type InsertOtpSession,
  type Property,
  type InsertProperty,
  type Booking,
  type InsertBooking,
  type Investment,
  type InsertInvestment,
  type UserActivity,
  type InsertUserActivity,
  type UserFilter,
  type MarketplaceListing,
  type InsertMarketplaceListing,
  type TradeLog,
  type InsertTradeLog,
  type InvestorListing,
  type InsertInvestorListing,
  type Setting,
  type InsertSetting,
  type ResidentialPropertyRecord,
  type InsertResidentialProperty
} from "@shared/schema";
import { IStorage } from "./storage";

export class MemoryStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private otpSessions: Map<number, OtpSession> = new Map();
  private properties: Map<number, Property> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private investments: Map<number, Investment> = new Map();
  private userActivities: Map<number, UserActivity> = new Map();
  private marketplaceListings: Map<number, MarketplaceListing> = new Map();
  private tradeLogs: Map<number, TradeLog> = new Map();
  private investorListings: Map<number, InvestorListing> = new Map();
  private settings: Map<number, Setting> = new Map();
  private residentialProperties: Map<number, ResidentialPropertyRecord> = new Map();

  private nextUserId = 1;
  private nextOtpSessionId = 1;
  private nextPropertyId = 1;
  private nextBookingId = 1;
  private nextInvestmentId = 1;
  private nextUserActivityId = 1;
  private nextMarketplaceListingId = 1;
  private nextTradeLogId = 1;
  private nextInvestorListingId = 1;
  private nextSettingId = 1;
  private nextResidentialPropertyId = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user (sync version)
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    const adminUser: User = {
      id: this.nextUserId++,
      name: "Admin User",
      email: "admin@rentzy.com",
      password: hashedPassword,
      mobile: "+1234567890",
      role: "admin",
      userRoles: [],
      permissions: [],
      isActive: true,
      kycStatus: "verified",
      fullName: "System Administrator",
      phoneNumber: "+1234567890",
      profilePicture: null,
      lastLoginAt: null,
      createdBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample properties for all three tabs
    this.initializeSampleProperties();
  }

  private initializeSampleProperties() {
    // Live Properties (status: 'live')
    const liveProperties: Property[] = [
      {
        id: this.nextPropertyId++,
        name: "Ocean View Villa",
        address: "123 Sunset Blvd, Miami Beach, FL 33139",
        city: "Miami Beach",
        state: "FL",
        description: "Stunning oceanfront villa with private beach access",
        totalTokens: 1000,
        tokenPrice: 250.00,
        tokensSold: 750,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        ownerName: "Sarah Johnson",
        ownerEmail: "sarah.johnson@email.com",
        liveDate: new Date('2024-02-20').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'luxury',
        homeValueEstimate: 2500000,
        squareFootage: 3500,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 2020,
        yearRenovated: null,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 46,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'OCEAN',
        tokenSymbol: 'OCN',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop'
        ],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf',
          hoa_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-hoa-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf',
          hoa_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-hoa-docs.pdf'
        },
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-20'),
      },
      {
        id: this.nextPropertyId++,
        name: "Downtown Loft",
        address: "789 Main St, New York, NY 10001",
        city: "New York",
        state: "NY",
        description: "Stylish downtown loft in the heart of Manhattan",
        totalTokens: 600,
        tokenPrice: 420.00,
        tokensSold: 480,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
        ownerName: "Michael Chen",
        ownerEmail: "michael.chen@email.com",
        liveDate: new Date('2024-03-05').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'urban',
        homeValueEstimate: 1800000,
        squareFootage: 2200,
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2018,
        yearRenovated: 2023,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 48,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'LOFT',
        tokenSymbol: 'LFT',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
        ],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-03-05'),
      },
      {
        id: this.nextPropertyId++,
        name: "Silicon Valley Tech Hub",
        address: "456 Innovation Dr, Palo Alto, CA 94301",
        city: "Palo Alto",
        state: "CA",
        description: "Modern office space in the heart of Silicon Valley",
        totalTokens: 800,
        tokenPrice: 500.00,
        tokensSold: 640,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        ownerName: "Lisa Wang",
        ownerEmail: "lisa.wang@email.com",
        liveDate: new Date('2024-01-15').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'commercial',
        market: 'tech',
        homeValueEstimate: 3000000,
        squareFootage: 5000,
        bedrooms: null,
        bathrooms: 4,
        yearBuilt: 2019,
        yearRenovated: null,
        zoningPermitsShortTerm: false,
        availableWeeksPerYear: 0,
        furnished: 'needs_setup',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'TECH',
        tokenSymbol: 'TCH',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'],
        videos: [],
        view360: [],
        documents: {
          commercial_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-commercial-deed.pdf',
          operating_statements: 'https://rentzy-docs.s3.amazonaws.com/sample-operating-statements.pdf',
          lease_agreements: 'https://rentzy-docs.s3.amazonaws.com/sample-lease-agreements.pdf'
        },
        documentsUploaded: {
          commercial_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-commercial-deed.pdf',
          operating_statements: 'https://rentzy-docs.s3.amazonaws.com/sample-operating-statements.pdf',
          lease_agreements: 'https://rentzy-docs.s3.amazonaws.com/sample-lease-agreements.pdf'
        },
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: this.nextPropertyId++,
        name: "Beverly Hills Mansion",
        address: "901 Rodeo Dr, Beverly Hills, CA 90210",
        city: "Beverly Hills",
        state: "CA",
        description: "Luxury mansion with pool and tennis court",
        totalTokens: 2000,
        tokenPrice: 750.00,
        tokensSold: 1800,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
        ownerName: "Robert Martinez",
        ownerEmail: "robert.martinez@email.com",
        liveDate: new Date('2024-03-10').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'luxury',
        homeValueEstimate: 8000000,
        squareFootage: 12000,
        bedrooms: 8,
        bathrooms: 10,
        yearBuilt: 2010,
        yearRenovated: 2022,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 30,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'BEVERLY',
        tokenSymbol: 'BVL',
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-10'),
      },
      {
        id: this.nextPropertyId++,
        name: "Chicago Penthouse",
        address: "234 Lake Shore Dr, Chicago, IL 60611",
        city: "Chicago",
        state: "IL",
        description: "Luxury penthouse with stunning lake views",
        totalTokens: 1200,
        tokenPrice: 300.00,
        tokensSold: 960,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        ownerName: "Jennifer Davis",
        ownerEmail: "jennifer.davis@email.com",
        liveDate: new Date('2024-02-25').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'urban',
        homeValueEstimate: 2800000,
        squareFootage: 4000,
        bedrooms: 3,
        bathrooms: 3,
        yearBuilt: 2016,
        yearRenovated: null,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 42,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'CHICAGO',
        tokenSymbol: 'CHI',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-25'),
      },
      {
        id: this.nextPropertyId++,
        name: "Austin Music District Condo",
        address: "567 South Lamar Blvd, Austin, TX 78704",
        city: "Austin",
        state: "TX",
        description: "Trendy condo in the heart of Austin's music scene",
        totalTokens: 500,
        tokenPrice: 180.00,
        tokensSold: 350,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        ownerName: "Carlos Rodriguez",
        ownerEmail: "carlos.rodriguez@email.com",
        liveDate: new Date('2024-03-20').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'urban',
        homeValueEstimate: 750000,
        squareFootage: 1200,
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2020,
        yearRenovated: null,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 50,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'AUSTIN',
        tokenSymbol: 'AUS',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-20'),
      },
      {
        id: this.nextPropertyId++,
        name: "Seattle Waterfront Apartment",
        address: "789 Alaskan Way, Seattle, WA 98101",
        city: "Seattle",
        state: "WA",
        description: "Modern apartment with Elliott Bay views",
        totalTokens: 700,
        tokenPrice: 220.00,
        tokensSold: 525,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        ownerName: "Amanda Thompson",
        ownerEmail: "amanda.thompson@email.com",
        liveDate: new Date('2024-01-30').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'urban',
        homeValueEstimate: 1600000,
        squareFootage: 1800,
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2017,
        yearRenovated: null,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 45,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'SEATTLE',
        tokenSymbol: 'SEA',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-30'),
      },
      {
        id: this.nextPropertyId++,
        name: "Boston Back Bay Townhouse",
        address: "345 Commonwealth Ave, Boston, MA 02115",
        city: "Boston",
        state: "MA",
        description: "Historic Victorian townhouse in prestigious Back Bay",
        totalTokens: 900,
        tokenPrice: 400.00,
        tokensSold: 720,
        status: 'live',
        thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
        ownerName: "Thomas Wilson",
        ownerEmail: "thomas.wilson@email.com",
        liveDate: new Date('2024-02-05').toISOString(),
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'historic',
        homeValueEstimate: 3200000,
        squareFootage: 4500,
        bedrooms: 5,
        bathrooms: 4,
        yearBuilt: 1890,
        yearRenovated: 2019,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 35,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'completed',
        tokenName: 'BOSTON',
        tokenSymbol: 'BOS',
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-05'),
      }
    ];

    // Pending Properties (status: 'pending')
    const pendingProperties: Property[] = [
      {
        id: this.nextPropertyId++,
        name: "Mountain Retreat Cabin",
        address: "321 Pine Valley Rd, Aspen, CO 81611",
        city: "Aspen",
        state: "CO",
        description: "Cozy mountain cabin surrounded by pristine nature",
        totalTokens: 500,
        tokenPrice: 180.00,
        tokensSold: 0,
        status: 'pending',
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        ownerName: "David Wilson",
        ownerEmail: "david.wilson@email.com",
        liveDate: null,
        rejectedDate: null,
        rejectionReason: null,
        propertyType: 'residential',
        market: 'mountain',
        homeValueEstimate: 1200000,
        squareFootage: 1800,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2015,
        yearRenovated: null,
        zoningPermitsShortTerm: true,
        availableWeeksPerYear: 40,
        furnished: 'yes',
        ownershipType: 'full_owner',
        allowsFractionalization: true,
        allowsRentziEquity: true,
        tokenizationStatus: 'not_started',
        tokenName: null,
        tokenSymbol: null,
        images: [
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        ],
        videos: [],
        view360: [],
        documents: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        documentsUploaded: {
          property_deed: 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf',
          tax_records: 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf',
          insurance_docs: 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf'
        },
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
      },
      {
        id: this.nextPropertyId++,
        name: "Historic Brownstone",
        address: "654 Heritage Ave, Boston, MA 02116",
        city: "Boston",
        state: "MA",
        description: "Beautifully restored 19th-century brownstone",
        totalTokens: 750,
        tokenPrice: 280.00,
        tokensSold: 0,
        status: 'pending',
        thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
        ownerName: "Emily Rodriguez",
        ownerEmail: "emily.rodriguez@email.com",
        liveDate: null,
        rejectedDate: null,
        rejectionReason: null,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-20'),
      },
      {
        id: this.nextPropertyId++,
        name: "Lakefront Property",
        address: "987 Lake Shore Dr, Chicago, IL 60601",
        city: "Chicago",
        state: "IL",
        description: "Spectacular lakefront property with private dock",
        totalTokens: 900,
        tokenPrice: 320.00,
        tokensSold: 0,
        status: 'pending',
        thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
        ownerName: "Robert Kim",
        ownerEmail: "robert.kim@email.com",
        liveDate: null,
        rejectedDate: null,
        rejectionReason: null,
        createdAt: new Date('2024-03-22'),
        updatedAt: new Date('2024-03-22'),
      }
    ];

    // Rejected Properties (status: 'rejected')
    const rejectedProperties: Property[] = [
      {
        id: this.nextPropertyId++,
        name: "Riverside Cottage",
        address: "987 River Bend Ln, Portland, OR 97201",
        city: "Portland",
        state: "OR",
        description: "Charming cottage by the Willamette River",
        totalTokens: 300,
        tokenPrice: 150.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        ownerName: "Jessica Taylor",
        ownerEmail: "jessica.taylor@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-22').toISOString(),
        rejectionReason: "Property documentation incomplete. Missing required permits and environmental reports.",
        propertyType: 'residential',
        market: 'suburban',
        homeValueEstimate: 800000,
        squareFootage: 1400,
        bedrooms: 2,
        bathrooms: 1,
        yearBuilt: 1995,
        yearRenovated: null,
        zoningPermitsShortTerm: false,
        availableWeeksPerYear: 30,
        furnished: 'no',
        ownershipType: 'full_owner',
        allowsFractionalization: false,
        allowsRentziEquity: false,
        tokenizationStatus: 'not_started',
        tokenName: null,
        tokenSymbol: null,
        images: [
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
        ],
        videos: [],
        view360: [],
        documents: {},
        documentsUploaded: {},
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-22'),
      },
      {
        id: this.nextPropertyId++,
        name: "Old Factory Warehouse",
        address: "456 Industrial Ave, Detroit, MI 48201",
        city: "Detroit",
        state: "MI",
        description: "Historic warehouse in industrial district",
        totalTokens: 200,
        tokenPrice: 80.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        ownerName: "Mark Stevens",
        ownerEmail: "mark.stevens@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-18').toISOString(),
        rejectionReason: "Property fails to meet minimum valuation requirements. Structural issues identified in inspection report.",
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-18'),
      },
      {
        id: this.nextPropertyId++,
        name: "Rural Farm Property",
        address: "789 County Road 45, Bakersfield, CA 93308",
        city: "Bakersfield",
        state: "CA",
        description: "Agricultural land with farmhouse",
        totalTokens: 500,
        tokenPrice: 100.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
        ownerName: "Patricia Miller",
        ownerEmail: "patricia.miller@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-12').toISOString(),
        rejectionReason: "Property type not suitable for tokenization platform. Agricultural properties currently not supported.",
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-03-12'),
      },
      {
        id: this.nextPropertyId++,
        name: "Strip Mall Complex",
        address: "123 Commerce Blvd, Las Vegas, NV 89102",
        city: "Las Vegas",
        state: "NV",
        description: "Small strip mall with retail spaces",
        totalTokens: 400,
        tokenPrice: 120.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        ownerName: "Steven Clark",
        ownerEmail: "steven.clark@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-20').toISOString(),
        rejectionReason: "Insufficient occupancy rate and financial performance. Property shows declining rental income over past 2 years.",
        createdAt: new Date('2024-03-08'),
        updatedAt: new Date('2024-03-20'),
      },
      {
        id: this.nextPropertyId++,
        name: "Flood Zone Cottage",
        address: "567 Bayou Dr, New Orleans, LA 70115",
        city: "New Orleans",
        state: "LA",
        description: "Historic cottage near the French Quarter",
        totalTokens: 350,
        tokenPrice: 180.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
        ownerName: "Michelle White",
        ownerEmail: "michelle.white@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-25').toISOString(),
        rejectionReason: "Property located in high-risk flood zone. Insurance requirements exceed platform risk tolerance.",
        createdAt: new Date('2024-03-12'),
        updatedAt: new Date('2024-03-25'),
      },
      {
        id: this.nextPropertyId++,
        name: "Mobile Home Park",
        address: "890 Trailer Park Rd, Phoenix, AZ 85004",
        city: "Phoenix",
        state: "AZ",
        description: "Mobile home community with 50 units",
        totalTokens: 250,
        tokenPrice: 60.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        ownerName: "Gary Johnson",
        ownerEmail: "gary.johnson@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-15').toISOString(),
        rejectionReason: "Property type does not meet platform standards. Mobile home parks not eligible for tokenization.",
        createdAt: new Date('2024-03-02'),
        updatedAt: new Date('2024-03-15'),
      },
      {
        id: this.nextPropertyId++,
        name: "Abandoned Shopping Center",
        address: "234 Mall Dr, Akron, OH 44308",
        city: "Akron",
        state: "OH",
        description: "Former shopping center requiring renovation",
        totalTokens: 100,
        tokenPrice: 50.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=300&fit=crop",
        ownerName: "Brian Anderson",
        ownerEmail: "brian.anderson@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-03-28').toISOString(),
        rejectionReason: "Property condition unacceptable. Extensive structural damage and environmental concerns identified.",
        createdAt: new Date('2024-03-18'),
        updatedAt: new Date('2024-03-28'),
      },
      {
        id: this.nextPropertyId++,
        name: "Disputed Ownership Property",
        address: "345 Legal Lane, Tampa, FL 33602",
        city: "Tampa",
        state: "FL",
        description: "Commercial building with retail spaces",
        totalTokens: 600,
        tokenPrice: 200.00,
        tokensSold: 0,
        status: 'rejected',
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        ownerName: "Laura Thomas",
        ownerEmail: "laura.thomas@email.com",
        liveDate: null,
        rejectedDate: new Date('2024-04-02').toISOString(),
        rejectionReason: "Legal ownership dispute identified. Cannot proceed until all legal matters are resolved and clear title is established.",
        createdAt: new Date('2024-03-22'),
        updatedAt: new Date('2024-04-02'),
      }
    ];

    // Add all properties to the storage
    [...liveProperties, ...pendingProperties, ...rejectedProperties].forEach(property => {
      this.properties.set(property.id, property);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.nextUserId++,
      ...user,
      userRoles: user.userRoles || [],
      permissions: user.permissions || [],
      isActive: true,
      kycStatus: "pending",
      fullName: user.name,
      phoneNumber: user.mobile,
      profilePicture: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async createOtpSession(session: InsertOtpSession): Promise<OtpSession> {
    const newSession: OtpSession = {
      id: this.nextOtpSessionId++,
      ...session,
      isUsed: false,
      resendCount: 0,
      createdAt: new Date(),
    };
    this.otpSessions.set(newSession.id, newSession);
    return newSession;
  }

  async getOtpSession(id: number): Promise<OtpSession | undefined> {
    return this.otpSessions.get(id);
  }

  async updateOtpSession(id: number, updates: Partial<OtpSession>): Promise<OtpSession | undefined> {
    const session = this.otpSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.otpSessions.set(id, updatedSession);
    return updatedSession;
  }

  async invalidateUserOtpSessions(userId: number): Promise<void> {
    for (const [id, session] of this.otpSessions) {
      if (session.userId === userId) {
        this.otpSessions.delete(id);
      }
    }
  }

  // Stub implementations for other methods
  async getUsers(filters?: UserFilter): Promise<{ users: User[]; totalCount: number }> {
    const allUsers = Array.from(this.users.values());
    return { users: allUsers, totalCount: allUsers.length };
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getPropertiesWithCounts(): Promise<Array<Property & { _count: { bookings: number; investments: number; userActivities: number; marketplaceListings: number; investorListings: number; } }>> {
    const properties = Array.from(this.properties.values());
    return properties.map(property => ({
      ...property,
      tokensSold: property.tokensSold || 0,
      _count: {
        bookings: Array.from(this.bookings.values()).filter(b => b.propertyId === property.id).length,
        investments: Array.from(this.investments.values()).filter(i => i.propertyId === property.id).length,
        userActivities: Array.from(this.userActivities.values()).filter(a => a.propertyId === property.id).length,
        marketplaceListings: Array.from(this.marketplaceListings.values()).filter(m => m.propertyId === property.id).length,
        investorListings: Array.from(this.investorListings.values()).filter(i => i.propertyId === property.id).length,
      }
    }));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const newProperty: Property = {
      id: this.nextPropertyId++,
      ...property,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(newProperty.id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;

    const updatedProperty = { ...property, ...updates, updatedAt: new Date() };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  async getBookings(userId?: number): Promise<Booking[]> {
    const allBookings = Array.from(this.bookings.values());
    return userId ? allBookings.filter(b => b.userId === userId) : allBookings;
  }

  async getInvestments(userId?: number): Promise<Investment[]> {
    const allInvestments = Array.from(this.investments.values());
    return userId ? allInvestments.filter(i => i.userId === userId) : allInvestments;
  }

  async getUserActivities(userId?: number): Promise<UserActivity[]> {
    const allActivities = Array.from(this.userActivities.values());
    return userId ? allActivities.filter(a => a.userId === userId) : allActivities;
  }

  async getDashboardMetrics(): Promise<any> {
    return {
      totalProperties: this.properties.size,
      tokensSold: 0,
      totalBookings: this.bookings.size,
      rentalPayouts: 0,
      pendingApprovals: 0,
    };
  }

  async getMarketplaceListings(): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values());
  }

  async getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined> {
    return this.marketplaceListings.get(id);
  }

  async updateMarketplaceListing(id: number, updates: Partial<MarketplaceListing>): Promise<MarketplaceListing | undefined> {
    const listing = this.marketplaceListings.get(id);
    if (!listing) return undefined;

    const updatedListing = { ...listing, ...updates, updatedAt: new Date() };
    this.marketplaceListings.set(id, updatedListing);
    return updatedListing;
  }

  async deleteMarketplaceListing(id: number): Promise<boolean> {
    return this.marketplaceListings.delete(id);
  }

  async getTradeLogs(listingId: number): Promise<TradeLog[]> {
    return Array.from(this.tradeLogs.values()).filter(log => log.listingId === listingId);
  }

  async getInvestorListings(): Promise<InvestorListing[]> {
    return Array.from(this.investorListings.values());
  }

  async getInvestorListing(id: number): Promise<InvestorListing | undefined> {
    return this.investorListings.get(id);
  }

  async updateInvestorListing(id: number, updates: Partial<InvestorListing>): Promise<InvestorListing | undefined> {
    const listing = this.investorListings.get(id);
    if (!listing) return undefined;

    const updatedListing = { ...listing, ...updates, updatedAt: new Date() };
    this.investorListings.set(id, updatedListing);
    return updatedListing;
  }

  async createInvestorListing(listing: InsertInvestorListing): Promise<InvestorListing> {
    const newListing: InvestorListing = {
      id: this.nextInvestorListingId++,
      ...listing,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.investorListings.set(newListing.id, newListing);
    return newListing;
  }

  async deleteInvestorListing(id: number): Promise<boolean> {
    return this.investorListings.delete(id);
  }

  async getTokenizationProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getTokenizationProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async updateTokenizationProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    return this.updateProperty(id, updates);
  }

  async createAdminActionLog(log: any): Promise<any> {
    // Stub implementation
    return log;
  }

  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async getSettingsByCategory(category: string): Promise<Setting[]> {
    return Array.from(this.settings.values()).filter(s => s.category === category);
  }

  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const setting = Array.from(this.settings.values()).find(s => s.key === key);
    if (!setting) return undefined;

    const updatedSetting = { ...setting, value, updatedAt: new Date() };
    this.settings.set(setting.id, updatedSetting);
    return updatedSetting;
  }

  async createSetting(setting: InsertSetting): Promise<Setting> {
    const newSetting: Setting = {
      id: this.nextSettingId++,
      ...setting,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.settings.set(newSetting.id, newSetting);
    return newSetting;
  }

  async createResidentialProperty(property: InsertResidentialProperty): Promise<ResidentialPropertyRecord> {
    const newProperty: ResidentialPropertyRecord = {
      id: this.nextResidentialPropertyId++,
      ...property,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.residentialProperties.set(newProperty.id, newProperty);
    return newProperty;
  }
}