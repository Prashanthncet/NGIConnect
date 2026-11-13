import { Request, Response, NextFunction } from "express";
import { EmailTemplate, IEmailTemplate } from "../models/EmailTemplate";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  buildRegistrationEmailTemplate,
  RegistrationEmailTemplateOptions,
} from "../utils/emailTemplates";
import { sendRegistrationThankYouEmail } from "../utils/mailer";
import {
  getActiveEmailTemplate,
  invalidateEmailTemplateCache,
} from "../utils/templateStore";

export { getActiveEmailTemplate, invalidateEmailTemplateCache };

/**
 * GET /api/email-template
 * Returns the currently active email template settings.
 */
export async function getTemplate(req: Request, res: Response, next: NextFunction) {
  try {
    let template = await EmailTemplate.findOne({ identifier: "default" });
    if (!template) {
      template = await EmailTemplate.create({ identifier: "default" });
    }
    return res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/email-template
 * Updates the template configuration and invalidates the in-memory cache.
 */
export async function updateTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const updateData = req.body;
    const adminUser = req.admin?.email || req.admin?.name || "Administrator";

    let template = await EmailTemplate.findOne({ identifier: "default" });
    if (!template) {
      template = new EmailTemplate({ identifier: "default" });
    }

    const editableFields = [
      "subject",
      "fromName",
      "fromEmail",
      "replyTo",
      "institutionHeader",
      "headerTitle",
      "academicYear",
      "welcomeMessage",
      "highlightLabel",
      "campusBadge",
      "stepsHeading",
      "steps",
      "supportEmail",
      "supportPhone",
      "footerAffiliation",
      "footerCopyright",
      "useCidLogo",
      "logoUrl",
    ];

    editableFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        (template as any)[field] = updateData[field];
      }
    });

    template.updatedBy = adminUser;
    await template.save();

    // Invalidate high-concurrency cache so all future registration emails use the latest template
    invalidateEmailTemplateCache();

    return res.json({
      success: true,
      message: "Email template updated successfully",
      data: template,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/email-template/render-preview
 * Renders sample HTML on demand from provided or saved draft data for instant split-screen preview.
 */
export async function renderPreview(req: Request, res: Response, next: NextFunction) {
  try {
    const draft = req.body || {};

    const sampleOptions: RegistrationEmailTemplateOptions = {
      toEmail: draft.toEmail || "sample.applicant@example.com",
      candidateName: draft.candidateName || "Prashanth B",
      registrationId: draft.registrationId || "NGI-NCMS-2026-82057",
      institutionShortName: draft.institutionShortName || "NCMS",
      subject: draft.subject,
      fromName: draft.fromName,
      fromEmail: draft.fromEmail,
      replyTo: draft.replyTo,
      institutionHeader: draft.institutionHeader,
      headerTitle: draft.headerTitle,
      academicYear: draft.academicYear,
      welcomeMessage: draft.welcomeMessage,
      highlightLabel: draft.highlightLabel,
      campusBadge: draft.campusBadge,
      stepsHeading: draft.stepsHeading,
      steps: draft.steps,
      supportEmail: draft.supportEmail,
      supportPhone: draft.supportPhone,
      footerAffiliation: draft.footerAffiliation,
      footerCopyright: draft.footerCopyright,
      logoUrl: draft.logoUrl || "/images/ngi-logo.png",
      useCidLogo: draft.useCidLogo !== undefined ? draft.useCidLogo : true,
    };

    const rendered = buildRegistrationEmailTemplate(sampleOptions);

    return res.json({
      success: true,
      data: {
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        from: rendered.from,
        replyTo: rendered.replyTo,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/email-template/test
 * Dispatches a real test email to verify credentials and template aesthetics.
 */
export async function sendTestEmail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { targetEmail, templateOverrides } = req.body;

    const recipient = targetEmail || req.admin?.email || process.env.SMTP_USER;
    if (!recipient || !recipient.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "A valid target recipient email is required to send a test email.",
      });
    }

    const overrides = templateOverrides || {};

    const success = await sendRegistrationThankYouEmail({
      toEmail: recipient,
      candidateName: overrides.candidateName || req.admin?.name || "Dr. Rajesh Sharma",
      registrationId: overrides.registrationId || "NGI-TEST-2026-00001",
      institutionShortName: overrides.institutionShortName || "NCET",
      formTitle: "Test Verification Form 2026",
      ...overrides,
    });

    if (success) {
      return res.json({
        success: true,
        message: `Test email successfully dispatched to ${recipient}`,
      });
    } else {
      return res.status(500).json({
        success: false,
        error:
          "Could not send email. Please ensure SMTP_USER and SMTP_PASS are correctly configured in backend/.env.",
      });
    }
  } catch (error) {
    next(error);
  }
}
