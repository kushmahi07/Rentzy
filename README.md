# Rentzy Admin Platform

A comprehensive real estate investment platform with blockchain-powered property tokenization, built with modern web technologies.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other configurations
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Admin Login: admin@rentzy.com / admin123

## 📋 Detailed Setup Guide

For complete setup instructions, including database configuration, troubleshooting, and deployment steps, see: **[LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)**

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **UI**: Tailwind CSS + Shadcn/ui components
- **Authentication**: 2FA with OTP verification

## 🔧 Key Features

- **Admin Dashboard** with real-time metrics
- **Property Management** (Live, Pending, Rejected)
- **User Management** with role-based access control
- **Tokenization Dashboard** with freeze/unfreeze functionality
- **Secondary Marketplace** management
- **Investment Oversight** and monitoring
- **Settings Management** for platform configuration

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run backend` - Backend only
- `npm run frontend` - Frontend only

## 📁 Project Structure

```
├── backend/         # Express.js API server
├── client/          # React frontend application
├── server/          # Server configuration
├── shared/          # Shared types and schemas
└── docs/            # Documentation
```

## 🔑 Default Login

- **Email**: admin@rentzy.com
- **Password**: admin123
- **2FA**: OTP codes are displayed in browser console during development

## 🛠️ Development

The application runs in development mode with:
- Hot reload for frontend changes
- API proxy configuration
- Console logging for OTP codes
- Error overlay for debugging

## 📚 Documentation

- [Local Setup Guide](./LOCAL_SETUP_GUIDE.md) - Complete setup instructions
- [API Documentation](./PROPERTY_API_DOCUMENTATION.md) - API endpoints and usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the setup guide
2. Review console logs
3. Verify database connection
4. Ensure all environment variables are set

---

Built with ❤️ for modern real estate investment