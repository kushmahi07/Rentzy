import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../../responses';
import Property from '../../../models/property.model';
import PropertyBooking from '../../../models/propertyBooking.model';
import User from '../../../models/user.model';
import { PROPERTY_STATUS, BLOCKCHAIN_STATUS } from '../../../core/constants/property.constant';

export const getMetrics = async (req: Request, res: Response) => {
  try {
    // Total property listed: status is approved and blockchainStatus is listed
    const totalPropertyListed = await Property.countDocuments({
      status: PROPERTY_STATUS.APPROVED,
      blockchainStatus: BLOCKCHAIN_STATUS.LISTED
    });

    // Total pending request: status is pending
    const totalPendingRequest = await Property.countDocuments({
      status: PROPERTY_STATUS.PENDING
    });

    // Total bookings
    const totalBookings = await PropertyBooking.countDocuments({});

    // Total renters (users with renter role)
    const totalRenters = await User.countDocuments({
      userRoles: { $in: ['renter'] }
    });

    // Total investors (users with investor role)
    const totalInvestors = await User.countDocuments({
      userRoles: { $in: ['investor'] }
    });

    // Bookings today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const bookingsToday = await PropertyBooking.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const metrics = {
      totalPropertyListed,
      totalPendingRequest,
      totalBookings,
      totalRenters,
      totalInvestors,
      bookingsToday
    };

    return res.status(200).json(successResponse('Dashboard metrics retrieved successfully', metrics));
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return res.status(500).json(errorResponse('Failed to retrieve dashboard metrics', 'INTERNAL_ERROR'));
  }
};