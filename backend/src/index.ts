import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database/connection';
import { sharedStorage } from '../../shared-storage';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${timestamp} [express] ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  
  next();
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Register routes
    await registerRoutes(app, sharedStorage);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();