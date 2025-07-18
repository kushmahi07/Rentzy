import type { Express } from "express";
import { createServer, type Server } from "http";
import { createApp } from "../backend/src/app";

// Static mock data for properties
const mockProperties = [
  {
    id: 1,
    name: "Luxury Downtown Condo",
    address: "123 Main Street, Downtown, Miami, FL",
    city: "Miami",
    state: "FL",
    description:
      "Stunning luxury condo in the heart of downtown with panoramic city views",
    totalTokens: 1000,
    tokenPrice: 250,
    tokensSold: 450,
    status: "live",
    thumbnail:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    ownerName: "John Smith",
    ownerEmail: "john.smith@email.com",
    ownerMobile: "+1 (555) 123-4567",
    listingType: "Fractional Ownership & Rental",
    liveDate: "2024-01-15T10:00:00Z",
    rejectedDate: null,
    rejectionReason: null,
    propertyType: "residential",
    market: "Downtown Miami",
    homeValueEstimate: 1500000,
    squareFootage: 2500,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2020,
    yearRenovated: null,
    zoningPermitsShortTerm: true,
    availableWeeksPerYear: 48,
    furnished: "yes",
    ownershipType: "full_owner",
    allowsFractionalization: true,
    allowsRentziEquity: true,
    documentsUploaded: {
      property_deed: "https://example.com/docs/deed1.pdf",
      tax_records: "https://example.com/docs/tax1.pdf",
      insurance_docs: "https://example.com/docs/insurance1.pdf",
      hoa_docs: "https://example.com/docs/hoa1.pdf",
    },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    videos: ["https://example.com/video1.mp4"],
    view360: ["https://example.com/360-tour1"],
    tokenizationStatus: "completed",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Beachfront Villa Resort",
    address: "456 Ocean Drive, South Beach, Miami, FL",
    city: "Miami",
    state: "FL",
    description: "Exclusive beachfront villa with private beach access",
    totalTokens: 2000,
    tokenPrice: 500,
    tokensSold: 800,
    status: "live",
    thumbnail:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah.johnson@email.com",
    ownerMobile: "+1 (555) 987-6543",
    listingType: "Rental Only",
    liveDate: "2024-02-01T14:00:00Z",
    rejectedDate: null,
    rejectionReason: null,
    propertyType: "residential",
    market: "South Beach",
    homeValueEstimate: 3500000,
    squareFootage: 4500,
    bedrooms: 5,
    bathrooms: 4,
    yearBuilt: 2018,
    yearRenovated: 2023,
    zoningPermitsShortTerm: true,
    availableWeeksPerYear: 40,
    furnished: "yes",
    ownershipType: "full_owner",
    allowsFractionalization: true,
    allowsRentziEquity: true,
    documentsUploaded: {
      property_deed: "https://example.com/docs/deed2.pdf",
      tax_records: "https://example.com/docs/tax2.pdf",
      insurance_docs: "https://example.com/docs/insurance2.pdf",
      hoa_docs: "https://example.com/docs/hoa2.pdf",
    },
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
    ],
    videos: ["https://example.com/video2.mp4"],
    view360: ["https://example.com/360-tour2"],
    tokenizationStatus: "completed",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-02-01T14:00:00Z",
  },
  {
    id: 3,
    name: "Mountain View Retreat",
    address: "789 Mountain Road, Aspen, CO",
    city: "Aspen",
    state: "CO",
    description: "Stunning mountain retreat with ski-in/ski-out access",
    totalTokens: 1500,
    tokenPrice: 400,
    tokensSold: 0,
    status: "pending",
    thumbnail:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
    ownerName: "Michael Brown",
    ownerEmail: "michael.brown@email.com",
    ownerMobile: "+1 (555) 456-7890",
    listingType: "Fractional Ownership & Rental",
    liveDate: null,
    rejectedDate: null,
    rejectionReason: null,
    propertyType: "residential",
    market: "Aspen",
    homeValueEstimate: 2800000,
    squareFootage: 3800,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2019,
    yearRenovated: null,
    zoningPermitsShortTerm: true,
    availableWeeksPerYear: 45,
    furnished: "yes",
    ownershipType: "full_owner",
    allowsFractionalization: true,
    allowsRentziEquity: true,
    documentsUploaded: {
      property_deed: "https://example.com/docs/deed3.pdf",
      tax_records: "https://example.com/docs/tax3.pdf",
      insurance_docs: "https://example.com/docs/insurance3.pdf",
      hoa_docs: "https://example.com/docs/hoa3.pdf",
    },
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    ],
    videos: [],
    view360: [],
    tokenizationStatus: "not_started",
    createdAt: "2024-02-10T11:00:00Z",
    updatedAt: "2024-02-10T11:00:00Z",
  },
  {
    id: 4,
    name: "Urban Loft Apartment",
    address: "321 Industrial Way, Brooklyn, NY",
    city: "Brooklyn",
    state: "NY",
    description: "Modern urban loft in trendy Brooklyn neighborhood",
    totalTokens: 800,
    tokenPrice: 300,
    tokensSold: 0,
    status: "pending",
    thumbnail:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    ownerName: "Emma Wilson",
    ownerEmail: "emma.wilson@email.com",
    ownerMobile: "+1 (555) 234-5678",
    listingType: "Rental Only",
    liveDate: null,
    rejectedDate: null,
    rejectionReason: null,
    propertyType: "residential",
    market: "Brooklyn",
    homeValueEstimate: 1200000,
    squareFootage: 1800,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2017,
    yearRenovated: 2022,
    zoningPermitsShortTerm: true,
    availableWeeksPerYear: 50,
    furnished: "yes",
    ownershipType: "full_owner",
    allowsFractionalization: true,
    allowsRentziEquity: true,
    documentsUploaded: {
      property_deed: "https://example.com/docs/deed4.pdf",
      tax_records: "https://example.com/docs/tax4.pdf",
      insurance_docs: "https://example.com/docs/insurance4.pdf",
      hoa_docs: "https://example.com/docs/hoa4.pdf",
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    videos: [],
    view360: [],
    tokenizationStatus: "not_started",
    createdAt: "2024-02-15T13:00:00Z",
    updatedAt: "2024-02-15T13:00:00Z",
  },
  {
    id: 5,
    name: "Historic Townhouse",
    address: "654 Heritage Street, Boston, MA",
    city: "Boston",
    state: "MA",
    description: "Beautifully restored historic townhouse in downtown Boston",
    totalTokens: 1200,
    tokenPrice: 350,
    tokensSold: 0,
    status: "rejected",
    thumbnail:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    ownerName: "David Lee",
    ownerEmail: "david.lee@email.com",
    ownerMobile: "+1 (555) 345-6789",
    listingType: "Fractional Ownership & Rental",
    liveDate: null,
    rejectedDate: "2024-02-20T16:00:00Z",
    rejectionReason:
      "Property documentation incomplete. Missing updated property tax records and HOA documentation.",
    propertyType: "residential",
    market: "Downtown Boston",
    homeValueEstimate: 1800000,
    squareFootage: 2200,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1895,
    yearRenovated: 2021,
    zoningPermitsShortTerm: false,
    availableWeeksPerYear: 52,
    furnished: "needs_setup",
    ownershipType: "full_owner",
    allowsFractionalization: true,
    allowsRentziEquity: true,
    documentsUploaded: {
      property_deed: "https://example.com/docs/deed5.pdf",
      tax_records: null,
      insurance_docs: "https://example.com/docs/insurance5.pdf",
      hoa_docs: null,
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    ],
    videos: [],
    view360: [],
    tokenizationStatus: "not_started",
    createdAt: "2024-02-18T10:00:00Z",
    updatedAt: "2024-02-20T16:00:00Z",
  },
  {
    id: 6,
    name: "Commercial Office Building",
    address: "1000 Business Plaza, Austin, TX",
    city: "Austin",
    state: "TX",
    description:
      "Premium commercial office space in Austin's business district",
    totalTokens: 5000,
    tokenPrice: 200,
    tokensSold: 0,
    status: "rejected",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
    ownerName: "Corporate Holdings LLC",
    ownerEmail: "contact@corporateholdings.com",
    ownerMobile: "+1 (555) 567-8901",
    listingType: "Rental Only",
    liveDate: null,
    rejectedDate: "2024-02-25T12:00:00Z",
    rejectionReason:
      "Zoning permits for short-term rental not approved for commercial properties in this district.",
    propertyType: "commercial",
    market: "Austin Business District",
    homeValueEstimate: 5000000,
    squareFootage: 15000,
    bedrooms: 0,
    bathrooms: 8,
    yearBuilt: 2015,
    yearRenovated: null,
    zoningPermitsShortTerm: false,
    availableWeeksPerYear: 0,
    furnished: "no",
    ownershipType: "representative",
    allowsFractionalization: true,
    allowsRentziEquity: false,
    documentsUploaded: {
      commercial_deed: "https://example.com/docs/commercial_deed6.pdf",
      operating_statements: "https://example.com/docs/operating6.pdf",
      lease_agreements: "https://example.com/docs/leases6.pdf",
      inspection_reports: "https://example.com/docs/inspection6.pdf",
    },
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    ],
    videos: [],
    view360: [],
    tokenizationStatus: "not_started",
    createdAt: "2024-02-22T09:00:00Z",
    updatedAt: "2024-02-25T12:00:00Z",
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Use the modular backend structure
  const backendApp = createApp();

  // Mount backend routes
  app.use("/", backendApp);

  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      const { status, search } = req.query;

      let properties = [...mockProperties];

      // Filter by status if provided
      if (status && typeof status === "string") {
        properties = properties.filter((p) => p.status === status);
      }

      // Filter by search term if provided
      if (search && typeof search === "string") {
        const searchTerm = search.toLowerCase();
        properties = properties.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.address.toLowerCase().includes(searchTerm) ||
            p.ownerName.toLowerCase().includes(searchTerm),
        );
      }

      res.json({ success: true, data: properties });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/counts", async (req, res) => {
    try {
      const counts = {
        live: mockProperties.filter((p) => p.status === "live").length,
        pending: mockProperties.filter((p) => p.status === "pending").length,
        rejected: mockProperties.filter((p) => p.status === "rejected").length,
      };
      res.json({ success: true, data: counts });
    } catch (error) {
      console.error("Error fetching property counts:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch property counts" });
    }
  });

  // Property actions endpoints
  app.post("/api/properties/:id/approve", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = mockProperties.find((p) => p.id === propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      // Simulate approval
      property.status = "live";
      property.liveDate = new Date().toISOString();
      property.updatedAt = new Date().toISOString();

      res.json({ success: true, data: property });
    } catch (error) {
      console.error("Error approving property:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to approve property" });
    }
  });

  app.post("/api/properties/:id/reject", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { reason } = req.body;
      const property = mockProperties.find((p) => p.id === propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      // Simulate rejection
      property.status = "rejected";
      property.rejectedDate = new Date().toISOString();
      property.rejectionReason = reason;
      property.updatedAt = new Date().toISOString();

      res.json({ success: true, data: property });
    } catch (error) {
      console.error("Error rejecting property:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to reject property" });
    }
  });

  app.post("/api/properties/:id/request-resubmission", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { comments } = req.body;
      const property = mockProperties.find((p) => p.id === propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      // Simulate resubmission request (could add a resubmission comments field)
      property.updatedAt = new Date().toISOString();

      res.json({
        success: true,
        data: property,
        message: "Resubmission request sent successfully",
      });
    } catch (error) {
      console.error("Error requesting resubmission:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to request resubmission" });
    }
  });

  app.post("/api/properties/:id/start-tokenization", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = mockProperties.find((p) => p.id === propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      // Simulate tokenization completion
      property.tokenizationStatus = "completed";
      property.updatedAt = new Date().toISOString();

      res.json({
        success: true,
        data: property,
        message: "Tokenization completed successfully",
      });
    } catch (error) {
      console.error("Error starting tokenization:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to start tokenization" });
    }
  });

  app.put("/api/properties/:id/financials", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { totalTokens, tokenPrice } = req.body;
      const property = mockProperties.find((p) => p.id === propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      // Update financial information
      property.totalTokens = totalTokens;
      property.tokenPrice = tokenPrice;
      property.updatedAt = new Date().toISOString();

      res.json({ success: true, data: property });
    } catch (error) {
      console.error("Error updating financials:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update financial information",
      });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const index = mockProperties.findIndex((p) => p.id === propertyId);

      if (index === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      // Remove property from mock data
      mockProperties.splice(index, 1);

      res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete property" });
    }
  });

  return createServer(app);
}