
import { Router } from 'express';
import { getUsers } from '../controllers/get-users.controller';
import { getUserById } from '../controllers/get-user-by-id.controller';
import { validateGetUsersQuery, validateGetUserByIdParams } from '../validators/user-management.validator';

const router = Router();

// User management routes
router.get('/', validateGetUsersQuery, getUsers);
router.get('/:id', validateGetUserByIdParams, getUserById);

export default router;
