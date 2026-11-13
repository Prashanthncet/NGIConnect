import { Request, Response, NextFunction } from "express";
import { Admin } from "../models/Admin";
import { Institution } from "../models/Institution";
import { Form, FormVersion } from "../models/Form";
import { Registration } from "../models/Registration";
import { hashPassword } from "../utils/jwt";
import { initialInstitutions, defaultNcetFields, defaultNcmsFields } from "../utils/seedData";
import { ENV } from "../config/env";

export async function seedDatabase(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Seed Institutions if not exist
    for (const inst of initialInstitutions) {
      const exists = await Institution.findOne({ shortName: inst.shortName });
      if (!exists) {
        await Institution.create(inst);
      }
    }

    // 2. Seed Default Admin if not exist
    let admin = await Admin.findOne({ email: ENV.ADMIN_EMAIL.toLowerCase().trim() });
    if (!admin) {
      const passwordHash = await hashPassword(ENV.ADMIN_PASSWORD);
      admin = await Admin.create({
        name: ENV.ADMIN_NAME,
        email: ENV.ADMIN_EMAIL.toLowerCase().trim(),
        passwordHash,
        role: "super_admin",
        isActive: true,
      });
    }

    // 3. Seed NCET Form if not exist
    let ncetForm = await Form.findOne({ slug: "ncet-registration-2026" });
    if (!ncetForm) {
      ncetForm = await Form.create({
        title: "NCET Community Registration 2026",
        description:
          "Official registration for students, alumni, and faculty of Nagarjuna College of Engineering and Technology (Autonomous, Affiliated to VTU).",
        institutionShortName: "NCET",
        slug: "ncet-registration-2026",
        status: "published",
        currentPublishedVersion: 1,
        fields: defaultNcetFields,
        settings: {
          allowMultipleSubmissions: false,
          uniqueField: "email",
          submitButtonText: "Submit Registration",
          successMessage: "Thank you for registering with NCET. Your registration ID has been generated.",
          requiresVerification: true,
        },
        createdBy: admin._id,
      });

      await FormVersion.create({
        formId: ncetForm._id,
        versionNumber: 1,
        fields: defaultNcetFields,
        settings: ncetForm.settings,
        publishedAt: new Date(),
        publishedBy: admin._id,
      });
    }

    // 4. Seed NCMS Form if not exist
    let ncmsForm = await Form.findOne({ slug: "ncms-registration-2026" });
    if (!ncmsForm) {
      ncmsForm = await Form.create({
        title: "NCMS Management & Student Registration 2026",
        description:
          "Official registration for management and professional academic students of Nagarjuna College of Management Studies (Affiliated to BNU).",
        institutionShortName: "NCMS",
        slug: "ncms-registration-2026",
        status: "published",
        currentPublishedVersion: 1,
        fields: defaultNcmsFields,
        settings: {
          allowMultipleSubmissions: false,
          uniqueField: "email",
          submitButtonText: "Submit Registration",
          successMessage: "Thank you for registering with NCMS. Your admission inquiry slip is ready.",
          requiresVerification: true,
        },
        createdBy: admin._id,
      });

      await FormVersion.create({
        formId: ncmsForm._id,
        versionNumber: 1,
        fields: defaultNcmsFields,
        settings: ncmsForm.settings,
        publishedAt: new Date(),
        publishedBy: admin._id,
      });
    }

    // 5. Clean up any previous dummy registrations
    await Registration.deleteMany({
      candidateEmail: { $in: ["aarav.sharma@gmail.com", "pooja.hegde@ncms.co.in"] },
    });

    return res.json({
      success: true,
      message: "Database initialized successfully with institutions, default admin, and published forms. No dummy registrations created.",
      adminEmail: admin.email,
    });
  } catch (error) {
    next(error);
  }
}
