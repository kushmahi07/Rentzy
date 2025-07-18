import { Request, Response } from 'express';
import AdminModel from '../../../models/admin.model';

export class UpdateAdminController {
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, phone, role, accessRights, additionalNotes, isActive } = req.body;

      // Check if admin exists
      const existingAdmin = await AdminModel.findById(id);
      if (!existingAdmin) {
        res.status(404).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      // Check for duplicate email or phone (excluding current admin)
      if (email || phone) {
        const duplicateCheck: any = { _id: { $ne: id } };
        const orConditions = [];

        if (email) {
          orConditions.push({ email: email.toLowerCase() });
        }

        if (phone) {
          orConditions.push({ 
            'phone.countryCode': phone.countryCode, 
            'phone.mobile': phone.mobile 
          });
        }

        if (orConditions.length > 0) {
          duplicateCheck.$or = orConditions;
          const duplicate = await AdminModel.findOne(duplicateCheck);

          if (duplicate) {
            res.status(400).json({
              success: false,
              message: "Another admin already exists with this email or phone number"
            });
            return;
          }
        }
      }

      // Update admin
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase();
      if (phone) updateData.phone = phone;
      if (role) updateData.role = role;
      if (accessRights) updateData.accessRights = accessRights;
      if (additionalNotes !== undefined) updateData.additionalNotes = additionalNotes;
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedAdmin = await AdminModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -otp -otpExpires -resendCount');

      res.json({
        success: true,
        message: "Admin updated successfully",
        data: { admin: updatedAdmin }
      });

    } catch (error: any) {
      console.error("Update admin error:", error);

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  async activate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const admin = await AdminModel.findById(id);
      if (!admin) {
        res.status(404).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      // Prevent activation/deactivation of super admin
      if (admin.isSuperAdmin) {
        res.status(403).json({
          success: false,
          message: "Cannot modify super admin status"
        });
        return;
      }

      // Update admin status to active
      const updatedAdmin = await AdminModel.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true, runValidators: true }
      ).select('-password -otp -otpExpires -resendCount');

      res.json({
        success: true,
        message: "Admin activated successfully",
        data: { admin: updatedAdmin }
      });

    } catch (error) {
      console.error("Activate admin error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const admin = await AdminModel.findById(id);
      if (!admin) {
        res.status(404).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      // Prevent activation/deactivation of super admin
      if (admin.isSuperAdmin) {
        res.status(403).json({
          success: false,
          message: "Cannot modify super admin status"
        });
        return;
      }

      // Update admin status to inactive
      const updatedAdmin = await AdminModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, runValidators: true }
      ).select('-password -otp -otpExpires -resendCount');

      res.json({
        success: true,
        message: "Admin deactivated successfully",
        data: { admin: updatedAdmin }
      });

    } catch (error) {
      console.error("Deactivate admin error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const admin = await AdminModel.findById(id);
      if (!admin) {
        res.status(404).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      // Prevent deletion of super admin
      if (admin.isSuperAdmin) {
        res.status(403).json({
          success: false,
          message: "Cannot delete super admin"
        });
        return;
      }

      await AdminModel.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "Admin deleted successfully"
      });

    } catch (error) {
      console.error("Delete admin error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
}