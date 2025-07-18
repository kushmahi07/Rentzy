# Property Creation API Documentation

## Overview
This document describes the comprehensive Property Creation API that has been implemented for the real estate investment platform. The API supports both residential and commercial properties with full MongoDB integration and authentication.

## API Endpoints

### 1. Create Property
**POST** `/api/properties`

Creates a new property (residential or commercial) with comprehensive validation.

**Authentication**: Required (session-based)

**Request Body Example (Residential)**:
```json
{
  "propertyType": "residential",
  "name": "Luxury Beachfront Villa",
  "address": "123 Ocean Drive",
  "city": "Miami Beach",
  "state": "Florida",
  "zipCode": "33139",
  "description": "Stunning beachfront villa with panoramic ocean views",
  "ownerName": "John Smith",
  "ownerEmail": "john@example.com",
  "squareFootage": 4500,
  "bedrooms": 5,
  "bathrooms": 4,
  "yearBuilt": 2015,
  "totalTokens": 1000,
  "tokenPrice": 500,
  "tokenName": "VILLA01",
  "tokenSymbol": "VLA",
  "homeValueEstimate": 250000000,
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "zoningPermitsShortTerm": true,
  "allowsFractionalization": true,
  "allowsRentziEquity": true,
  "furnished": "yes",
  "ownershipType": "full_owner",
  "availableWeeksPerYear": 40,
  "nightlyBaseRate": 750,
  "cleaningFee": 150,
  "minimumStay": 3,
  "guestCapacity": 10,
  "featuredAmenities": ["pool", "ocean-view", "private-beach", "wifi"],
  "checkInTime": "3:00 PM",
  "checkOutTime": "11:00 AM",
  "houseRules": "No smoking, no pets, no parties",
  "localHighlights": "Close to South Beach, world-class restaurants"
}
```

**Request Body Example (Commercial)**:
```json
{
  "propertyType": "commercial",
  "name": "Downtown Office Tower",
  "address": "456 Business Boulevard",
  "city": "New York",
  "state": "New York",
  "zipCode": "10001",
  "description": "Modern office building in prime downtown location",
  "ownerName": "Corporate Holdings LLC",
  "ownerEmail": "admin@corporateholdings.com",
  "squareFootage": 50000,
  "yearBuilt": 2018,
  "totalTokens": 5000,
  "tokenPrice": 1000,
  "tokenName": "OFFICE01",
  "tokenSymbol": "OFF",
  "homeValueEstimate": 5000000000,
  "images": ["https://example.com/office1.jpg"],
  "zoningPermitsShortTerm": false,
  "allowsFractionalization": true,
  "allowsRentziEquity": true,
  "buildingType": "office",
  "floors": 25,
  "parkingSpaces": 100,
  "monthlyRent": 50000,
  "leaseTermMonths": 12,
  "securityDeposit": 100000,
  "businessAmenities": ["conference-rooms", "parking", "security"],
  "zoningType": "commercial",
  "allowedUsages": ["office", "retail"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "_id": "60f7b1c4e9b8a3001f4c6d2a",
    "name": "Luxury Beachfront Villa",
    "status": "pending",
    "tokenizationStatus": "not_started",
    "createdAt": "2025-07-09T12:34:56.789Z",
    ...
  }
}
```

### 2. Create Bulk Properties
**POST** `/api/properties/bulk`

Creates multiple properties in a single request with error handling for each property.

**Authentication**: Required

**Request Body**:
```json
{
  "properties": [
    {
      "propertyType": "residential",
      "name": "Villa 1",
      ...
    },
    {
      "propertyType": "commercial",
      "name": "Office Building 1",
      ...
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully created 2 properties",
  "data": {
    "created": [...],
    "errors": [...],
    "summary": {
      "total": 2,
      "success": 2,
      "failed": 0
    }
  }
}
```

### 3. Get Properties with Filtering
**GET** `/api/properties`

Retrieves properties with advanced filtering, pagination, and search capabilities.

**Authentication**: Required

**Query Parameters**:
- `status`: Filter by property status (live, pending, rejected)
- `propertyType`: Filter by property type (residential, commercial)
- `city`: Filter by city name
- `state`: Filter by state
- `minPrice`: Minimum token price
- `maxPrice`: Maximum token price
- `minSquareFootage`: Minimum square footage
- `maxSquareFootage`: Maximum square footage
- `bedrooms`: Number of bedrooms (residential only)
- `bathrooms`: Number of bathrooms (residential only)
- `search`: Text search across name, address, owner, city, state, description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example**:
```
GET /api/properties?status=live&propertyType=residential&city=Miami&page=1&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 4. Get Property Analytics
**GET** `/api/properties/analytics`

Provides comprehensive analytics and metrics for all properties.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "totalProperties": 150,
    "statusBreakdown": {
      "live": 75,
      "pending": 50,
      "rejected": 25
    },
    "propertyTypeBreakdown": {
      "residential": 100,
      "commercial": 50
    },
    "tokenMetrics": {
      "totalTokens": 150000,
      "totalTokensSold": 75000,
      "totalTokensAvailable": 75000,
      "averageTokenPrice": 500
    },
    "valueMetrics": {
      "totalPropertyValue": 3750000000,
      "totalRaised": 37500000,
      "averagePropertyValue": 250000000
    },
    "locationBreakdown": {
      "California": 40,
      "Florida": 30,
      "New York": 25,
      "Texas": 20
    },
    "recentActivity": {
      "lastWeek": 15,
      "lastMonth": 45
    }
  }
}
```

