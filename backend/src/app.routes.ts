import { Router } from 'express';
import authRoutes from './modules/auth/routes/auth.route';
import dashboardRoutes from './modules/dashboard/routes/dashboard.route';
import adminManagementRoutes from './modules/admin-management/routes/admin-management.route';
import userManagementRoutes from './modules/user-management/routes/user-management.route';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/property-managers', adminManagementRoutes);
router.use('/users', userManagementRoutes);

export default router;