import { IStorage } from "../backend/src/storage/mongodb-storage";
import { DatabaseStorage } from "./storage";

// Mock MongoDB storage that uses the existing DatabaseStorage but with string IDs
export class MockMongoStorage implements IStorage {
  private dbStorage: DatabaseStorage;

  constructor() {
    this.dbStorage = new DatabaseStorage();
  }

  // Convert number ID to string and vice versa for compatibility
  private toStringId(id: number): string {
    return id.toString();
  }

  private toNumberId(id: string): number {
    return parseInt(id, 10);
  }

  async getUser(id: string): Promise<any> {
    const user = await this.dbStorage.getUser(this.toNumberId(id));
    if (user) {
      return { ...user, _id: this.toStringId(user.id) };
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.dbStorage.getUserByEmail(email);
    if (user) {
      return { ...user, _id: this.toStringId(user.id) };
    }
    return null;
  }

  async createUser(user: any): Promise<any> {
    const created = await this.dbStorage.createUser(user);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async createOtpSession(session: any): Promise<any> {
    const created = await this.dbStorage.createOtpSession({
      ...session,
      userId: this.toNumberId(session.userId)
    });
    return { ...created, _id: this.toStringId(created.id) };
  }

  async getOtpSession(id: string): Promise<any> {
    const session = await this.dbStorage.getOtpSession(this.toNumberId(id));
    if (session) {
      return { ...session, _id: this.toStringId(session.id) };
    }
    return null;
  }

  async updateOtpSession(id: string, updates: any): Promise<any> {
    const updated = await this.dbStorage.updateOtpSession(this.toNumberId(id), updates);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async invalidateUserOtpSessions(userId: string): Promise<void> {
    await this.dbStorage.invalidateUserOtpSessions(this.toNumberId(userId));
  }

  async getPropertyManagers(): Promise<any[]> {
    const managers = await this.dbStorage.getPropertyManagers();
    return managers.map(m => ({ ...m, _id: this.toStringId(m.id) }));
  }

  async updateUser(id: string, updates: any): Promise<any> {
    const updated = await this.dbStorage.updateUser(this.toNumberId(id), updates);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.dbStorage.deleteUser(this.toNumberId(id));
  }

  async getPlatformUsers(filter?: any): Promise<any[]> {
    const users = await this.dbStorage.getPlatformUsers(filter);
    return users.map(u => ({ ...u, _id: this.toStringId(u.id) }));
  }

  async getPlatformUser(id: string): Promise<any> {
    const user = await this.dbStorage.getPlatformUser(this.toNumberId(id));
    if (user) {
      return { ...user, _id: this.toStringId(user.id) };
    }
    return null;
  }

  async createPlatformUser(user: any): Promise<any> {
    const created = await this.dbStorage.createPlatformUser(user);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async updatePlatformUser(id: string, updates: any): Promise<any> {
    const updated = await this.dbStorage.updatePlatformUser(this.toNumberId(id), updates);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async getProperties(): Promise<any[]> {
    const properties = await this.dbStorage.getProperties();
    return properties.map(p => ({ ...p, _id: this.toStringId(p.id) }));
  }

  async getPropertiesByStatus(status: 'live' | 'pending' | 'rejected'): Promise<any[]> {
    const properties = await this.dbStorage.getPropertiesByStatus(status);
    return properties.map(p => ({ ...p, _id: this.toStringId(p.id) }));
  }

  async searchProperties(query: string, status?: 'live' | 'pending' | 'rejected'): Promise<any[]> {
    const properties = await this.dbStorage.searchProperties(query, status);
    return properties.map(p => ({ ...p, _id: this.toStringId(p.id) }));
  }

  async getProperty(id: string): Promise<any> {
    const property = await this.dbStorage.getProperty(this.toNumberId(id));
    if (property) {
      return { ...property, _id: this.toStringId(property.id) };
    }
    return null;
  }

  async createProperty(property: any): Promise<any> {
    const created = await this.dbStorage.createProperty(property);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async updateProperty(id: string, updates: any): Promise<any> {
    const updated = await this.dbStorage.updateProperty(this.toNumberId(id), updates);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async updatePropertyFinancials(id: string, financials: { totalTokens: number; tokenPrice: number }): Promise<any> {
    const updated = await this.dbStorage.updatePropertyFinancials(this.toNumberId(id), financials);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return await this.dbStorage.deleteProperty(this.toNumberId(id));
  }

  async getPropertyCounts(): Promise<{ live: number; pending: number; rejected: number }> {
    return await this.dbStorage.getPropertyCounts();
  }

  async createResidentialProperty(property: any): Promise<any> {
    const created = await this.dbStorage.createResidentialProperty(property);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async getUserBookings(userId: string, limit?: number): Promise<any[]> {
    const bookings = await this.dbStorage.getUserBookings(this.toNumberId(userId), limit);
    return bookings.map(b => ({ ...b, _id: this.toStringId(b.id) }));
  }

  async getActiveReservations(userId: string): Promise<any[]> {
    const reservations = await this.dbStorage.getActiveReservations(this.toNumberId(userId));
    return reservations.map(r => ({ ...r, _id: this.toStringId(r.id) }));
  }

  async createBooking(booking: any): Promise<any> {
    const created = await this.dbStorage.createBooking(booking);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async getUserInvestments(userId: string): Promise<any[]> {
    const investments = await this.dbStorage.getUserInvestments(this.toNumberId(userId));
    return investments.map(i => ({ ...i, _id: this.toStringId(i.id) }));
  }

  async getTotalTokensOwned(userId: string): Promise<number> {
    return await this.dbStorage.getTotalTokensOwned(this.toNumberId(userId));
  }

  async createInvestment(investment: any): Promise<any> {
    const created = await this.dbStorage.createInvestment(investment);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async getUserActivities(userId: string, limit?: number): Promise<any[]> {
    const activities = await this.dbStorage.getUserActivities(this.toNumberId(userId), limit);
    return activities.map(a => ({ ...a, _id: this.toStringId(a.id) }));
  }

  async createActivity(activity: any): Promise<any> {
    const created = await this.dbStorage.createActivity(activity);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async getMarketplaceListings(): Promise<any[]> {
    const listings = await this.dbStorage.getMarketplaceListings();
    return listings.map(l => ({ ...l, _id: this.toStringId(l.id) }));
  }

  async getMarketplaceListing(id: string): Promise<any> {
    const listing = await this.dbStorage.getMarketplaceListing(this.toNumberId(id));
    if (listing) {
      return { ...listing, _id: this.toStringId(listing.id) };
    }
    return null;
  }

  async createMarketplaceListing(listing: any): Promise<any> {
    const created = await this.dbStorage.createMarketplaceListing(listing);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async updateMarketplaceListing(id: string, updates: any): Promise<any> {
    const updated = await this.dbStorage.updateMarketplaceListing(this.toNumberId(id), updates);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async deleteMarketplaceListing(id: string): Promise<boolean> {
    return await this.dbStorage.deleteMarketplaceListing(this.toNumberId(id));
  }

  async getMarketplaceMetrics(): Promise<{
    totalListings: number;
    activeTrades: number;
    volumeTraded: number;
    averageTokenPrice: number;
  }> {
    return await this.dbStorage.getMarketplaceMetrics();
  }

  async getTradeLogs(listingId: string): Promise<any[]> {
    const logs = await this.dbStorage.getTradeLogs(this.toNumberId(listingId));
    return logs.map(l => ({ ...l, _id: this.toStringId(l.id) }));
  }

  async createTradeLog(trade: any): Promise<any> {
    const created = await this.dbStorage.createTradeLog(trade);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async getInvestorListings(): Promise<any[]> {
    const listings = await this.dbStorage.getInvestorListings();
    return listings.map(l => ({ ...l, _id: this.toStringId(l.id) }));
  }

  async getInvestorListing(id: string): Promise<any> {
    const listing = await this.dbStorage.getInvestorListing(this.toNumberId(id));
    if (listing) {
      return { ...listing, _id: this.toStringId(listing.id) };
    }
    return null;
  }

  async createInvestorListing(listing: any): Promise<any> {
    const created = await this.dbStorage.createInvestorListing(listing);
    return { ...created, _id: this.toStringId(created.id) };
  }

  async updateInvestorListing(id: string, updates: any): Promise<any> {
    const updated = await this.dbStorage.updateInvestorListing(this.toNumberId(id), updates);
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async deleteInvestorListing(id: string): Promise<boolean> {
    return await this.dbStorage.deleteInvestorListing(this.toNumberId(id));
  }

  async approveProperty(propertyId: string, adminId: string): Promise<any> {
    const updated = await this.dbStorage.approveProperty(this.toNumberId(propertyId), this.toNumberId(adminId));
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async rejectProperty(propertyId: string, reason: string, adminId: string): Promise<any> {
    const updated = await this.dbStorage.rejectProperty(this.toNumberId(propertyId), reason, this.toNumberId(adminId));
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async requestPropertyResubmission(propertyId: string, comments: string, adminId: string): Promise<any> {
    const updated = await this.dbStorage.requestPropertyResubmission(this.toNumberId(propertyId), comments, this.toNumberId(adminId));
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async getTokenizedProperties(filters?: any): Promise<any[]> {
    const properties = await this.dbStorage.getTokenizedProperties(filters);
    return properties.map(p => ({ ...p, _id: this.toStringId(p.id) }));
  }

  async updatePropertyTokenizationStatus(
    propertyId: string,
    action: string,
    adminId: string,
    reason?: string
  ): Promise<any> {
    const updated = await this.dbStorage.updatePropertyTokenizationStatus(
      this.toNumberId(propertyId),
      action,
      this.toNumberId(adminId),
      reason
    );
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async logAdminAction(action: {
    adminId: string;
    action: string;
    entityType: string;
    entityId: string;
    entityName?: string;
    previousState?: any;
    newState?: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.dbStorage.logAdminAction({
      ...action,
      adminId: this.toNumberId(action.adminId),
      entityId: this.toNumberId(action.entityId)
    });
  }

  async getSettings(): Promise<any[]> {
    const settings = await this.dbStorage.getSettings();
    return settings.map(s => ({ ...s, _id: this.toStringId(s.id) }));
  }

  async getSettingsByCategory(category: string): Promise<any[]> {
    const settings = await this.dbStorage.getSettingsByCategory(category);
    return settings.map(s => ({ ...s, _id: this.toStringId(s.id) }));
  }

  async getSetting(key: string): Promise<any> {
    const setting = await this.dbStorage.getSetting(key);
    if (setting) {
      return { ...setting, _id: this.toStringId(setting.id) };
    }
    return null;
  }

  async updateSetting(key: string, value: string, adminId: string): Promise<any> {
    const updated = await this.dbStorage.updateSetting(key, value, this.toNumberId(adminId));
    if (updated) {
      return { ...updated, _id: this.toStringId(updated.id) };
    }
    return null;
  }

  async updateSettings(updates: { key: string; value: string }[], adminId: string): Promise<void> {
    await this.dbStorage.updateSettings(updates, this.toNumberId(adminId));
  }

  async createSetting(setting: any): Promise<any> {
    const created = await this.dbStorage.createSetting(setting);
    return { ...created, _id: this.toStringId(created.id) };
  }
}