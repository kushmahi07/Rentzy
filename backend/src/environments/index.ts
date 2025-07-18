import { developmentConfig } from './development.js';
import { productionConfig } from './production.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

export const environment = NODE_ENV === 'production' ? productionConfig : developmentConfig;

export type Environment = typeof environment;
