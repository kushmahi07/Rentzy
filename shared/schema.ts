import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define all tables first
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  mobile: text("mobile").notNull(),
  role: text("role", { enum: ["admin", "property_manager", "renter", "investor"] }).default("admin").notNull(),
  userRoles: jsonb("user_roles").$type<string[]>().default([]).notNull(), // For platform users with multiple roles
  permissions: jsonb("permissions").$type<string[]>().default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  kycStatus: text("kyc_status", { enum: ["verified", "pending", "rejected"] }).default("pending").notNull(),
  fullName: text("full_name"),
  phoneNumber: text("phone_number"),
  profilePicture: text("profile_picture"),
  lastLoginAt: timestamp("last_login_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const otpSessions = pgTable("otp_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  otp: text("otp").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  resendCount: integer("resend_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  totalTokens: integer("total_tokens").notNull(),
  tokenPrice: integer("token_price").notNull(), // Price in cents
  status: text("status", { enum: ["live", "pending", "rejected"] }).default("pending").notNull(),
  thumbnail: text("thumbnail"), // Property image URL
  ownerName: text("owner_name").notNull(),
  ownerEmail: text("owner_email").notNull(),
  liveDate: timestamp("live_date"), // When property went live
  rejectedDate: timestamp("rejected_date"), // When property was rejected
  rejectionReason: text("rejection_reason"), // Reason for rejection

  // Property submission screening parameters
  propertyType: text("property_type", { enum: ["residential", "commercial"] }).notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  market: text("market").notNull(), // From approved list
  homeValueEstimate: integer("home_value_estimate").notNull(), // In cents, min $1.5M
  squareFootage: integer("square_footage").notNull(), // Min 3,000 sqft
  bedrooms: integer("bedrooms"), // Min 3 for residential
  bathrooms: integer("bathrooms"), // Min 3 for residential  
  yearBuilt: integer("year_built"),
  yearRenovated: integer("year_renovated"),
  zoningPermitsShortTerm: boolean("zoning_permits_short_term").notNull(),
  availableWeeksPerYear: integer("available_weeks_per_year").notNull(), // Min 20
  furnished: text("furnished", { enum: ["yes", "no", "needs_setup"] }).notNull(),
  ownershipType: text("ownership_type", { enum: ["full_owner", "representative", "co_owner"] }).notNull(),
  allowsFractionalization: boolean("allows_fractionalization").notNull(),
  allowsRentziEquity: boolean("allows_rentzi_equity").notNull(),

  // Document upload status (JSON object tracking upload status)
  documentsUploaded: jsonb("documents_uploaded"), // {deed: true, title: false, etc.}

  // Media files
  images: jsonb("images").$type<string[]>().default([]).notNull(), // Property image URLs
  videos: jsonb("videos").$type<string[]>().default([]).notNull(), // Property video URLs
  view360: jsonb("view_360").$type<string[]>().default([]).notNull(), // 360-degree view URLs

  // Tokenization specific fields
  tokenName: text("token_name"), // e.g., "PROP001", "LUXURY-NYC"
  tokenSymbol: text("token_symbol"), // e.g., "PROP", "LUX"
  tokensIssued: integer("tokens_issued").default(0).notNull(), // Tokens actually minted
  tokensSold: integer("tokens_sold").default(0).notNull(), // Tokens sold to investors
  tokensAvailable: integer("tokens_available").default(0).notNull(), // Available for sale
  tokenSaleStatus: text("token_sale_status", { 
    enum: ["active", "paused", "frozen", "completed", "not_started"] 
  }).default("not_started").notNull(),
  secondaryTradingStatus: text("secondary_trading_status", { 
    enum: ["enabled", "disabled", "frozen"] 
  }).default("enabled").notNull(),
  mintingStatus: text("minting_status", { 
    enum: ["enabled", "disabled", "completed"] 
  }).default("enabled").notNull(),
  tokenizationStatus: text("tokenization_status", { 
    enum: ["not_started", "in_progress", "completed", "failed"] 
  }).default("not_started").notNull(),
  tokenContractAddress: text("token_contract_address"), // Blockchain contract address
  totalRaised: numeric("total_raised", { precision: 15, scale: 2 }).default("0.00"), // Total amount raised
  targetAmount: numeric("target_amount", { precision: 15, scale: 2 }), // Target fundraising amount
  saleStartDate: timestamp("sale_start_date"),
  saleEndDate: timestamp("sale_end_date"),
  lastActionAt: timestamp("last_action_at"), // Last admin action timestamp
  lastActionBy: integer("last_action_by").references(() => users.id), // Admin who performed last action
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  bookingId: text("booking_id").unique().notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  status: text("status", { enum: ["confirmed", "pending", "cancelled", "completed"] }).default("pending").notNull(),
  totalAmount: integer("total_amount").notNull(), // Amount in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  tokensOwned: integer("tokens_owned").notNull(),
  purchasePrice: integer("purchase_price").notNull(), // Total purchase price in cents
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  currentValue: integer("current_value").notNull(), // Current total value in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // registration, booking, investment, profile_update, etc.
  description: text("description").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  tokenSymbol: text("token_symbol").notNull(),
  tokenContractAddress: text("token_contract_address").notNull(),
  listedTokensCount: integer("listed_tokens_count").notNull(),
  pricePerToken: numeric("price_per_token", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"), // active, sold, cancelled, frozen
  ownerWallet: text("owner_wallet").notNull(),
  lastTradedDate: timestamp("last_traded_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tradeLogs = pgTable("trade_logs", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => marketplaceListings.id),
  tradeType: text("trade_type").notNull(), // buy, sell
  tokensTraded: integer("tokens_traded").notNull(),
  pricePerToken: numeric("price_per_token", { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  buyerWallet: text("buyer_wallet"),
  sellerWallet: text("seller_wallet"),
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const investorListings = pgTable("investor_listings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  userId: integer("user_id").notNull().references(() => users.id),
  tokenId: text("token_id").notNull(),
  sellerWallet: text("seller_wallet").notNull(),
  priceUSDT: numeric("price_usdt", { precision: 12, scale: 2 }).notNull(),
  tokensListed: integer("tokens_listed").notNull(),
  totalTokens: integer("total_tokens").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin action logs table
export const adminActionLogs = pgTable("admin_action_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // freeze_token_sale, freeze_secondary_trading, disable_minting, etc.
  entityType: text("entity_type").notNull(), // property, listing, etc.
  entityId: integer("entity_id").notNull(), // ID of the affected entity
  entityName: text("entity_name"), // Name/title of affected entity for easy reference
  previousState: jsonb("previous_state"), // State before action
  newState: jsonb("new_state"), // State after action
  reason: text("reason"), // Reason provided by admin
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // e.g., "general", "admin_preferences", "security"
  key: text("key").notNull(), // Setting identifier
  value: text("value").notNull(), // Setting value
  description: text("description"), // Human-readable description
  dataType: text("data_type", { enum: ["string", "number", "boolean", "json"] }).default("string").notNull(),
  isEditable: boolean("is_editable").default(true).notNull(),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Residential properties table
export const residentialProperties = pgTable("residential_properties", {
  id: serial("id").primaryKey(),

  // Basic property information
  title: text("title").notNull(),
  address: text("address").notNull(),
  zipCode: text("zip_code").notNull(),
  squareFootage: text("square_footage").notNull(),

  // Accommodation details
  bedrooms: text("bedrooms").notNull(),
  bathrooms: text("bathrooms").notNull(),
  guestCapacity: text("guest_capacity").notNull(),

  // Pricing information
  nightlyBaseRate: text("nightly_base_rate").notNull(),
  weekendRate: text("weekend_rate"),
  peakSeasonRate: text("peak_season_rate"),
  cleaningFee: text("cleaning_fee").notNull(),
  minimumStay: text("minimum_stay").notNull(),

  // Check-in/Check-out times
  checkInTime: text("check_in_time").notNull(),
  checkOutTime: text("check_out_time").notNull(),

  // Amenities and features
  featuredAmenities: jsonb("featured_amenities").$type<string[]>().default([]).notNull(),

  // Property rules and highlights
  houseRules: text("house_rules").notNull(),
  localHighlights: text("local_highlights"),

  // Photos
  propertyPhotos: jsonb("property_photos").$type<string[]>().default([]).notNull(),

  // Property category and status
  category: text("category", { enum: ["residential", "commercial"] }).default("residential").notNull(),
  status: text("status", { enum: ["pending", "live", "rejected"] }).default("pending").notNull(),
  rejectionReason: text("rejection_reason"),

  // Metadata
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  submittedBy: integer("submitted_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations after all tables
export const userRelations = relations(users, ({ one, many }) => ({
  creator: one(users, {
    fields: [users.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
  createdUsers: many(users, {
    relationName: "creator",
  }),
  bookings: many(bookings),
  investments: many(investments),
  activities: many(userActivities),
  investorListings: many(investorListings),
}));

export const propertyRelations = relations(properties, ({ many }) => ({
  bookings: many(bookings),
  investments: many(investments),
  marketplaceListings: many(marketplaceListings),
  investorListings: many(investorListings),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
}));

export const investmentRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [investments.propertyId],
    references: [properties.id],
  }),
}));

export const activityRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));

export const marketplaceListingRelations = relations(marketplaceListings, ({ one, many }) => ({
  property: one(properties, {
    fields: [marketplaceListings.propertyId],
    references: [properties.id],
  }),
  tradeLogs: many(tradeLogs),
}));

export const tradeLogRelations = relations(tradeLogs, ({ one }) => ({
  listing: one(marketplaceListings, {
    fields: [tradeLogs.listingId],
    references: [marketplaceListings.id],
  }),
}));

export const investorListingRelations = relations(investorListings, ({ one }) => ({
  property: one(properties, {
    fields: [investorListings.propertyId],
    references: [properties.id],
  }),
  user: one(users, {
    fields: [investorListings.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  mobile: true,
  role: true,
  permissions: true,
  createdBy: true,
});

export const insertOtpSessionSchema = createInsertSchema(otpSessions).pick({
  userId: true,
  otp: true,
  email: true,
  mobile: true,
  expiresAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const otpVerificationSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
  sessionId: z.string().min(1, "Session ID is required"),
});

export const propertyManagerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  role: z.literal("property_manager"),
  permissions: z.array(z.string()).min(1, "At least one permission must be selected"),
});

export const editPropertyManagerSchema = propertyManagerSchema.extend({
  id: z.number(),
});

// Permission constants
export const PERMISSIONS = {
  VIEW_EDIT_LISTINGS: "view_edit_listings",
  APPROVE_LISTINGS: "approve_listings", 
  FREEZE_TOKEN_SALE: "freeze_token_sale",
  VIEW_BOOKINGS: "view_bookings",
  APPROVE_TRADES: "approve_trades",
} as const;

export const PERMISSION_LABELS = {
  [PERMISSIONS.VIEW_EDIT_LISTINGS]: "View/Edit Listings",
  [PERMISSIONS.APPROVE_LISTINGS]: "Approve Listings",
  [PERMISSIONS.FREEZE_TOKEN_SALE]: "Freeze Token Sale",
  [PERMISSIONS.VIEW_BOOKINGS]: "View Bookings",
  [PERMISSIONS.APPROVE_TRADES]: "Approve Trades",
} as const;

// User management schemas
export const platformUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  userRoles: z.array(z.enum(["renter", "investor"])).min(1, "At least one role must be selected"),
  kycStatus: z.enum(["verified", "pending", "rejected"]).default("pending"),
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["renter", "investor", "both"]).optional(),
  kycStatus: z.enum(["verified", "pending", "rejected"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// Property schema for residential rental properties
export const residentialPropertySchema = z.object({
  // Basic property information
  title: z.string().min(1, "Property title is required"),
  address: z.string().min(1, "Address is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  squareFootage: z.string().min(1, "Square footage is required"),

  // Accommodation details
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  guestCapacity: z.string().min(1, "Guest capacity is required"),

  // Pricing information
  nightlyBaseRate: z.string().min(1, "Nightly base rate is required"),
  weekendRate: z.string().optional(),
  peakSeasonRate: z.string().optional(),
  cleaningFee: z.string().min(1, "Cleaning fee is required"),
  minimumStay: z.string().min(1, "Minimum stay is required"),

  // Check-in/Check-out times
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),

  // Amenities and features
  featuredAmenities: z.array(z.string()).default([]),

  // Property rules and highlights
  houseRules: z.string().min(1, "House rules are required"),
  localHighlights: z.string().optional(),

  // Photos
  propertyPhotos: z.array(z.any()).min(5, "At least 5 photos are required"),

  // Property category
  category: z.enum(["residential", "commercial"]).default("residential"),

  // Submission metadata
  status: z.enum(["pending", "live", "rejected"]).default("pending"),
  submittedAt: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectedAt: z.string().optional(),
  submittedBy: integer("submitted_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Legacy property schema (keeping for backward compatibility)
export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().optional(),
  totalTokens: z.number().min(1, "Total tokens must be at least 1"),
  tokenPrice: z.number().min(1, "Token price must be greater than 0"),
});

// Settings schemas
export const settingSchema = createInsertSchema(settings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdatedBy: true,
});

export const updateSettingSchema = z.object({
  value: z.string(),
});

export const updateSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })),
});

// Insert schema for residential properties
export const insertResidentialPropertySchema = createInsertSchema(residentialProperties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedBy: true,
  approvedAt: true,
  rejectedAt: true,
});

// Booking schema
export const bookingSchema = z.object({
  userId: z.number(),
  propertyId: z.number(),
  bookingId: z.string(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  totalAmount: z.number().min(0),
});

// Investment schema
export const investmentSchema = z.object({
  userId: z.number(),
  propertyId: z.number(),
  tokensOwned: z.number().min(1),
  purchasePrice: z.number().min(0),
  currentValue: z.number().min(0),
});

// Activity schema
export const activitySchema = z.object({
  userId: z.number(),
  activityType: z.string(),
  description: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const marketplaceListingSchema = z.object({
  propertyId: z.number(),
  tokenSymbol: z.string().min(1, "Token symbol is required"),
  tokenContractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  listedTokensCount: z.number().min(1, "Listed tokens count must be positive"),
  pricePerToken: z.number().min(0.01, "Price per token must be positive"),
  status: z.enum(["active", "sold", "cancelled", "frozen"]).default("active"),
  ownerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
  lastTradedDate: z.date().optional(),
});

export const tradeLogSchema = z.object({
  listingId: z.number(),
  tradeType: z.enum(["buy", "sell"]),
  tokensTraded: z.number().min(1, "Tokens traded must be positive"),
  pricePerToken: z.number().min(0.01, "Price per token must be positive"),
  totalAmount: z.number().min(0.01, "Total amount must be positive"),
  buyerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format").optional(),
  sellerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format").optional(),
  transactionHash: z.string().optional(),
});

export const investorListingSchema = z.object({
  propertyId: z.number(),
  userId: z.number(),
  tokenId: z.string().min(1, "Token ID is required"),
  sellerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
  priceUSDT: z.number().min(0.01, "Price must be positive"),
  tokensListed: z.number().min(1, "Tokens listed must be positive"),
  totalTokens: z.number().min(1, "Total tokens must be positive"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  rejectionReason: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOtpSession = z.infer<typeof insertOtpSessionSchema>;
export type OtpSession = typeof otpSessions.$inferSelect;
export type PropertyManagerData = z.infer<typeof propertyManagerSchema>;
export type EditPropertyManagerData = z.infer<typeof editPropertyManagerSchema>;

// New types for User Management
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof propertySchema>;
export type ResidentialProperty = z.infer<typeof residentialPropertySchema>;
export type ResidentialPropertyRecord = typeof residentialProperties.$inferSelect;
export type InsertResidentialProperty = z.infer<typeof insertResidentialPropertySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof bookingSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof investmentSchema>;
export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof activitySchema>;
export type PlatformUserData = z.infer<typeof platformUserSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;

// Marketplace types
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = z.infer<typeof marketplaceListingSchema>;
export type TradeLog = typeof tradeLogs.$inferSelect;
export type InsertTradeLog = z.infer<typeof tradeLogSchema>;

// Investment Oversight types
export type InvestorListing = typeof investorListings.$inferSelect;
export type InsertInvestorListing = z.infer<typeof investorListingSchema>;

// Settings types
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof settingSchema>;
export type UpdateSetting = z.infer<typeof updateSettingSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;