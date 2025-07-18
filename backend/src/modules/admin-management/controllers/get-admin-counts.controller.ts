import { Request, Response } from 'express';
import AdminModel from '../../../models/admin.model';

export class GetAdminCountsController {
  getCounts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Count all sub-admins (exclude super admins)
      const [totalSubAdmins, activeSubAdmins, inactiveSubAdmins] = await Promise.all([
        AdminModel.countDocuments({ isSuperAdmin: false }),
        AdminModel.countDocuments({ isSuperAdmin: false, isActive: true }),
        AdminModel.countDocuments({ isSuperAdmin: false, isActive: false })
      ]);

      res.json({
        success: true,
        message: "Admin counts retrieved successfully",
        data: {
          totalSubAdmins,
          activeSubAdmins,
          inactiveSubAdmins
        }
      });

    } catch (error) {
      console.error("Get admin counts error:", error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}