
import { MongoStorage } from "./backend/src/storage/mongo-storage";

// Create a single shared storage instance using MongoDB
export const sharedStorage = new MongoStorage();
