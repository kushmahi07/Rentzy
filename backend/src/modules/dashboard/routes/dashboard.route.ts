import { Router } from 'express';
import { getMetrics } from '../controllers/get-metrics.controller';

const router = Router();

// Note: Admin authentication middleware can be applied here when implemented

// Dashboard metrics endpoint
router.get('/metrics', getMetrics);

export default router;