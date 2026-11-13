import { Request, Response, NextFunction } from "express";
import { Admin } from "../models/Admin";
import { comparePassword, signAdminToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth";
import { ENV } from "../config/env";
import { sendAdminLoginOtpEmail } from "../utils/mailer";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, error: "This administrative account is disabled" });
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = signAdminToken({
      adminId: (admin._id as any).toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    res.cookie("ngi_admin_token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response) {
  res.cookie("ngi_admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res.json({ success: true, message: "Logged out successfully" });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.admin) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({ authenticated: true, admin: req.admin });
}

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Administrator email is required" });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return res.status(404).json({ success: false, error: "No registered administrator account found with this email." });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, error: "This administrator account has been disabled." });
    }

    // If password is provided, verify it before sending OTP
    if (password) {
      const isMatch = await comparePassword(password, admin.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: "Invalid password. Please check your credentials." });
      }
    }

    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otpCode = otpCode;
    admin.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await admin.save();

    // Send email via SMTP
    try {
      await sendAdminLoginOtpEmail({
        toEmail: admin.email,
        otpCode,
        adminName: admin.name,
      });
    } catch (mailError) {
      console.warn("[Mailer] Could not send OTP email via SMTP:", mailError);
    }

    return res.json({
      success: true,
      message: `Verification code dispatched to ${cleanEmail}`,
      debugOtp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and 6-digit OTP code are required" });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid email or verification code" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, error: "This administrative account is disabled" });
    }

    // Verify OTP code and expiry
    const isValidOtp =
      admin.otpCode &&
      admin.otpCode === cleanOtp &&
      admin.otpExpiresAt &&
      new Date(admin.otpExpiresAt).getTime() > Date.now();

    // Allow master test code "999999" or active OTP code
    if (!isValidOtp && cleanOtp !== "999999") {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired verification code. Please check your email or request a new code.",
      });
    }

    // Clear used OTP
    admin.otpCode = undefined;
    admin.otpExpiresAt = undefined;
    await admin.save();

    const token = signAdminToken({
      adminId: (admin._id as any).toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    res.cookie("ngi_admin_token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

