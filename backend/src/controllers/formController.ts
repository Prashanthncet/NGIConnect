import { Request, Response, NextFunction } from "express";
import { Form, FormVersion } from "../models/Form";
import { defaultNcetFields, defaultNcmsFields } from "../utils/seedData";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getForms(req: Request, res: Response, next: NextFunction) {
  try {
    const { institution, slug } = req.query;

    const query: any = {};
    if (institution) query.institutionShortName = String(institution).toUpperCase();
    if (slug) query.slug = String(slug);

    let forms = await Form.find(query).sort({ updatedAt: -1 });

    // Auto-seed default forms if empty and no specific slug
    if (forms.length === 0 && !slug) {
      const ncet = await Form.create({
        title: "NCET Community Registration 2026",
        description:
          "Official registration for students, alumni, and faculty of Nagarjuna College of Engineering and Technology (Autonomous, VTU).",
        institutionShortName: "NCET",
        slug: "ncet-registration-2026",
        status: "published",
        currentPublishedVersion: 1,
        fields: defaultNcetFields,
        settings: {
          allowMultipleSubmissions: false,
          uniqueField: "email",
          submitButtonText: "Submit Registration",
        },
      });
      await FormVersion.create({
        formId: ncet._id,
        versionNumber: 1,
        fields: defaultNcetFields,
        settings: ncet.settings,
        publishedAt: new Date(),
      });

      const ncms = await Form.create({
        title: "NCMS Management & Student Registration 2026",
        description:
          "Official registration for management and professional academic students of Nagarjuna College of Management Studies (BNU).",
        institutionShortName: "NCMS",
        slug: "ncms-registration-2026",
        status: "published",
        currentPublishedVersion: 1,
        fields: defaultNcmsFields,
        settings: {
          allowMultipleSubmissions: false,
          uniqueField: "email",
          submitButtonText: "Submit Registration",
        },
      });
      await FormVersion.create({
        formId: ncms._id,
        versionNumber: 1,
        fields: defaultNcmsFields,
        settings: ncms.settings,
        publishedAt: new Date(),
      });

      forms = await Form.find(query);
    }

    return res.json({ success: true, data: forms });
  } catch (error) {
    next(error);
  }
}

export async function getFormById(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = req.params.id;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

    const form = await Form.findOne(query);
    if (!form) {
      return res.status(404).json({ success: false, error: "Form not found" });
    }

    return res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
}

export async function createForm(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const admin = req.admin;
    const body = req.body;

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now();

    const form = await Form.create({
      title: body.title,
      description: body.description || "",
      institutionShortName: body.institutionShortName || "NCET",
      slug,
      status: "draft",
      currentPublishedVersion: 1,
      fields: body.fields || [],
      settings: body.settings || {},
      createdBy: admin?.adminId,
    });

    return res.status(201).json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
}

export async function updateForm(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = req.body;

    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ success: false, error: "Form not found" });
    }

    if (body.title !== undefined) form.title = body.title;
    if (body.description !== undefined) form.description = body.description;
    if (body.institutionShortName !== undefined) form.institutionShortName = body.institutionShortName;
    if (body.fields !== undefined) form.fields = body.fields;
    if (body.settings !== undefined) form.settings = { ...form.settings, ...body.settings };
    if (body.status !== undefined) form.status = body.status;

    await form.save();

    return res.json({ success: true, data: form, message: "Draft saved successfully" });
  } catch (error) {
    next(error);
  }
}

export async function publishForm(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ success: false, error: "Form not found" });
    }

    const newVersionNumber = (form.currentPublishedVersion || 0) + 1;
    form.currentPublishedVersion = newVersionNumber;
    form.status = "published";
    await form.save();

    await FormVersion.create({
      formId: form._id,
      versionNumber: newVersionNumber,
      fields: form.fields,
      settings: form.settings,
      publishedAt: new Date(),
      publishedBy: req.admin?.adminId,
    });

    return res.json({
      success: true,
      message: `Form successfully published as version v${newVersionNumber}`,
      version: newVersionNumber,
      form,
    });
  } catch (error) {
    next(error);
  }
}