### 5. Get Validation Rules
**GET** `/api/validation-rules`

Returns validation rules and requirements for property submission.

**Authentication**: Not required (public endpoint)

**Response**:
```json
{
  "success": true,
  "data": {
    "residential": {
      "minHomeValue": 150000000,
      "minSquareFootage": 1000,
      "minBedrooms": 1,
      "minBathrooms": 1,
      "minAvailableWeeks": 1,
      "maxAvailableWeeks": 52,
      "minNightlyRate": 10,
      "minCleaningFee": 5,
      "minGuestCapacity": 1,
      "requiredAmenities": ["wifi", "parking"],
      "requiredDocuments": ["deed", "title", "insurance", "permits"]
    },
    "commercial": {
      "minHomeValue": 150000000,
      "minSquareFootage": 1000,
      "minFloors": 1,
      "minMonthlyRent": 100,
      "minLeaseTermMonths": 1,
      "allowedBuildingTypes": ["office", "retail", "warehouse", "mixed_use", "hotel", "other"],
      "requiredDocuments": ["deed", "title", "insurance", "zoning", "permits"]
    },
    "common": {
      "minTokens": 100,
      "maxTokens": 100000,
      "minTokenPrice": 1,
      "requiredImages": 1,
      "maxImages": 50,
      "maxVideos": 10,
      "max360Views": 5,
      "allowedImageFormats": ["jpg", "jpeg", "png", "webp"],
      "allowedVideoFormats": ["mp4", "mov", "avi"],
      "maxFileSize": 10485760
    }
  }
}
```

### 6. Update Property
**PUT** `/api/properties/:id`

Updates an existing property with validation.

**Authentication**: Required

**Request Body**: Same as create property (partial updates allowed)

### 7. Delete Property
**DELETE** `/api/properties/:id`

Deletes a property by ID.

**Authentication**: Required

### 8. Approve Property
**POST** `/api/properties/:id/approve`

Approves a pending property, changing its status to 'live'.

**Authentication**: Required

### 9. Reject Property
**POST** `/api/properties/:id/reject`

Rejects a property with a reason.

**Authentication**: Required

**Request Body**:
```json
{
  "reason": "Property does not meet minimum value requirements"
}
```

## Property Schema

### Residential Properties
- **Required Fields**: name, address, city, state, zipCode, description, ownerName, ownerEmail, squareFootage, bedrooms, bathrooms, totalTokens, tokenPrice, tokenName, tokenSymbol, homeValueEstimate, images, furnished, ownershipType, availableWeeksPerYear, nightlyBaseRate, cleaningFee, minimumStay, guestCapacity, checkInTime, checkOutTime, houseRules
- **Optional Fields**: yearBuilt, yearRenovated, thumbnail, videos, view360, weekendRate, peakSeasonRate, featuredAmenities, localHighlights, documentsUploaded

### Commercial Properties
- **Required Fields**: name, address, city, state, zipCode, description, ownerName, ownerEmail, squareFootage, totalTokens, tokenPrice, tokenName, tokenSymbol, homeValueEstimate, images, buildingType, floors, monthlyRent, leaseTermMonths, zoningType, allowedUsages
- **Optional Fields**: yearBuilt, yearRenovated, thumbnail, videos, view360, parkingSpaces, securityDeposit, businessAmenities, documentsUploaded

## Authentication

All protected endpoints require session-based authentication. To authenticate:

1. **Login**: POST `/api/auth/login` with email and password
2. **Verify OTP**: POST `/api/auth/verify-otp` with OTP code and session ID
3. **Use Session**: Include session cookie in subsequent requests

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed validation errors (if applicable)"
}
```

## Status Codes

- **200**: Success
- **201**: Created successfully
- **400**: Bad request / Validation error
- **401**: Authentication required
- **404**: Resource not found
- **500**: Internal server error

## Data Persistence

All property data is stored in MongoDB with proper indexing and relationships. The system includes:

- Automatic timestamp tracking (createdAt, updatedAt)
- Status tracking (pending, live, rejected)
- Tokenization status management
- Owner information linking
- Media file URL storage
- Comprehensive audit logging

## Testing

The API has been tested with:
- Property creation validation
- Authentication flow
- MongoDB integration
- Error handling
- Bulk operations
- Analytics generation

All endpoints are production-ready and integrated with the existing admin dashboard system.