import { Request, Response } from 'express';
import AdminModel from '../../../models/admin.model';

export class GetAdminsController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, role, isActive } = req.query;

      // Build filter object
      const filter: any = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } }
        ];
      }

      if (role) {
        filter.role = role;
      }

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [admins, total] = await Promise.all([
        AdminModel.find(filter)
          .select('-password -otp -otpExpires -resendCount')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        AdminModel.countDocuments(filter)
      ]);

      res.json({
        success: true,
        message: "Admins retrieved successfully",
        data: {
          admins,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
            itemsPerPage: Number(limit)
          }
        }
      });

    } catch (error) {
      console.error("Get admins error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const admin = await AdminModel.findById(id)
        .select('-password -otp -otpExpires -resendCount');

      if (!admin) {
        res.status(404).json({
          success: false,
          message: "Admin not found"
        });
        return;
      }

      res.json({
        success: true,
        message: "Admin retrieved successfully",
        data: { admin }
      });

    } catch (error) {
      console.error("Get admin by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
}