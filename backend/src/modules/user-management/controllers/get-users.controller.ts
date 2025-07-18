import { Request, Response } from 'express';
import User from '../../../models/user.model';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      userType, 
      role, 
      kyc, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { 'name.firstName': { $regex: search, $options: 'i' } },
        { 'name.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'phone.mobile': { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (userType && userType !== 'all') {
      query.userType = { $in: [userType] };
    }

    if (kyc && kyc !== 'all') {
      query['kyc.status'] = kyc;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(totalUsers / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    const pagination = {
      currentPage: pageNum,
      totalPages,
      totalUsers,
      hasNextPage,
      hasPrevPage
    };

    // Ensure JSON response with proper headers
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        users,
        pagination
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};