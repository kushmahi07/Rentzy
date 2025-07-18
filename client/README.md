# Frontend Structure

## Overview
This is the frontend application for the Rentzy property tokenization platform. The project is built with React 18, TypeScript, and Vite, featuring a clean and professional folder structure optimized for scalability and maintainability.

## Project Structure

```
frontend/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── auth/             # Authentication (Login, OTP verification)
│   │   ├── dashboard/        # Dashboard and admin dashboard
│   │   ├── user-management/  # User management functionality
│   │   ├── property-management/ # Property management and details
│   │   ├── tokenization/     # Tokenization dashboard
│   │   ├── secondary-marketplace/ # Secondary marketplace
│   │   ├── investment-oversight/ # Investment oversight
│   │   ├── role-management/  # Role management
│   │   ├── settings/         # Settings management
│   │   └── profile/          # User profile
│   ├── shared/               # Shared utilities and components
│   │   ├── lib/             # Shared library utilities
│   │   └── hooks/           # Shared React hooks
│   ├── components/           # UI components
│   │   └── ui/              # Reusable UI components (shadcn/ui)
│   ├── services/             # API and external service integrations
│   ├── utils/                # Utility functions
│   ├── constants/            # Application constants
│   ├── types/                # TypeScript type definitions
│   ├── assets/               # Static assets
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
└── README.md                # This file
```

## Architecture Principles

### Feature-Based Organization
- Each feature is self-contained in its own folder
- Features export their components through index.ts files
- Promotes modularity and maintainability

### Shared Resources
- Common utilities and hooks are placed in the `shared/` folder
- Reusable UI components are in `components/ui/`
- Services handle API calls and external integrations

### TypeScript Integration
- Strongly typed throughout the application
- Shared types in `types/` folder
- Zod schemas for runtime validation

### State Management
- React Query for server state management
- Local component state for UI state
- Session storage for authentication

## Key Features

### Authentication Flow
- Login with email/password
- OTP verification via email/SMS
- Session-based authentication

### Dashboard
- Real-time metrics and analytics
- Interactive charts and graphs
- Platform activity monitoring

### Property Management
- Property listing and management
- Status tracking (Live, Pending, Rejected)
- Property details and tokenization

### User Management
- User profile management
- Role-based access control
- Activity tracking

### Tokenization
- Token sale management
- Freeze/unfreeze functionality
- Blockchain integration

### Secondary Marketplace
- Token trading platform
- Listing management
- Trade logging

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries

### Code Organization
- One component per file
- Use barrel exports (index.ts files)
- Keep components small and focused

### Styling
- Tailwind CSS for styling
- CSS variables for theming
- Responsive design principles

### API Integration
- Use React Query for all API calls
- Centralized API endpoints in constants
- Proper error handling and loading states

## Getting Started

This frontend is part of a full-stack application. The build process and development server are managed at the root level of the project.

## Build Process

The frontend is built using Vite and serves the React application. All build configurations are handled at the project root level.