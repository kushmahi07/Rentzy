# Local Setup Guide - Rentzy Admin Platform

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **MongoDB** (for database)
   - **Option A: Local MongoDB Installation**
     - Download from: https://www.mongodb.com/try/download/community
     - Follow installation guide for your operating system
   - **Option B: MongoDB Atlas (Cloud - Recommended)**
     - Create free account at: https://www.mongodb.com/atlas
     - Create a new cluster and get connection string

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd rentzy-admin-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=mongodb://localhost:27017/rentzy-admin
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/rentzy-admin

# Application Configuration
NODE_ENV=development
PORT=5000

# Session Configuration (generate random strings for production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Start MongoDB service:
   - **Windows**: MongoDB starts automatically after installation
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

2. Verify MongoDB is running:
   ```bash
   mongosh --eval "db.runCommand({ping: 1})"
   ```

#### Option B: MongoDB Atlas
1. Create a cluster in MongoDB Atlas
2. Get your connection string
3. Replace the `DATABASE_URL` in `.env` with your Atlas connection string

### 5. Initialize Database (Optional)
The application will automatically create the database and collections when you first run it. Sample data will be populated automatically.

### 6. Start the Application

#### Development Mode (Recommended)
```bash
npm run dev
```

This command will:
- Start the backend server on port 5000
- Start the frontend development server with hot reload
- Open your browser automatically

#### Production Mode
```bash
npm run build
npm start
```

### 7. Access the Application

1. **Frontend**: http://localhost:5173 (development) or http://localhost:5000 (production)
2. **Backend API**: http://localhost:5000/api

### 8. Login Credentials

Use these default admin credentials:
- **Email**: admin@rentzy.com
- **Password**: admin123

The system uses 2FA (Two-Factor Authentication):
1. Enter your credentials
2. An OTP will be sent (check browser console in development mode)
3. Enter the OTP to access the dashboard

## Project Structure

```
rentzy-admin-platform/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   └── storage/        # Database storage layer
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── features/       # Feature-based components
│   │   ├── shared/         # Shared utilities
│   │   └── assets/         # Static assets
├── server/                 # Server configuration
├── shared/                 # Shared types and schemas
├── .env                    # Environment variables
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server (backend + frontend)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run backend` - Start only backend server
- `npm run frontend` - Start only frontend server

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Database Connection Error**
   - Verify MongoDB is running
   - Check DATABASE_URL in .env file
   - Ensure database credentials are correct

3. **Module Not Found Errors**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Permission Errors (macOS/Linux)**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

### Development Mode Features

- **Hot Reload**: Frontend automatically refreshes on code changes
- **API Proxy**: Frontend proxies API requests to backend
- **Console Logging**: OTP codes are displayed in browser console
- **Error Overlay**: Detailed error messages in development

### Production Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your-production-mongodb-url
   export SESSION_SECRET=your-production-session-secret
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure database connection is working
4. Check if all required environment variables are set

## Features Available

- **Admin Authentication** with 2FA
- **User Management** with role-based access
- **Property Management** (Live, Pending, Rejected)
- **Tokenization Dashboard** with freeze/unfreeze functionality
- **Secondary Marketplace** management
- **Investment Oversight** and monitoring
- **Settings Management** for platform configuration
- **Role Management** for sub-admin accounts

The application is ready to use once you complete the setup steps above!