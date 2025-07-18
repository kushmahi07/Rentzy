import { Router } from 'express';
import CreateAdminController from '../controllers/create-admin.controller';
import { GetAdminsController } from '../controllers/get-admins.controller';
import { GetAdminCountsController } from '../controllers/get-admin-counts.controller';
import { UpdateAdminController } from '../controllers/update-admin.controller';
import { createAdminValidator, updateAdminValidator, getAdminsValidator } from '../validators/admin-management.validator';
import { requireAdminAuth } from '../../../middleware/admin-auth.middleware';

const router = Router();

// Initialize controllers
const createAdminController = new CreateAdminController();
const getAdminsController = new GetAdminsController();
const getAdminCountsController = new GetAdminCountsController();
const updateAdminController = new UpdateAdminController();

// Middleware to validate request body
const validateBody = (schema: any) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail: any) => detail.message)
      });
    }
    next();
  };
};

// Middleware to validate query parameters
const validateQuery = (schema: any) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail: any) => detail.message)
      });
    }
    next();
  };
};

// Routes
router.post(
  '/create',
  requireAdminAuth,
  validateBody(createAdminValidator),
  createAdminController.create.bind(createAdminController)
);

router.get(
  '/',//admin managemnet listing api endpoint adminmnagemnet
  requireAdminAuth,
  validateQuery(getAdminsValidator),
  getAdminsController.getAll
);

router.get(
  '/counts',
  requireAdminAuth,
  getAdminCountsController.getCounts
);

router.get(
  '/:id',//admin details
  requireAdminAuth,
  getAdminsController.getById
);

router.put(
  '/:id',//update admin 
  requireAdminAuth,
  validateBody(updateAdminValidator),
  updateAdminController.update
);

router.patch(
  '/:id/activate',
  requireAdminAuth,
  updateAdminController.activate
);

router.patch(
  '/:id/deactivate',
  requireAdminAuth,
  updateAdminController.deactivate
);

router.delete(
  '/:id',
  requireAdminAuth,
  updateAdminController.delete
);

export default router;