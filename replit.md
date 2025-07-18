# Full Stack Project Manager

## Overview

This is a full-stack web application built with a modern TypeScript stack, featuring a React frontend with Vite, Express.js backend, and PostgreSQL database integration. The application serves as a project management dashboard with user authentication, database operations, and a comprehensive UI component library.

## System Architecture

The application follows a monorepo structure with clear separation between frontend and backend concerns:

- **Frontend**: React 18 + TypeScript + Vite build system
- **Backend**: Express.js + TypeScript with Node.js runtime  
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for client-side state, React Query for server state
- **Development Environment**: Replit-optimized with hot reload and live preview

## Key Components

### Frontend Architecture
- **React 18** with modern hooks and concurrent features
- **Vite** for fast development builds and HMR (Hot Module Replacement)
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** with custom design system and CSS variables
- **shadcn/ui** component library for consistent UI patterns
- **Wouter** for lightweight client-side routing
- **React Query** (@tanstack/react-query) for server state management
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** REST API server with TypeScript
- **Custom middleware** for request logging and error handling
- **Modular route structure** with separation of concerns
- **Memory storage implementation** with interface for easy database swapping
- **CORS and security** middleware configured
- **Development/Production** environment handling

### Database Layer
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the primary database (configured for Neon serverless)
- **Database migrations** managed through Drizzle Kit
- **Schema-first approach** with automatic TypeScript type generation
- **Zod integration** for runtime validation

### UI Component System
- **Design tokens** managed through CSS custom properties
- **Responsive design** with mobile-first approach
- **Accessibility** built into all components
- **Dark/light theme** support infrastructure
- **Icon system** using Lucide React
- **Form validation** with proper error handling

## Data Flow

1. **Client Requests**: React components make API calls through React Query
2. **API Layer**: Express.js handles HTTP requests and routes to appropriate handlers
3. **Business Logic**: Route handlers interact with storage layer for data operations
4. **Data Persistence**: PostgreSQL database with Drizzle ORM for type-safe operations
5. **Response Handling**: API responses are cached and managed by React Query
6. **UI Updates**: Components reactively update based on query state changes

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React 18, React DOM, React Query
- **Build tools**: Vite, TypeScript, ESBuild
- **Backend**: Express.js, Node.js runtime
- **Database**: Drizzle ORM, PostgreSQL driver (@neondatabase/serverless)

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Development and Quality
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting
- **PostCSS**: CSS processing with Tailwind
- **Replit integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Concurrent development**: Both frontend and backend run simultaneously
- **Hot reload**: Vite provides instant feedback for frontend changes
- **API proxy**: Frontend development server proxies API requests to backend
- **Port configuration**: Frontend (5173), Backend (5000)

### Production Build
1. **Frontend build**: Vite compiles React app to static assets
2. **Backend build**: ESBuild bundles Express server
3. **Static serving**: Express serves frontend assets in production
4. **Database**: PostgreSQL connection via environment variables
5. **Deployment**: Configured for Replit autoscale deployment

### Environment Configuration
- **Development**: Local development with file watching
- **Production**: Optimized builds with static asset serving
- **Database**: Environment-based connection strings
- **CORS**: Configured for cross-origin requests in development

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
- June 27, 2025. Implemented 2FA authentication system with OTP verification
  - Added email/SMS OTP delivery with 2-minute expiry
  - Created login and OTP verification pages with proper UI/UX
  - Implemented resend OTP functionality with rate limiting (3 attempts max)
  - Added secure session management and admin dashboard
  - Replaced home screen with authentication flow as requested
- June 27, 2025. Integrated PostgreSQL database with Drizzle ORM
  - Replaced in-memory storage with persistent database storage
  - Added proper bcrypt password hashing for security
  - Created database schema for users and OTP sessions
  - Implemented DatabaseStorage class following IStorage interface
  - All authentication data now persists across server restarts
- June 27, 2025. Implemented comprehensive Role Management system
  - Enhanced database schema with name, permissions, and role fields
  - Created Property Manager role with specific permissions system
  - Built complete Role Management interface with CRUD operations
  - Added permission management (View/Edit Listings, Approve Listings, Freeze Token Sale, View Bookings, Approve Trades)
  - Integrated Role Management navigation in admin dashboard
  - Implemented create, edit, delete, and status toggle functionality for Property Managers
  - Added form validation and error handling with professional UI design
- June 27, 2025. Enhanced Role Management with comprehensive sub-admin creation
  - Redesigned creation form with prominent "Create Sub-Admin Account" CTA in header
  - Added detailed permission descriptions and role assignment clarity
  - Implemented comprehensive form sections: Account Details, Access Rights, Important Notes
  - Enhanced UI with better visual hierarchy and delegated responsibility messaging
  - Added form validation preventing submission without permissions selected
  - Created informational cards explaining admin delegation capabilities
