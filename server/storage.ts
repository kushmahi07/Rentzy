import { 
  users, 
  otpSessions, 
  properties, 
  bookings, 
  investments, 
  userActivities,
  marketplaceListings,
  tradeLogs,
  investorListings,
  adminActionLogs,
  settings,
  residentialProperties,
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
import { db } from "./db";
import { eq, ilike, desc, count, and, or, gte, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createOtpSession(session: InsertOtpSession): Promise<OtpSession>;
  getOtpSession(id: number): Promise<OtpSession | undefined>;
  updateOtpSession(id: number, updates: Partial<OtpSession>): Promise<OtpSession | undefined>;
  invalidateUserOtpSessions(userId: number): Promise<void>;
  
  // Role Management operations
  getPropertyManagers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // User Management operations
  getPlatformUsers(filter?: UserFilter): Promise<User[]>;
  getPlatformUser(id: number): Promise<User | undefined>;
  createPlatformUser(user: Partial<User>): Promise<User>;
  updatePlatformUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getPropertiesByStatus(status: 'live' | 'pending' | 'rejected'): Promise<Property[]>;
  searchProperties(query: string, status?: 'live' | 'pending' | 'rejected'): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined>;
  updatePropertyFinancials(id: number, financials: { totalTokens: number; tokenPrice: number }): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getPropertyCounts(): Promise<{ live: number; pending: number; rejected: number }>;
  
  // Residential property operations
  createResidentialProperty(property: InsertResidentialProperty): Promise<ResidentialPropertyRecord>;
  
  // Booking operations
  getUserBookings(userId: number, limit?: number): Promise<(Booking & { property: Property })[]>;
  getActiveReservations(userId: number): Promise<(Booking & { property: Property })[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Investment operations
  getUserInvestments(userId: number): Promise<(Investment & { property: Property })[]>;
  getTotalTokensOwned(userId: number): Promise<number>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  
  // Activity operations
  getUserActivities(userId: number, limit?: number): Promise<UserActivity[]>;
  createActivity(activity: InsertUserActivity): Promise<UserActivity>;
  
  // Marketplace operations
  getMarketplaceListings(): Promise<(MarketplaceListing & { property: Property })[]>;
  getMarketplaceListing(id: number): Promise<(MarketplaceListing & { property: Property }) | undefined>;
  createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
  updateMarketplaceListing(id: number, updates: Partial<MarketplaceListing>): Promise<MarketplaceListing | undefined>;
  deleteMarketplaceListing(id: number): Promise<boolean>;
  getMarketplaceMetrics(): Promise<{
    totalListings: number;
    activeTrades: number;
    volumeTraded: number;
    averageTokenPrice: number;
  }>;
  
  // Trade operations
  getTradeLogs(listingId: number): Promise<TradeLog[]>;
  createTradeLog(trade: InsertTradeLog): Promise<TradeLog>;
  
  // Investment Oversight operations
  getInvestorListings(): Promise<(InvestorListing & { property: Property; user: User })[]>;
  getInvestorListing(id: number): Promise<(InvestorListing & { property: Property; user: User }) | undefined>;
  createInvestorListing(listing: InsertInvestorListing): Promise<InvestorListing>;
  updateInvestorListing(id: number, updates: Partial<InvestorListing>): Promise<InvestorListing | undefined>;
  deleteInvestorListing(id: number): Promise<boolean>;
  
  // Property Management operations
  approveProperty(propertyId: number, adminId: number): Promise<Property | undefined>;
  rejectProperty(propertyId: number, reason: string, adminId: number): Promise<Property | undefined>;
  requestPropertyResubmission(propertyId: number, comments: string, adminId: number): Promise<Property | undefined>;
  
  // Tokenization Dashboard operations
  getTokenizedProperties(filters?: {
    status?: string;
    dateFilter?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<Property[]>;
  updatePropertyTokenizationStatus(
    propertyId: number, 
    action: string, 
    adminId: number, 
    reason?: string
  ): Promise<Property | undefined>;
  logAdminAction(action: {
    adminId: number;
    action: string;
    entityType: string;
    entityId: number;
    entityName?: string;
    previousState?: any;
    newState?: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
  
  // Settings operations
  getSettings(): Promise<Setting[]>;
  getSettingsByCategory(category: string): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  updateSetting(key: string, value: string, adminId: number): Promise<Setting | undefined>;
  updateSettings(updates: { key: string; value: string }[], adminId: number): Promise<void>;
  createSetting(setting: InsertSetting): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createOtpSession(insertSession: InsertOtpSession): Promise<OtpSession> {
    const [session] = await db
      .insert(otpSessions)
      .values({
        ...insertSession,
        createdAt: new Date(),
        isUsed: false,
        resendCount: 0
      })
      .returning();
    return session;
  }

  async getOtpSession(id: number): Promise<OtpSession | undefined> {
    const [session] = await db.select().from(otpSessions).where(eq(otpSessions.id, id));
    return session || undefined;
  }

  async updateOtpSession(id: number, updates: Partial<OtpSession>): Promise<OtpSession | undefined> {
    const [session] = await db
      .update(otpSessions)
      .set(updates)
      .where(eq(otpSessions.id, id))
      .returning();
    return session || undefined;
  }

  async invalidateUserOtpSessions(userId: number): Promise<void> {
    await db.update(otpSessions)
      .set({ isUsed: true })
      .where(eq(otpSessions.userId, userId));
  }

  // Role Management operations
  async getPropertyManagers(): Promise<User[]> {
    const managers = await db.select().from(users).where(eq(users.role, "property_manager"));
    return managers;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // User Management operations
  async getPlatformUsers(filter?: UserFilter): Promise<User[]> {
    let query = db.select().from(users).$dynamic();
    
    // Filter by non-admin roles (platform users)
    query = query.where(eq(users.role, "renter")).or(eq(users.role, "investor"));
    
    if (filter?.search) {
      const searchTerm = `%${filter.search}%`;
      query = query.where(
        users.name.ilike(searchTerm)
          .or(users.email.ilike(searchTerm))
          .or(users.mobile.ilike(searchTerm))
      );
    }
    
    if (filter?.kycStatus) {
      query = query.where(eq(users.kycStatus, filter.kycStatus));
    }
    
    const platformUsers = await query;
    return platformUsers;
  }

  async getPlatformUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createPlatformUser(userData: Partial<User>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updatePlatformUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    // Get standard properties
    const standardProperties = await db.select().from(properties);
    
    // Get residential properties and map them to Property format
    const residentialProps = await db.select().from(residentialProperties);
    const mappedResidentialProperties = residentialProps.map(this.mapResidentialToProperty);
    
    // Combine and return
    return [...standardProperties, ...mappedResidentialProperties];
  }

  private mapResidentialToProperty(residential: ResidentialPropertyRecord): Property {
    return {
      id: residential.id,
      name: residential.title,
      address: residential.address,
      description: `${residential.bedrooms} bed, ${residential.bathrooms} bath rental property`,
      status: residential.status as 'live' | 'pending' | 'rejected',
      totalTokens: 1000, // Default for residential properties
      tokenPrice: Math.round(parseFloat(residential.nightlyBaseRate) * 100), // Convert daily rate to token price in cents
      tokensIssued: 0,
      tokensSold: 0,
      tokensAvailable: 1000,
      // Remove expectedAnnualReturn as it's not in Property type
      ownerName: 'Property Owner', // Default owner name
      ownerEmail: 'owner@example.com', // Default email
      createdAt: residential.createdAt,
      updatedAt: residential.updatedAt,
      submittedAt: residential.submittedAt,
      liveDate: null,
      rejectedDate: null,
      rejectionReason: null,
      // Required tokenization fields with defaults
      propertyType: 'residential' as const,
      city: 'City', // Would need to parse from address
      state: 'State', // Would need to parse from address  
      market: 'residential',
      homeValueEstimate: 150000000, // Default $1.5M in cents
      squareFootage: parseInt(residential.squareFootage) || 3000,
      bedrooms: parseInt(residential.bedrooms) || 3,
      bathrooms: parseInt(residential.bathrooms) || 3,
      yearBuilt: null,
      yearRenovated: null,
      zoningPermitsShortTerm: true,
      availableWeeksPerYear: 20,
      furnished: 'yes' as const,
      ownershipType: 'full_owner' as const,
      allowsFractionalization: false,
      allowsRentziEquity: false,
      documentsUploaded: null,
      images: [],
      videos: [],
      view360: [],
      tokenName: null,
      tokenSymbol: null,
      tokenSaleStatus: 'not_started' as const,
      secondaryTradingStatus: 'disabled' as const,
      mintingEnabled: true,
      minimumInvestment: 100000, // $1000 in cents
      maximumInvestment: 5000000, // $50000 in cents
      currentValuation: 150000000, // $1.5M in cents
      lastValuationDate: new Date(),
      propertyTaxAnnual: 1500000, // $15000 in cents
      insuranceAnnual: 120000, // $1200 in cents
      managementFeePercent: 0.10, // 10%
      platformFeePercent: 0.03, // 3%
      appreciationRate: 0.05, // 5%
      occupancyRate: 0.80, // 80%
      averageDailyRate: parseFloat(residential.nightlyBaseRate) || 200,
      seasonalMultiplier: 1.2,
      revenueGrowthRate: 0.03, // 3%
      operatingExpenseRatio: 0.40, // 40%
      capExReservePercent: 0.05, // 5%
      vacancyAllowancePercent: 0.05, // 5%
      financialDocumentsUploaded: false,
      lastActionBy: null,
      lastActionAt: null,
      adminNotes: null
    };
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getPropertiesByStatus(status: 'live' | 'pending' | 'rejected'): Promise<Property[]> {
    // Get standard properties
    const standardProperties = await db.select().from(properties).where(eq(properties.status, status));
    
    // Get residential properties and map them to Property format
    const residentialProps = await db.select().from(residentialProperties).where(eq(residentialProperties.status, status));
    const mappedResidentialProperties = residentialProps.map(this.mapResidentialToProperty);
    
    // Combine and return
    return [...standardProperties, ...mappedResidentialProperties];
  }

  async searchProperties(query: string, status?: 'live' | 'pending' | 'rejected'): Promise<Property[]> {
    let baseQuery = db.select().from(properties);
    
    if (status) {
      baseQuery = baseQuery.where(
        and(
          eq(properties.status, status),
          or(
            ilike(properties.name, `%${query}%`),
            ilike(properties.address, `%${query}%`),
            ilike(properties.ownerName, `%${query}%`)
          )
        )
      );
    } else {
      baseQuery = baseQuery.where(
        or(
          ilike(properties.name, `%${query}%`),
          ilike(properties.address, `%${query}%`),
          ilike(properties.ownerName, `%${query}%`)
        )
      );
    }
    
    return await baseQuery;
  }

  async createProperty(propertyData: InsertProperty): Promise<Property> {
    const [property] = await db
      .insert(properties)
      .values(propertyData)
      .returning();
    return property;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property || undefined;
  }

  async updatePropertyFinancials(id: number, financials: { totalTokens: number; tokenPrice: number }): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set({ 
        totalTokens: financials.totalTokens,
        tokenPrice: financials.tokenPrice,
        updatedAt: new Date() 
      })
      .where(eq(properties.id, id))
      .returning();
    return property || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getPropertyCounts(): Promise<{ live: number; pending: number; rejected: number }> {
    const liveCount = await db.select({ count: count() }).from(properties).where(eq(properties.status, 'live'));
    const pendingCount = await db.select({ count: count() }).from(properties).where(eq(properties.status, 'pending'));
    const rejectedCount = await db.select({ count: count() }).from(properties).where(eq(properties.status, 'rejected'));
    
    return {
      live: liveCount[0]?.count || 0,
      pending: pendingCount[0]?.count || 0,
      rejected: rejectedCount[0]?.count || 0,
    };
  }

  // Booking operations
  async getUserBookings(userId: number, limit = 3): Promise<(Booking & { property: Property })[]> {
    const userBookings = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        propertyId: bookings.propertyId,
        bookingId: bookings.bookingId,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        property: properties,
      })
      .from(bookings)
      .innerJoin(properties, eq(bookings.propertyId, properties.id))
      .where(eq(bookings.userId, userId))
      .orderBy(bookings.createdAt)
      .limit(limit);
    
    return userBookings as (Booking & { property: Property })[];
  }

  async getActiveReservations(userId: number): Promise<(Booking & { property: Property })[]> {
    const now = new Date();
    const activeReservations = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        propertyId: bookings.propertyId,
        bookingId: bookings.bookingId,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        property: properties,
      })
      .from(bookings)
      .innerJoin(properties, eq(bookings.propertyId, properties.id))
      .where(eq(bookings.userId, userId))
      .where(bookings.checkOutDate.gte(now))
      .orderBy(bookings.checkInDate);
    
    return activeReservations as (Booking & { property: Property })[];
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...bookingData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return booking;
  }

  // Investment operations
  async getUserInvestments(userId: number): Promise<(Investment & { property: Property })[]> {
    const userInvestments = await db
      .select({
        id: investments.id,
        userId: investments.userId,
        propertyId: investments.propertyId,
        tokensOwned: investments.tokensOwned,
        purchasePrice: investments.purchasePrice,
        purchaseDate: investments.purchaseDate,
        currentValue: investments.currentValue,
        createdAt: investments.createdAt,
        updatedAt: investments.updatedAt,
        property: properties,
      })
      .from(investments)
      .innerJoin(properties, eq(investments.propertyId, properties.id))
      .where(eq(investments.userId, userId))
      .orderBy(investments.purchaseDate);
    
    return userInvestments as (Investment & { property: Property })[];
  }

  async getTotalTokensOwned(userId: number): Promise<number> {
    const result = await db
      .select({ total: sql`SUM(${investments.tokensOwned})` })
      .from(investments)
      .where(eq(investments.userId, userId));
    
    return result[0]?.total || 0;
  }

  async createInvestment(investmentData: InsertInvestment): Promise<Investment> {
    const [investment] = await db
      .insert(investments)
      .values({
        ...investmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return investment;
  }

  // Activity operations
  async getUserActivities(userId: number, limit = 10): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(userActivities.createdAt)
      .limit(limit);
  }

  async createActivity(activityData: InsertUserActivity): Promise<UserActivity> {
    const [activity] = await db
      .insert(userActivities)
      .values({
        ...activityData,
        createdAt: new Date(),
      })
      .returning();
    return activity;
  }

  // Marketplace operations
  async getMarketplaceListings(): Promise<(MarketplaceListing & { property: Property })[]> {
    const listings = await db
      .select()
      .from(marketplaceListings)
      .innerJoin(properties, eq(marketplaceListings.propertyId, properties.id))
      .orderBy(desc(marketplaceListings.createdAt));

    return listings.map(row => ({
      ...row.marketplace_listings,
      property: row.properties
    }));
  }

  async getMarketplaceListing(id: number): Promise<(MarketplaceListing & { property: Property }) | undefined> {
    const result = await db
      .select()
      .from(marketplaceListings)
      .innerJoin(properties, eq(marketplaceListings.propertyId, properties.id))
      .where(eq(marketplaceListings.id, id))
      .limit(1);

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.marketplace_listings,
      property: row.properties
    };
  }

  async createMarketplaceListing(listingData: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const [listing] = await db.insert(marketplaceListings).values(listingData).returning();
    return listing;
  }

  async updateMarketplaceListing(id: number, updates: Partial<MarketplaceListing>): Promise<MarketplaceListing | undefined> {
    const [updatedListing] = await db
      .update(marketplaceListings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(marketplaceListings.id, id))
      .returning();

    return updatedListing;
  }

  async deleteMarketplaceListing(id: number): Promise<boolean> {
    const result = await db.delete(marketplaceListings).where(eq(marketplaceListings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getMarketplaceMetrics(): Promise<{
    totalListings: number;
    activeTrades: number;
    volumeTraded: number;
    averageTokenPrice: number;
  }> {
    // Get total listings count
    const totalListingsResult = await db
      .select({ count: count() })
      .from(marketplaceListings);
    
    const totalListings = totalListingsResult[0]?.count || 0;

    // Get active trades count (active status listings)
    const activeTradesResult = await db
      .select({ count: count() })
      .from(marketplaceListings)
      .where(eq(marketplaceListings.status, 'active'));
    
    const activeTrades = activeTradesResult[0]?.count || 0;

    // Get volume traded from trade logs
    const volumeResult = await db
      .select()
      .from(tradeLogs);
    
    const volumeTraded = volumeResult.reduce((total, trade) => {
      return total + Number(trade.totalAmount || 0);
    }, 0);

    // Get average token price from active listings
    const priceResult = await db
      .select()
      .from(marketplaceListings)
      .where(eq(marketplaceListings.status, 'active'));
    
    const averageTokenPrice = priceResult.length > 0
      ? priceResult.reduce((total, listing) => total + Number(listing.pricePerToken || 0), 0) / priceResult.length
      : 0;

    return {
      totalListings,
      activeTrades,
      volumeTraded,
      averageTokenPrice
    };
  }

  // Trade operations
  async getTradeLogs(listingId: number): Promise<TradeLog[]> {
    return await db
      .select()
      .from(tradeLogs)
      .where(eq(tradeLogs.listingId, listingId))
      .orderBy(desc(tradeLogs.createdAt));
  }

  async createTradeLog(tradeData: InsertTradeLog): Promise<TradeLog> {
    const [trade] = await db.insert(tradeLogs).values(tradeData).returning();
    return trade;
  }

  // Investment Oversight operations
  async getInvestorListings(): Promise<(InvestorListing & { property: Property; user: User })[]> {
    const listings = await db
      .select()
      .from(investorListings)
      .leftJoin(properties, eq(investorListings.propertyId, properties.id))
      .leftJoin(users, eq(investorListings.userId, users.id))
      .orderBy(desc(investorListings.createdAt));



    return listings.map(row => ({
      ...row.investor_listings,
      property: row.properties!,
      user: row.users!
    })) as (InvestorListing & { property: Property; user: User })[];
  }

  async getInvestorListing(id: number): Promise<(InvestorListing & { property: Property; user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(investorListings)
      .leftJoin(properties, eq(investorListings.propertyId, properties.id))
      .leftJoin(users, eq(investorListings.userId, users.id))
      .where(eq(investorListings.id, id));

    if (!result) return undefined;

    return {
      ...result.investor_listings,
      property: result.properties!,
      user: result.users!
    } as InvestorListing & { property: Property; user: User };
  }

  async createInvestorListing(listingData: InsertInvestorListing): Promise<InvestorListing> {
    const [listing] = await db.insert(investorListings).values(listingData).returning();
    return listing;
  }

  async updateInvestorListing(id: number, updates: Partial<InvestorListing>): Promise<InvestorListing | undefined> {
    const [listing] = await db
      .update(investorListings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(investorListings.id, id))
      .returning();
    return listing || undefined;
  }

  async deleteInvestorListing(id: number): Promise<boolean> {
    const result = await db.delete(investorListings).where(eq(investorListings.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Tokenization Dashboard methods
  async getTokenizedProperties(filters: {
    status?: string;
    dateFilter?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}): Promise<Property[]> {
    let query = db.select().from(properties);
    
    // Apply filters
    const conditions = [];
    
    // Only show completed tokenized properties
    conditions.push(eq(properties.tokenizationStatus, 'completed'));
    
    if (filters.status && filters.status !== 'all') {
      conditions.push(eq(properties.tokenizationStatus, filters.status));
    }
    
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const now = new Date();
      let dateThreshold: Date;
      
      switch (filters.dateFilter) {
        case 'today':
          dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateThreshold = new Date(0);
      }
      conditions.push(gte(properties.createdAt, dateThreshold));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder || 'desc';
    
    if (sortDirection === 'desc') {
      query = query.orderBy(desc(properties[sortField as keyof typeof properties] || properties.createdAt));
    } else {
      query = query.orderBy(properties[sortField as keyof typeof properties] || properties.createdAt);
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const offset = (page - 1) * limit;
    
    query = query.limit(limit).offset(offset);
    
    return await query;
  }

  async updatePropertyTokenizationStatus(
    propertyId: number,
    action: string,
    adminId: number,
    reason?: string
  ): Promise<Property | undefined> {
    // Get current property state
    const [currentProperty] = await db.select().from(properties).where(eq(properties.id, propertyId));
    if (!currentProperty) return undefined;

    // Validate business rules for each action
    switch (action) {
      case 'freeze_token_sale':
        if (currentProperty.tokenSaleStatus !== 'active') {
          throw new Error('Can only freeze token sale for properties with active token sale status');
        }
        break;
      case 'freeze_secondary_trading':
        if (currentProperty.secondaryTradingStatus !== 'enabled') {
          throw new Error('Can only freeze secondary trading for properties with enabled secondary trading');
        }
        break;
      case 'disable_minting':
        // Validate that property is tokenized and has ongoing sales with tokens sold
        if (currentProperty.tokenizationStatus !== 'completed') {
          throw new Error('Can only disable minting for completed tokenized properties');
        }
        if (currentProperty.tokenSaleStatus !== 'active') {
          throw new Error('Can only disable minting for properties with active token sales');
        }
        if (currentProperty.tokensSold <= 0) {
          throw new Error('Can only disable minting for properties with tokens already sold');
        }
        if (currentProperty.mintingStatus !== 'enabled') {
          throw new Error('Minting is already disabled for this property');
        }
        break;
    }

    const updates: Partial<Property> = {
      lastActionAt: new Date(),
      lastActionBy: adminId,
      updatedAt: new Date()
    };

    // Apply action-specific updates
    switch (action) {
      case 'freeze_token_sale':
        updates.tokenSaleStatus = 'frozen';
        break;
      case 'freeze_secondary_trading':
        updates.secondaryTradingStatus = 'frozen';
        break;
      case 'disable_minting':
        updates.mintingStatus = 'disabled';
        // Lock the token supply at current issued amount
        updates.totalTokens = currentProperty.tokensIssued;
        break;
      case 'unfreeze_token_sale':
        updates.tokenSaleStatus = 'active';
        break;
      case 'enable_secondary_trading':
        updates.secondaryTradingStatus = 'enabled';
        break;
      case 'enable_minting':
        updates.mintingStatus = 'enabled';
        break;
    }

    // Update the property
    const [updatedProperty] = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, propertyId))
      .returning();

    // Log the admin action
    await this.logAdminAction({
      adminId,
      action,
      entityType: 'property',
      entityId: propertyId,
      entityName: currentProperty.name,
      previousState: {
        tokenSaleStatus: currentProperty.tokenSaleStatus,
        secondaryTradingStatus: currentProperty.secondaryTradingStatus,
        mintingStatus: currentProperty.mintingStatus
      },
      newState: {
        tokenSaleStatus: updates.tokenSaleStatus || currentProperty.tokenSaleStatus,
        secondaryTradingStatus: updates.secondaryTradingStatus || currentProperty.secondaryTradingStatus,
        mintingStatus: updates.mintingStatus || currentProperty.mintingStatus
      },
      reason
    });

    return updatedProperty || undefined;
  }

  async logAdminAction(action: {
    adminId: number;
    action: string;
    entityType: string;
    entityId: number;
    entityName?: string;
    previousState?: any;
    newState?: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await db.insert(adminActionLogs).values({
      adminId: action.adminId,
      action: action.action,
      entityType: action.entityType,
      entityId: action.entityId,
      entityName: action.entityName,
      previousState: action.previousState,
      newState: action.newState,
      reason: action.reason,
      ipAddress: action.ipAddress,
      userAgent: action.userAgent
    });
  }

  // Property Management approval operations
  async approveProperty(propertyId: number, adminId: number): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        status: 'live',
        liveDate: new Date(),
        lastActionAt: new Date(),
        lastActionBy: adminId,
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId))
      .returning();

    if (updatedProperty) {
      // Log the approval action
      await this.logAdminAction({
        adminId,
        action: 'approve_property',
        entityType: 'property',
        entityId: propertyId,
        entityName: updatedProperty.name,
        previousState: { status: 'pending' },
        newState: { status: 'live', liveDate: updatedProperty.liveDate },
        reason: 'Property approved after review'
      });
    }

    return updatedProperty;
  }

  async rejectProperty(propertyId: number, reason: string, adminId: number): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        status: 'rejected',
        rejectedDate: new Date(),
        rejectionReason: reason,
        lastActionAt: new Date(),
        lastActionBy: adminId,
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId))
      .returning();

    if (updatedProperty) {
      // Log the rejection action
      await this.logAdminAction({
        adminId,
        action: 'reject_property',
        entityType: 'property',
        entityId: propertyId,
        entityName: updatedProperty.name,
        previousState: { status: 'pending' },
        newState: { status: 'rejected', rejectedDate: updatedProperty.rejectedDate },
        reason
      });
    }

    return updatedProperty;
  }

  async requestPropertyResubmission(propertyId: number, comments: string, adminId: number): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        rejectionReason: `Resubmission requested: ${comments}`,
        lastActionAt: new Date(),
        lastActionBy: adminId,
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId))
      .returning();

    if (updatedProperty) {
      // Log the resubmission request action
      await this.logAdminAction({
        adminId,
        action: 'request_resubmission',
        entityType: 'property',
        entityId: propertyId,
        entityName: updatedProperty.name,
        previousState: { status: 'pending' },
        newState: { status: 'pending', resubmissionRequested: true },
        reason: comments
      });
    }

    return updatedProperty;
  }

  // Settings operations
  async getSettings(): Promise<Setting[]> {
    const allSettings = await db.select().from(settings).orderBy(settings.category, settings.key);
    return allSettings;
  }

  async getSettingsByCategory(category: string): Promise<Setting[]> {
    const categorySettings = await db.select().from(settings).where(eq(settings.category, category)).orderBy(settings.key);
    return categorySettings;
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async updateSetting(key: string, value: string, adminId: number): Promise<Setting | undefined> {
    const [updatedSetting] = await db
      .update(settings)
      .set({
        value,
        lastUpdatedBy: adminId,
        updatedAt: new Date()
      })
      .where(eq(settings.key, key))
      .returning();

    return updatedSetting || undefined;
  }

  async updateSettings(updates: { key: string; value: string }[], adminId: number): Promise<void> {
    // Use a transaction to update multiple settings atomically
    for (const update of updates) {
      await this.updateSetting(update.key, update.value, adminId);
    }
  }

  async createSetting(setting: InsertSetting): Promise<Setting> {
    const [createdSetting] = await db.insert(settings).values(setting).returning();
    return createdSetting;
  }

  async createResidentialProperty(property: InsertResidentialProperty): Promise<ResidentialPropertyRecord> {
    const [createdProperty] = await db.insert(residentialProperties).values(property).returning();
    return createdProperty;
  }
}

import { MemoryStorage } from "./memory-storage";

export const storage = new MemoryStorage();
