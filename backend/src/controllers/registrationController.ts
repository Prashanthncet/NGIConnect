import { Request, Response, NextFunction } from "express";
import { Form } from "../models/Form";
import { Registration } from "../models/Registration";
import { generateRegistrationId } from "../utils/registrationId";
import { generateRegistrationsExcelBuffer } from "../utils/excelExport";
import { sendRegistrationThankYouEmail } from "../utils/mailer";
import { AuthenticatedRequest } from "../middleware/auth";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function submitRegistration(req: Request, res: Response, next: NextFunction) {
  try {
    const { formId, formSlug, responses, institutionShortName } = req.body;

    if (!responses || typeof responses !== "object") {
      return res.status(400).json({ success: false, error: "Invalid form responses submitted" });
    }

    const formQuery = formId ? { _id: formId } : { slug: formSlug };
    const form = await Form.findOne(formQuery);

    if (!form) {
      return res.status(404).json({ success: false, error: "Registration form not found" });
    }

    if (form.status !== "published") {
      return res.status(403).json({
        success: false,
        error: "This registration form is currently not accepting responses",
      });
    }

    // Validate only active, non-layout fields
    for (const field of form.fields) {
      if (["section_heading", "description"].includes(field.type)) continue;

      if (field.required) {
        const val = responses[field.id];
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          return res.status(422).json({
            success: false,
            error: field.validation?.customErrorMessage || `Question "${field.label}" is required.`,
            fieldId: field.id,
          });
        }
      }
    }

    // Clean & sanitize responses: store only non-empty, user-provided values matching form inputs
    const sanitizedResponses: Record<string, any> = {};
    for (const [key, value] of Object.entries(responses)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          sanitizedResponses[key] = value.trim();
        } else {
          sanitizedResponses[key] = value;
        }
      }
    }

    // Extract core identity fields flexibly
    const candidateName =
      sanitizedResponses["full_name"] ||
      sanitizedResponses["name"] ||
      sanitizedResponses["candidate_name"] ||
      sanitizedResponses["student_name"] ||
      Object.values(sanitizedResponses)[0] ||
      "Candidate";

    const candidateEmail =
      sanitizedResponses["email"] ||
      sanitizedResponses["institutional_email"] ||
      sanitizedResponses["email_address"] ||
      sanitizedResponses["personal_email"] ||
      "";

    const candidatePhone =
      sanitizedResponses["phone"] ||
      sanitizedResponses["whatsapp"] ||
      sanitizedResponses["contact"] ||
      sanitizedResponses["mobile"] ||
      "";

    const department =
      sanitizedResponses["department"] ||
      sanitizedResponses["program"] ||
      sanitizedResponses["branch"] ||
      sanitizedResponses["course"] ||
      "";

    const category =
      sanitizedResponses["category"] ||
      sanitizedResponses["role"] ||
      sanitizedResponses["applicant_category"] ||
      "Applicant";

    // Duplicate check if configured
    if (!form.settings?.allowMultipleSubmissions && candidateEmail) {
      const existing = await Registration.findOne({
        formId: form._id,
        candidateEmail: candidateEmail.toLowerCase().trim(),
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: `A registration with the email "${candidateEmail}" has already been recorded for this form (Registration ID: ${existing.registrationId}).`,
          registrationId: existing.registrationId,
        });
      }
    }

    const shortName = (institutionShortName || form.institutionShortName || "NGI").toUpperCase() as "NCET" | "NCMS";
    const registrationId = generateRegistrationId(shortName);

    // Save EXACT candidate responses into MongoDB
    const registration = await Registration.create({
      registrationId,
      formId: form._id,
      formVersionNumber: form.currentPublishedVersion || 1,
      institutionShortName: shortName,
      candidateName,
      candidateEmail: candidateEmail.toLowerCase().trim(),
      candidatePhone,
      department,
      category,
      responses: sanitizedResponses,
      status: "Pending", // Real candidate submission starts as Pending for review
      submittedAt: new Date(),
      ipAddress: req.ip,
    });

    // Dispatch Thank You & Confirmation Email asynchronously (does not block HTTP response)
    if (candidateEmail) {
      sendRegistrationThankYouEmail({
        toEmail: candidateEmail,
        candidateName,
        registrationId: registration.registrationId,
        institutionShortName: shortName,
        formTitle: form.title,
      }).catch((err) => {
        console.error("[Mailer] Background email error:", err);
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully!",
      registrationId: registration.registrationId,
      institution: shortName,
      submittedAt: registration.submittedAt,
      candidateName,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRegistrations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { search, institution, status, formId, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};

    if (institution && institution !== "ALL") {
      query.institutionShortName = String(institution).toUpperCase();
    }

    if (status && status !== "ALL") {
      const statusStr = String(status);
      if (statusStr.includes(",")) {
        const statuses = statusStr.split(",").map((s) => s.trim()).filter(Boolean);
        query.status = { $in: statuses };
      } else {
        query.status = statusStr;
      }
    }

    if (formId && formId !== "ALL") {
      query.formId = formId;
    }

    if (search && String(search).trim()) {
      const sanitized = escapeRegex(String(search).trim());
      const regExp = new RegExp(sanitized, "i");
      query.$or = [
        { registrationId: regExp },
        { candidateName: regExp },
        { candidateEmail: regExp },
        { candidatePhone: regExp },
        { department: regExp },
      ];
    }

    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRegistrationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const query = id.startsWith("NGI-") ? { registrationId: id } : { _id: id };

    const registration = await Registration.findOne(query);
    if (!registration) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    const form = await Form.findById(registration.formId);
    return res.json({ success: true, data: registration, form });
  } catch (error) {
    next(error);
  }
}

export async function updateRegistrationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, candidateName, candidateEmail, candidatePhone, department, category, responses } = req.body;

    const query = id.startsWith("NGI-") ? { registrationId: id } : { _id: id };
    const registration = await Registration.findOne(query);

    if (!registration) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    if (status !== undefined) {
      registration.status = status;
    }
    if (candidateName !== undefined) {
      registration.candidateName = String(candidateName).trim();
    }
    if (candidateEmail !== undefined) {
      registration.candidateEmail = String(candidateEmail).trim().toLowerCase();
    }
    if (candidatePhone !== undefined) {
      registration.candidatePhone = String(candidatePhone).trim();
    }
    if (department !== undefined) {
      registration.department = String(department).trim();
    }
    if (category !== undefined) {
      registration.category = String(category).trim();
    }
    if (responses !== undefined && typeof responses === "object") {
      registration.responses = { ...registration.responses, ...responses };
    }

    await registration.save();

    return res.json({ success: true, data: registration, message: "Registration updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function deleteRegistration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const query = id.startsWith("NGI-") ? { registrationId: id } : { _id: id };

    const deleted = await Registration.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    return res.json({ success: true, message: "Registration deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function exportRegistrations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { institution, status, formId, search } = req.query;

    const query: any = {};
    if (institution && institution !== "ALL") {
      query.institutionShortName = String(institution).toUpperCase();
    }
    if (status && status !== "ALL") {
      const statusStr = String(status);
      if (statusStr.includes(",")) {
        const statuses = statusStr.split(",").map((s) => s.trim()).filter(Boolean);
        query.status = { $in: statuses };
      } else {
        query.status = statusStr;
      }
    }
    if (formId && formId !== "ALL") {
      query.formId = formId;
    }
    if (search && String(search).trim()) {
      const sanitized = escapeRegex(String(search).trim());
      const regExp = new RegExp(sanitized, "i");
      query.$or = [
        { registrationId: regExp },
        { candidateName: regExp },
        { candidateEmail: regExp },
        { candidatePhone: regExp },
      ];
    }

    const registrations = await Registration.find(query)
      .sort({ submittedAt: -1 })
      .limit(10000);

    const buffer = await generateRegistrationsExcelBuffer(
      registrations,
      institution ? String(institution) : undefined,
      req.admin?.name || "Administrator"
    );

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `NGI_Connect_Registrations_${institution || "All"}_${dateStr}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
}
