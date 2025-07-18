import { Request, Response } from 'express';
import AdminModel from '../../../models/admin.model';
import jwt from 'jsonwebtoken';

export class VerifyOtpController {
  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otp, sessionId } = req.body;
      
      console.log('[OTP VERIFY] Request:', { otp: otp ? '***' : 'missing', sessionId });

      // Find the admin with OTP details using sessionId
      const admin = await AdminModel.findById(sessionId).select('+otp +otpExpires');
      if (!admin) {
        res.status(400).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      // Check if admin has OTP
      if (!admin.otp || !admin.otpExpires) {
        res.status(400).json({
          success: false,
          message: "No OTP found. Please request a new one."
        });
        return;
      }

      // Check if OTP is expired
      if (admin.otpExpires < new Date()) {
        // Clear expired OTP
        await AdminModel.findByIdAndUpdate(sessionId, {
          $unset: { otp: 1, otpExpires: 1 }
        });
        res.status(400).json({
          success: false,
          message: "OTP has expired"
        });
        return;
      }

      // Verify OTP
      if (admin.otp !== otp) {
        res.status(400).json({
          success: false,
          message: "Invalid OTP"
        });
        return;
      }

      // Clear OTP after successful verification
      await AdminModel.findByIdAndUpdate(sessionId, {
        $unset: { otp: 1, otpExpires: 1 }
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: admin._id, 
          email: admin.email, 
          role: admin.role,
          isSuperAdmin: admin.isSuperAdmin
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Set token as httpOnly cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        success: true,
        message: "OTP verified successfully",
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          isSuperAdmin: admin.isSuperAdmin
        },
        token
      });

    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid request data"
      });
    }
  };
}