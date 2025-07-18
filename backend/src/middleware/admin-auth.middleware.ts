
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

// Admin auth middleware types
declare module 'express-session' {
  interface SessionData {
    admin?: any;
  }
}

export interface AuthenticatedAdminRequest extends Request {
  admin?: any;
  session: session.Session & Partial<session.SessionData>;
}

export function requireAdminAuth(req: AuthenticatedAdminRequest, res: Response, next: NextFunction) {
  // Check if admin is authenticated via session
  if (req.session?.admin) {
    req.admin = req.session.admin;
    next();
  } else {
    res.status(401).json({ success: false, message: "Admin authentication required" });
  }
}

export function requireSuperAdmin(req: AuthenticatedAdminRequest, res: Response, next: NextFunction) {
  // Check if admin is authenticated and is super admin
  if (req.session?.admin && req.session.admin.isSuperAdmin === true) {
    req.admin = req.session.admin;
    next();
  } else {
    res.status(403).json({ success: false, message: "Super admin access required" });
  }
}
