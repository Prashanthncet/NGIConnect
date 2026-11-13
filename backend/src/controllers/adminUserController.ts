import { Response, NextFunction } from "express";
import { Admin } from "../models/Admin";
import { hashPassword } from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getAdminUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const users = await Admin.find({}, "-passwordHash -otpCode").sort({ createdAt: -1 });
    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function createAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required" });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ success: false, error: "An administrator with this email already exists" });
    }

    const initialPassword = password || "AdminNGI@2026";
    const passwordHash = await hashPassword(initialPassword);

    const newAdmin = new Admin({
      name: String(name).trim(),
      email: cleanEmail,
      role: role && ["super_admin", "admin", "coordinator"].includes(role) ? role : "admin",
      passwordHash,
      isActive: true,
    });

    await newAdmin.save();

    return res.status(201).json({
      success: true,
      message: "Administrator account created successfully",
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, role, isActive, password } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Administrator not found" });
    }

    if (name) admin.name = String(name).trim();
    if (role && ["super_admin", "admin", "coordinator"].includes(role)) {
      admin.role = role;
    }
    if (isActive !== undefined) {
      admin.isActive = Boolean(isActive);
    }
    if (password && String(password).trim().length >= 6) {
      admin.passwordHash = await hashPassword(String(password).trim());
    }

    await admin.save();

    return res.json({
      success: true,
      message: "Administrator account updated successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (req.admin?.adminId === id) {
      return res.status(400).json({ success: false, error: "You cannot delete your own active administrator account" });
    }

    const totalAdmins = await Admin.countDocuments({ isActive: true });
    if (totalAdmins <= 1) {
      return res.status(400).json({ success: false, error: "Cannot delete the sole remaining administrator account" });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Administrator not found" });
    }

    return res.json({ success: true, message: "Administrator account deleted successfully" });
  } catch (error) {
    next(error);
  }
}