- June 27, 2025. Implemented comprehensive Platform Activity Summary Dashboard
  - Created real-time dashboard displaying five key platform metrics as requested
  - Added Total Properties Listed, Tokens Sold, Total Bookings, Rental Payouts, Pending Approvals
  - Implemented auto-refresh functionality every 3 minutes with manual refresh option
  - Added backend API endpoint /api/dashboard/metrics returning platform metrics
  - Enhanced dashboard with last updated timestamp and loading states
  - Included system health monitoring and security status overview
- June 27, 2025. Enhanced dashboard with interactive graphs and time filtering (Metrics Summary)
  - Renamed "Platform Activity Summary" to "Metrics Summary" as requested
  - Converted Tokens Sold, Total Bookings, Rental Payouts to interactive graphs with time filtering
  - Kept Total Properties Listed and Pending Approvals as cards for quick reference
  - Added Recharts library for data visualization with line and bar charts
  - Implemented time filters: Weekly/Bi-Weekly/Monthly/Yearly for Tokens Sold, Weekly/Monthly/Yearly for Bookings, Monthly/Quarterly/Yearly for Payouts
  - Created responsive chart layout with proper data formatting and tooltips
- June 27, 2025. Implemented sidebar navigation with professional admin panel design
  - Created left sidebar with AdminPanel branding and Enterprise Dashboard subtitle
  - Added navigation menu with Dashboard, User Management, Properties, Reports, and Settings
  - Implemented active state highlighting with blue accent colors
  - Added user profile section at bottom with logout functionality
  - Redesigned main content area with top header including search and notifications
  - Maintained all existing dashboard functionality while improving layout structure
- June 28, 2025. Redesigned Role Management with inline expansion and new layout
  - Implemented inline expansion functionality for Role Management section within dashboard
  - Created expandable User Management section matching reference design specifications
  - Added dynamic header titles that change based on expanded sections
  - Redesigned Role Management page layout with dark theme cards and gradient sections
  - Added statistics cards for Total Property Managers, Active/Inactive Accounts
  - Created "Delegate Administrative Tasks" section with professional styling
  - Updated Property Managers table with dark theme and proper column structure
  - Implemented empty state with centered icon and helpful messaging
