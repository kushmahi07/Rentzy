
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../../../responses';

export const validateDashboardQuery = (req: Request, res: Response, next: NextFunction) => {
  const { timeRange } = req.query;

  if (timeRange && !['24h', '7d', '30d'].includes(timeRange as string)) {
    return errorResponse(res, 'Invalid time range. Allowed values: 24h, 7d, 30d', 400);
  }

  next();
};

export const validateMetricsRequest = (req: Request, res: Response, next: NextFunction) => {
  // Add any specific validation for metrics request if needed
  next();
};
