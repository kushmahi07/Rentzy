import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

// Auth middleware types
declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: any;
  session: session.Session & Partial<session.SessionData>;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check if user is authenticated via session
  if (req.session?.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ success: false, message: "Authentication required" });
  }
}