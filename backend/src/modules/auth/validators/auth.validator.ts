
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'mil', 'int'] } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Password is required',
      'any.required': 'Password is required'
    })
});

const otpVerificationSchema = Joi.object({
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be 6 digits',
      'any.required': 'OTP is required'
    }),
  sessionId: Joi.string()
    .required()
    .messages({
      'any.required': 'Session ID is required'
    })
});

const resendOtpSchema = Joi.object({
  sessionId: Joi.string()
    .required()
    .messages({
      'any.required': 'Session ID is required'
    })
});

export const validateAdminLoginRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = loginValidationSchema.validate(req.body, {
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

  req.body = value;
  next();
};

export const validateOtpRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = otpVerificationSchema.validate(req.body, {
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

  req.body = value;
  next();
};

export const validateResendOtpRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = resendOtpSchema.validate(req.body, {
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

  req.body = value;
  next();
};
