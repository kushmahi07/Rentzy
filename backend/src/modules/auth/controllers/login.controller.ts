
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import AdminModel from '../../../models/admin.model';

export class LoginController {
  // Utility functions
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private createOTPExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 2); // 2 minutes from now
    return expiry;
  }

  private async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    console.log(`[EMAIL] Sending OTP ${otp} to admin ${email}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }

  private async sendOTPSMS(phone: string, otp: string): Promise<boolean> {
    console.log(`[SMS] Sending OTP ${otp} to admin ${phone}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(`[LOGIN] Request body:`, req.body);
      const { email, password } = req.body;
      
      // Find admin by email and include password for verification
      const admin = await AdminModel.findOne({ email }).select('+password');
      if (!admin) {
        console.log(`[LOGIN] Admin not found for email: ${email}`);
        res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
        return;
      }

      console.log(`[LOGIN] Admin found for email: ${email}, ID: ${admin._id}`);
      console.log(`[LOGIN] Admin password from DB:`, admin.password);
      console.log(`[LOGIN] Input password:`, password);

      // Verify password using bcrypt directly
      const isPasswordValid = await bcrypt.compare(password, admin.password!);
      if (!isPasswordValid) {
        console.log(`[LOGIN] Invalid password for email: ${email}`);
        res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
        return;
      }

      console.log(`[LOGIN] Password verified successfully for email: ${email}`);

      if (!admin.isActive) {
        res.status(401).json({
          success: false,
          message: "Admin account is disabled"
        });
        return;
      }

      // Get admin ID as string
      const adminId = admin._id.toString();

      // Generate new OTP and update admin
      const otp = this.generateOTP();
      const expiresAt = this.createOTPExpiry();
      
      // Update admin with new OTP and reset resend count
      await AdminModel.findByIdAndUpdate(adminId, {
        otp,
        otpExpires: expiresAt,
        resendCount: 0
      });

      // Send OTP via email and SMS
      const emailSent = await this.sendOTPEmail(admin.email, otp);
      const smsSent = await this.sendOTPSMS(admin.phone, otp);

      if (!emailSent && !smsSent) {
        res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again."
        });
        return;
      }

      res.json({
        success: true,
        message: "OTP sent successfully to admin",
        sessionId: adminId,
        expiresAt: expiresAt.toISOString(),
        emailSent,
        smsSent,
        // Include OTP in response for development/testing purposes
        ...(process.env.NODE_ENV === 'development' && { otp })
      });

    } catch (error) {
      console.error("Admin login error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid request data"
      });
    }
  };
}
