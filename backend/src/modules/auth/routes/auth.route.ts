
import { Router } from 'express';
import { LoginController } from '../controllers/login.controller';
import { VerifyOtpController } from '../controllers/verify-otp.controller';
import { ResendOtpController } from '../controllers/resend-otp.controller';
import { requireAdminAuth } from '../../../middleware/admin-auth.middleware';
import { validateAdminLoginRequest, validateOtpRequest, validateResendOtpRequest } from '../validators/auth.validator';

const router = Router();
const loginController = new LoginController();
const verifyOtpController = new VerifyOtpController();
const resendOtpController = new ResendOtpController();

// Admin authentication routes
router.post('/login', validateAdminLoginRequest, loginController.adminLogin);
router.post('/verify-otp', validateOtpRequest, verifyOtpController.verifyOtp);
router.post('/resend-otp', validateResendOtpRequest, resendOtpController.resendOtp);

export default router;
