# Property Owner App Models Documentation

## Overview

The models have been synchronized and enhanced for the `rentzy-be-properyowner` application. This includes comprehensive models for property management, tenant management, lease administration, maintenance tracking, and financial management.

## Enhanced Models Structure

### 1. User Management (Enhanced)
- **Enhanced User Model**: Added property owner specific fields
  - Business information (businessName, businessLicense, taxId)
  - Banking details for rent collection
  - Emergency contacts
  - Extended role system: property_owner, tenant, maintenance_staff

### 2. Building & Property Management
- **Building Model**: Complete building/property information
  - Address and location details
  - Building specifications (floors, units, year built)
  - Amenities and features
  - Utility policies
  - Insurance information
  - Maintenance contacts

- **Unit Model**: Individual rental units within buildings
  - Unit specifications (bedrooms, bathrooms, square footage)
  - Rent and deposit amounts
  - Availability status
  - Unit-specific amenities and features
  - Lease terms and preferences

### 3. Lease Management
- **Lease Model**: Comprehensive lease agreements
  - Lease terms and duration
  - Rent and deposit details
  - Late fees policy
  - Renewal options
  - Pet policies and details
  - Emergency contacts

### 4. Financial Management
- **RentPayment Model**: Rent collection and tracking
  - Payment history and status
  - Multiple payment methods
  - Late fees calculation
  - Receipt management

- **FinancialTransaction Model**: Complete financial tracking
  - Income and expense categorization
  - Vendor information
  - Tax-deductible tracking
  - Recurring transactions

### 5. Maintenance Management
- **MaintenanceRequest Model**: Tenant maintenance requests
  - Request types and priorities
  - Work order management
  - Vendor assignment
  - Cost tracking
  - Tenant satisfaction feedback

- **Inspection Model**: Property inspection tracking
  - Move-in/move-out inspections
  - Regular maintenance inspections
  - Condition assessments
  - Repair requirements
  - Photo documentation

## Key Features Added

### Property Owner Specific Features
1. **Multi-Property Management**: Support for multiple buildings and units
2. **Tenant Portal Integration**: Complete tenant information and communication
3. **Maintenance Workflow**: End-to-end maintenance request handling
4. **Financial Reporting**: Comprehensive income/expense tracking
5. **Lease Administration**: Complete lease lifecycle management
6. **Inspection Management**: Systematic property condition monitoring

### Enhanced User Roles
- **Property Owner**: Full access to their properties
- **Property Manager**: Delegated management responsibilities  
- **Tenant**: Access to their unit and lease information
- **Maintenance Staff**: Work order and maintenance access
- **Admin**: System administration

### Data Relationships
- Buildings → Units (One-to-Many)
- Units → Leases (One-to-Many)
- Leases → Payments (One-to-Many)
- Units → Maintenance Requests (One-to-Many)
- Buildings → Inspections (One-to-Many)
- Users → Multiple Roles (Many-to-Many)

## Database Schema Enhancements

### New Collections Added
1. `buildings` - Property/building information
2. `units` - Individual rental units
3. `leases` - Lease agreements
4. `rentpayments` - Payment tracking
5. `maintenancerequests` - Maintenance workflow
6. `inspections` - Property inspections
7. `financialtransactions` - Financial management

### Enhanced Existing Collections
1. `users` - Added property owner fields
2. `properties` - Enhanced for tokenization integration
3. `settings` - Property management configurations

## Integration Points

### With Existing Tokenization System
- Properties can be both rental units and tokenized investments
- Dual revenue streams: rental income + token appreciation
- Investor access to rental performance data

### API Compatibility
- All existing API endpoints remain functional
- New endpoints added for property owner features
- Backward compatibility maintained

## Usage Examples

### Property Owner Registration
```javascript
const propertyOwner = {
  email: "owner@example.com",
  role: "property_owner",
  businessName: "ABC Property Management",
  businessLicense: "BL123456",
  taxId: "12-3456789",
  bankAccount: {
    bankName: "Wells Fargo",
    accountNumber: "****1234",
    routingNumber: "121000248"
  }
};
```

### Building Creation
```javascript
const building = {
  buildingName: "Sunset Apartments",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105"
  },
  buildingType: "apartment",
  totalUnits: 24,
  totalFloors: 3,
  yearBuilt: 2020
};
```

### Unit Management
```javascript
const unit = {
  buildingId: "building_id",
  unitNumber: "2A",
  unitType: "2br",
  bedrooms: 2,
  bathrooms: 2,
  squareFootage: 950,
  rentAmount: 3500,
  securityDeposit: 3500,
  availabilityStatus: "available"
};
```

## Migration Notes

1. **Data Preservation**: All existing data remains intact
2. **Role Updates**: Existing users maintain their current roles
3. **API Compatibility**: No breaking changes to existing endpoints
4. **Feature Flags**: New features can be enabled per property owner

## Next Steps

1. **API Implementation**: Create REST endpoints for new models
2. **Frontend Integration**: Build UI components for property management
3. **Testing**: Comprehensive testing of new workflows
4. **Documentation**: API documentation for property owner features
5. **Migration Scripts**: Data migration utilities if needed

This model structure provides a complete foundation for a professional property management system while maintaining integration with the existing tokenization platform.