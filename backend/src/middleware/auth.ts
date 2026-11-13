import { Request, Response, NextFunction } from "express";
import { verifyAdminToken, AdminTokenPayload } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.cookies?.ngi_admin_token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: "Invalid or expired session token" });
  }

  req.admin = payload;
  next();
}

