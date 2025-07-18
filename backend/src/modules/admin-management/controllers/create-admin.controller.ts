import { Request, Response } from 'express';
import AdminModel from '../../../models/admin.model';
import { sendAdminAccountEmail } from '../../../helpers/email.helper';

export default class CreateAdminController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role, accessRights, additionalNotes } =
        req.body;

      // Check if admin already exists
      const existingAdmin = await AdminModel.findOne({
        $or: [
          { email: email.toLowerCase() },
          {
            'phone.countryCode': phone.countryCode,
            'phone.mobile': phone.mobile,
          },
        ],
      });

      if (existingAdmin) {
        res.status(400).json({
          success: false,
          message: 'Admin already exists with this email or phone number',
        });
        return;
      }

      // Auto-generate password
      const defaultPassword = 'admin@123';

      // Create new admin - password will be automatically hashed by pre-save middleware
      const newAdmin = new AdminModel({
        name,
        email: email.toLowerCase(),
        phone,
        password: defaultPassword,
        role,
        isSuperAdmin: false,
        isActive: true,
        accessRights,
        additionalNotes,
      });

      await newAdmin.save();

      // Send admin account creation email
      try {
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/login`;
        await sendAdminAccountEmail(
          email.toLowerCase(),
          name.split(' ')[0], // First name
          defaultPassword,
          loginUrl
        );
        console.log(`📧 Admin account email sent to ${email}`);
      } catch (emailError: any) {
        console.error(
          '❌ Failed to send admin account email:',
          emailError.message
        );
        // Don't fail the admin creation if email fails
      }

      // Remove password from response
      const adminResponse = newAdmin.toJSON();
      delete adminResponse.password;

      res.status(201).json({
        success: true,
        message: 'Sub-admin created successfully',
        data: {
          admin: adminResponse,
          defaultPassword: defaultPassword,
        },
      });
    } catch (error: any) {
      console.error('Create admin error:', error);

      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Admin already exists with this email or phone number',
        });
        return;
      }

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
