
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';

const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  userType: Joi.string().valid('renter', 'investor').optional(),
  role: Joi.string().valid('all', 'renter', 'investor').optional(),
  kyc: Joi.string().valid('all', 'pending', 'inprogress', 'verified', 'rejected').optional(),
  sortBy: Joi.string().valid('createdAt', 'email', 'name.firstName', 'name.lastName', 'name.fullName').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

const getUserByIdParamsSchema = Joi.object({
  id: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Invalid user ID format'
    })
});

export const validateGetUsersQuery = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = getUsersQuerySchema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorDetails
    });
    return;
  }

  req.query = value;
  next();
};

export const validateGetUserByIdParams = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = getUserByIdParamsSchema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorDetails
    });
    return;
  }

  req.params = value;
  next();
};
