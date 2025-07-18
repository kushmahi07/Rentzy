
import Joi from 'joi';

export const createAdminValidator = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  phone: Joi.object({
    countryCode: Joi.string()
      .pattern(/^\+\d{1,4}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid country code (e.g., +1, +91)',
        'string.empty': 'Country code is required'
      }),
    mobile: Joi.string()
      .pattern(/^\d{7,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number',
        'string.empty': 'Mobile number is required'
      })
  }).required(),

  role: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Role is required'
    }),

  accessRights: Joi.object({
    changeProperty: Joi.boolean().required(),
    approveProperty: Joi.boolean().required(),
    freezeTokenSale: Joi.boolean().required(),
    approveTrades: Joi.boolean().required()
  }).required()
    .messages({
      'object.base': 'Access rights are required'
    }),

  additionalNotes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Additional notes cannot exceed 500 characters'
    })
});

export const updateAdminValidator = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),

  phone: Joi.object({
    countryCode: Joi.string()
      .pattern(/^\+\d{1,4}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid country code (e.g., +1, +91)'
      }),
    mobile: Joi.string()
      .pattern(/^\d{7,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid mobile number'
      })
  }).optional(),

  role: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.empty': 'Role cannot be empty'
    }),

  accessRights: Joi.object({
    changeProperty: Joi.boolean().required(),
    approveProperty: Joi.boolean().required(),
    freezeTokenSale: Joi.boolean().required(),
    approveTrades: Joi.boolean().required()
  }).optional(),

  additionalNotes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Additional notes cannot exceed 500 characters'
    }),

  isActive: Joi.boolean().optional()
});

export const getAdminsValidator = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().trim().optional(),
  role: Joi.string().trim().optional(),
  isActive: Joi.string().valid('true', 'false').optional()
});
