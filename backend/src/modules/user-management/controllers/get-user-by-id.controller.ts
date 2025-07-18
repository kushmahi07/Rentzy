import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../../responses';
import User from '../../../models/user.model';
import mongoose from 'mongoose';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(errorResponse('Invalid user ID format', 'INVALID_ID'));
    }

    const user = await User.findById(id, '-password');

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'USER_NOT_FOUND'));
    }

    return res.status(200).json(successResponse('User retrieved successfully', user));
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json(errorResponse('Failed to retrieve user', 'INTERNAL_ERROR'));
  }
};