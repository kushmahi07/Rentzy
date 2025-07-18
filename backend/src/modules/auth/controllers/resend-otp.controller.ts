
import { Request, Response } from 'express';
import AdminModel from '../../../models/admin.model';

export class ResendOtpController {
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

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.body;
      
      console.log('[RESEND OTP] Request:', { sessionId });

      // Find the admin using sessionId
      const admin = await AdminModel.findById(sessionId).select('+resendCount');
      if (!admin) {
        console.log(`[RESEND OTP] Admin not found for sessionId: ${sessionId}`);
        res.status(400).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      console.log(`[RESEND OTP] Admin found: ${admin.email}, resendCount: ${admin.resendCount}`);

      // Check if admin account is active
      if (!admin.isActive) {
        res.status(401).json({
          success: false,
          message: "Admin account is disabled"
        });
        return;
      }

      // Check resend limit (max 3 resends)
      if (admin.resendCount >= 3) {
        res.status(429).json({
          success: false,
          message: "Maximum resend attempts exceeded. Please try logging in again."
        });
        return;
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const expiresAt = this.createOTPExpiry();
      
      // Update admin with new OTP and increment resend count
      await AdminModel.findByIdAndUpdate(sessionId, {
        otp,
        otpExpires: expiresAt,
        resendCount: admin.resendCount + 1
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

      console.log(`[RESEND OTP] OTP sent successfully to ${admin.email}`);

      res.json({
        success: true,
        message: "OTP resent successfully",
        expiresAt: expiresAt.toISOString(),
        resendCount: admin.resendCount + 1,
        emailSent,
        smsSent,
        // Include OTP in response for development/testing purposes
        ...(process.env.NODE_ENV === 'development' && { otp })
      });

    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid request data"
      });
    }
  };
}