- June 28, 2025. Implemented comprehensive Property Manager creation form
  - Added detailed form for creating new Property Manager sub-admin accounts
  - Included required fields: name, email, mobile, role assignment
  - Implemented five specific permission options: View/Edit Listings, Approve Listings, Freeze Token Sale, View Bookings, Approve Trades
  - Added form validation requiring all fields and at least one permission
  - Created two-column layout with Account Details and Access Rights sections
  - Added optional notes field and important information section
  - Implemented form state management with proper validation and error handling
  - Converted form to modal dialog with "Add New Admin" button (#004182 color)
  - Updated all cards and table backgrounds to white as requested
  - Form now opens in a responsive modal instead of inline display
- June 28, 2025. Enhanced sidebar branding and navigation functionality
  - Changed sidebar title from "AdminPanel" to "Rentzy" and removed "Enterprise Dashboard" subtitle
  - Fixed menu highlighting bug where Dashboard was always highlighted alongside other menu items
  - Made sidebar fixed position to prevent scrolling with page content
  - Adjusted main content area margin to properly accommodate fixed sidebar layout
- June 28, 2025. Streamlined dashboard layout and improved chart responsiveness
  - Changed interactive charts from multi-column to single-column layout for better readability
  - Removed Auto-refresh Enabled information box to reduce visual clutter
  - Removed Administrative Actions section as requested
  - Removed System Health and Security Overview sections to focus on core metrics
  - Maintained responsive design for optimal viewing across all device sizes
- June 28, 2025. Implemented comprehensive User Management system with detailed user profiles
  - Created complete User Management interface with search and filter functionality
  - Added role-based tabbed profiles (Renter/Investor/Both) with relevant data sections
  - Implemented booking history, investment portfolios, and activity timelines
  - Added KYC status tracking and user role validation
  - Created interactive user selection with detailed profile dialogs
  - Included PDF download functionality for user reports
  - Added gain/loss calculations for investment tracking
  - Implemented proper fallback messages for empty data states
  - Enhanced database schema with properties, bookings, investments, and user activities tables
- June 30, 2025. Updated login page theme with clean white design
  - Changed background from gradient to clean white
  - Updated all text colors to black for better readability
  - Applied #004182 button color with darker hover state (#003366)
  - Updated branding from "SecureAdmin" to "Rentzy Admin Portal"
  - Applied consistent #004182 accent color for focus states and branding elements
  - Redesigned demo credentials section with matching theme colors
- June 30, 2025. Updated OTP verification page theme to match login design
  - Changed background to clean white for consistency
  - Updated all text colors to black for better readability
  - Applied #004182 primary button color with darker hover state
  - Updated progress bar and timer indicators to use brand colors
  - Applied consistent #004182 accent colors for icons and hover states
  - Updated form inputs with proper focus states using brand color
- June 30, 2025. Implemented comprehensive Property Management system with horizontal tabs
  - Built Property Management interface with Live, Pending, and Rejected status tabs
  - Added horizontal tab component with badge counters showing property counts per status
  - Implemented responsive mobile-friendly design with search functionality
  - Created detailed property cards displaying thumbnails, titles, locations, owners, timestamps
  - Added status-specific information: Live properties show token details, Pending shows posted date, Rejected shows rejection reason
  - Integrated View and Delete actions with confirmation dialogs
  - Enhanced database schema with property status fields and owner information
  - Added PostgreSQL integration with sample property data across all three statuses
  - Connected Property Management to sidebar navigation in admin dashboard
  - Implemented real-time search across property names, addresses, and owner names
  - Added proper error handling and loading states for all property operations
  - Converted all three tabs (Live, Pending, Rejected) from card layout to professional table format with comprehensive column headings
  - Live tab shows: Property, Location, Owner, Tokens, Token Price, Total Value, Listed Date, Actions
  - Pending tab shows: Property, Location, Owner, Tokens, Token Price, Total Value, Submitted Date, Actions
  - Rejected tab shows: Property, Location, Owner, Tokens, Token Price, Total Value, Rejected Date, Rejection Reason, Actions
  - Enhanced data presentation with structured tables and responsive design with horizontal scrolling and hover effects
- July 1, 2025. Implemented comprehensive Tokenization Dashboard with "Freeze Token Sale" functionality
  - Created complete Tokenization Dashboard with property listing, filtering, and action management
  - Added Tokenization Dashboard navigation to admin sidebar with Coins icon
  - Built comprehensive backend API routes for tokenized properties with filtering and pagination
  - Enhanced database storage with tokenization methods and admin action logging
  - Added sample tokenized property data with various token statuses (active, paused, frozen)
  - Implemented "Freeze Token Sale" functionality with advanced confirmation popup
  - Added business logic validation: freeze only available for properties with 'Live' token sale status
  - Created detailed confirmation modal showing effects of freeze action with required reason field
  - Implemented backend validation requiring reason for freeze actions and tokenization status checks
  - Added comprehensive audit logging with Admin ID, timestamps, previous/new states, and freeze reasons
  - Enhanced frontend purchase button disabling when sale status is frozen
  - Implemented proper error handling and success messaging for all freeze operations
  - Added state-based UI elements with status badges and progress indicators
  - Ensured freeze actions remain effective until manual admin unfreeze
- July 1, 2025. Implemented comprehensive "Freeze Secondary Trading" functionality with marketplace integration
  - Created "Freeze Secondary Trading" action with dedicated confirmation popup and effect descriptions
  - Added business logic validation: freeze only available for properties with 'enabled' secondary trading status
  - Enhanced backend validation requiring reason for freeze secondary trading actions
  - Integrated property-level secondary trading status with marketplace listings display
  - Updated Secondary Marketplace to show "Trading Frozen" badges when property trading is frozen at admin level
  - Added validation preventing marketplace listing modifications when property trading is frozen
  - Implemented comprehensive error handling with descriptive messages for trading freeze conflicts
  - Enhanced marketplace status display to show both listing status and property-level trading restrictions
  - Added blockchain synchronization considerations for on-chain trading freeze enforcement
  - Ensured freeze secondary trading disables all resale activity until manual admin unfreeze
- July 1, 2025. Implemented comprehensive "Disable Minting" functionality with irreversible token supply locking
  - Created "Disable Minting" action with IRREVERSIBLE warning and detailed confirmation popup
  - Added strict business logic validation: only available for completed tokenized properties with active sales and tokens sold
  - Enhanced backend validation requiring reason for disable minting actions with minting status checks
  - Implemented irreversible token supply locking - totalTokens locked at current tokensIssued amount
  - Added comprehensive confirmation modal showing current token status, effects, and requirements met
  - Created detailed warning system emphasizing irreversible nature with AlertTriangle icon and red styling
  - Implemented automatic button disappearance after minting is disabled to prevent further use
  - Enhanced backend storage to lock token supply field permanently when minting is disabled
  - Added comprehensive audit logging with IRREVERSIBLE flag for minting disable actions
  - Ensured token supply field becomes read-only in backend systems after disable minting
  - Added blockchain synchronization considerations for on-chain token supply finalization
  - Implemented proper error handling and success messaging for irreversible minting operations
- July 1, 2025. Implemented comprehensive Property Details View functionality with breadcrumb navigation
  - Created detailed property view page with breadcrumb "Tokenization Dashboard → Tokenization Properties Details"
  - Updated View button in Tokenization Dashboard to navigate to detailed property page
  - Added backend API endpoint `/api/tokenization/properties/:id` for fetching individual property details
  - Implemented comprehensive property information display including all requested fields
  - Added Property Title, Location, Owner Name, Token Name, Token Symbol, Token Contract Address
  - Included Token Count, Token Price, ROI%, Investment Duration (Start and End Date)
  - Added Token Status (Live, Frozen, Closed, Sold Out), Investment Progress (% tokens sold)
  - Implemented Last Updated Date display with proper date formatting
  - Created responsive card-based layout with property information, token details, and investment duration sections
  - Added sidebar with Token Status, Expected ROI, and Investment Progress with visual progress bar
  - Implemented proper error handling and loading states for detailed property view
  - Enhanced navigation with back button functionality and breadcrumb links
- July 1, 2025. Converted Property Details to modal-style display within same page
  - Redesigned View functionality to open Property Details as modal within Tokenization Dashboard
  - Implemented same-page modal pattern similar to User Profile in User Management
  - Added state management with selectedProperty and showPropertyDetails for modal control
  - Created handlePropertySelect and handleBackToPropertyList functions for modal navigation
  - Maintained complete existing design and layout of Property Details without any changes
  - Added breadcrumb navigation with back button functionality in modal view
  - Preserved all property information sections: Property Information, Token Details, Investment Duration
  - Kept right sidebar with Token Status, Expected ROI, and Investment Progress unchanged
  - Enhanced user experience by eliminating navigation to separate page as requested
- July 2, 2025. Implemented comprehensive Settings page with API integration
  - Created comprehensive Settings database schema with settings table supporting multiple categories
  - Enhanced backend storage interface with methods for settings (getSettings, updateSetting, createSetting)
  - Added sample settings data covering General Settings, Admin Preferences, and Security Settings
  - Built complete Settings API routes for fetch and update operations with proper validation
  - Created dynamic Settings page with three main sections: General Settings, Admin Preferences, Security Settings
  - Implemented different form controls based on data type: text inputs, number inputs, boolean switches
  - Added real-time form state management with unsaved changes notification
  - Integrated Settings navigation in admin sidebar with proper routing and header display
  - Added refresh functionality and comprehensive error handling for all settings operations
  - Enhanced UI with loading states, save confirmation, and organized card-based layout
- July 3, 2025. Resolved Investment Oversight data loading issue and streamlined Settings page
  - Fixed Investment Oversight page data loading by adding sample investor listings to database
  - Created 5 sample investor users and 6 investor listings with various statuses (pending, approved, rejected)
  - Added comprehensive sample data including token IDs, prices, wallet addresses, and property relationships
  - Verified Investment Oversight API is now returning proper data with join relationships
  - Removed specific settings fields as requested: Enable Maintenance Mode, Default Timezone, Default Theme Preference, and Session Timeout
  - Streamlined Settings page by removing 4 unnecessary configuration options from database
- July 4, 2025. Implemented comprehensive Preview & Submit functionality for Residential Rental Details
  - Added professional review page with complete property information display in organized two-column layout
  - Created seamless submission workflow that moves properties to Pending tab with success confirmation
  - Enhanced form validation and user feedback with loading states and error handling
  - Integrated comprehensive preview showing Property Details, Accommodation, Pricing, Check-in/Check-out times
  - Added Featured Amenities display with organized badges and Property Photos in responsive grid layout
  - Implemented breadcrumb navigation: Property Management → Residential Rental Details → Review & Submit
  - Added "Back to Edit" functionality allowing users to return and modify information before submission
  - Created professional submission process with automatic form data clearing and session storage cleanup
  - Enhanced button text clarity: "Submit for Review" on details page, "Submit Property" on preview page
- July 9, 2025. Completed modular backend architecture restructuring
  - Created comprehensive modular structure with 10 separate feature modules within backend/src/modules/
  - Organized modules: Auth, Dashboard, User Management, Role Management, Properties, Secondary Marketplace, Investment Oversight, Tokenization, Settings, Profile
  - Implemented consistent MVC pattern with controllers, routes, and middleware for each module
  - Established centralized routing system through backend/src/routes/index.ts
  - Created structured middleware system with authentication and error handling
  - Integrated Express.js app factory pattern for clean module composition
  - Maintained existing API endpoints while improving backend organization and maintainability
  - Successfully tested modular structure with working API endpoints
  - Updated server/routes.ts to use new modular backend structure
  - Preserved all existing functionality while enhancing code organization
- July 9, 2025. Completed backend API system integration and testing
  - Successfully integrated modular backend with existing server infrastructure
  - Fixed all import path issues and storage dependencies across modules
  - Restored complete authentication flow with working login and OTP verification
  - Enabled protected dashboard routes with proper authentication middleware
  - Tested full authentication cycle: login → OTP generation → verification → protected access
  - Verified session management and user authentication persistence
  - Cleaned up temporary test code and finalized production-ready endpoints
  - Confirmed all existing frontend functionality remains intact with new backend structure
- July 9, 2025. Organized frontend code into professional modular structure
  - Created comprehensive feature-based organization within frontend folder
  - Structured modules: auth, dashboard, user-management, property-management, tokenization, secondary-marketplace, investment-oversight, role-management, settings, profile
  - Organized shared utilities: lib, hooks, components, services, utils, constants, types, assets
  - Created API endpoints constants and application routes constants for better maintainability
  - Implemented barrel exports (index.ts files) for clean module imports
  - Added comprehensive README documentation for frontend architecture
  - Maintained existing project flow and functionality without any design or UI changes
  - Preserved all vite configuration and build processes without modification
  - Verified application continues to work correctly with new structure
- July 9, 2025. Created comprehensive Property Creation API with MongoDB integration
  - Built complete property creation API supporting both residential and commercial properties
  - Created shared/property-schemas.ts with comprehensive Zod validation for property types
  - Enhanced PropertiesController with advanced property creation, bulk operations, and analytics
  - Added property filtering, pagination, and search functionality with advanced query parameters
  - Implemented createProperty, createBulkProperties, getPropertyAnalytics, and getPropertyValidationRules endpoints
  - Added comprehensive validation for residential properties (bedrooms, bathrooms, amenities, pricing)
  - Added commercial property support (building type, floors, zoning, monthly rent, lease terms)
  - Enhanced property routes with bulk creation (/bulk), analytics (/analytics), and validation rules endpoints
  - Created public validation rules endpoint for property submission requirements
  - Added proper error handling, authentication validation, and response formatting
  - Successfully integrated with existing MongoDB storage system with proper data persistence
  - Tested authentication flow and confirmed property creation API working with session management
- July 10, 2025. Successfully migrated frontend code from client folder to organized frontend structure
  - Completely reorganized frontend code into clean features/ organization (auth, dashboard, property-management, tokenization, etc.)
  - Migrated all working components and resolved import path issues (@/shared/lib, @/shared/hooks)
  - Maintained all existing UI designs and functionality without any changes
  - Removed redundant client folder and consolidated all code into single frontend structure
  - Updated all import paths to use consistent @/shared/* pattern for shared utilities
  - Preserved backend code without modifications and maintained smooth application flow
  - Application continues to function as expected with new organized structure
- July 10, 2025. Enhanced OTP display in browser console and created comprehensive setup documentation
  - Added OTP code display in browser console during development mode for easier testing
  - Modified backend to include OTP in login response only in development environment
  - Enhanced frontend login success handler with detailed console logging and OTP display
  - Created comprehensive LOCAL_SETUP_GUIDE.md with step-by-step setup instructions
  - Added README.md with quick start guide and project overview
  - Created .env.example file for easier environment configuration
  - Improved developer experience with clear setup documentation and testing features
- July 10, 2025. Synchronized backend models with property owner app structure
  - Enhanced User model with property owner specific fields (business info, banking, emergency contacts)
  - Added comprehensive Building model for property/building management with amenities, utilities, insurance
  - Created Unit model for individual rental units with detailed specifications and lease terms
  - Implemented Lease model for complete lease agreement management with renewal options and policies
  - Added RentPayment model for payment tracking with multiple payment methods and late fees
  - Created MaintenanceRequest model for maintenance workflow with work orders and vendor management
  - Implemented Inspection model for property condition tracking with photo documentation
  - Added FinancialTransaction model for comprehensive income/expense tracking with tax considerations
  - Extended user roles to include property_owner, tenant, maintenance_staff roles
  - Maintained backward compatibility with existing tokenization and investment features
  - Created PROPERTY_OWNER_MODELS.md documentation explaining the enhanced model structure
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```