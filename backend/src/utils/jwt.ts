import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: string;
  name: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d", algorithm: "HS256" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET, { algorithms: ["HS256"] }) as AdminTokenPayload;
  } catch {
    return null;
  }
}

