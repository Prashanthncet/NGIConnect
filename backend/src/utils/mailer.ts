import nodemailer, { Transporter } from "nodemailer";
import {
  buildRegistrationEmailTemplate,
  RegistrationEmailTemplateOptions,
  getLogoFilePath,
} from "./emailTemplates";
import { getActiveEmailTemplate } from "./templateStore";

export interface SendConfirmationEmailParams extends Partial<RegistrationEmailTemplateOptions> {
  toEmail: string;
  candidateName: string;
  registrationId: string;
  institutionShortName?: "NCET" | "NCMS" | "NGI" | string;
  formTitle?: string;
}

/**
 * Sends an email using the Resend REST API (HTTPS port 443).
 * Fully functional on Render Free tier where outbound SMTP ports 25, 465, and 587 are blocked.
 */
async function sendViaResend(payload: {
  to: string;
  fromName?: string;
  fromEmail?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const apiKey = (process.env.RESEND_API_KEY || "").trim();
    if (!apiKey) return { success: false, error: "No RESEND_API_KEY" };

    const fromAddress =
      process.env.RESEND_FROM?.trim() ||
      (payload.fromName
        ? `"${payload.fromName.replace(/"/g, "")}" <onboarding@resend.dev>`
        : "Nagarjuna Connect <onboarding@resend.dev>");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    const data: any = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.message || JSON.stringify(data) };
    }
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Sends an email using Brevo REST API (HTTPS port 443).
 */
async function sendViaBrevo(payload: {
  to: string;
  toName?: string;
  fromName?: string;
  fromEmail?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const apiKey = (process.env.BREVO_API_KEY || "").trim();
    if (!apiKey) return { success: false, error: "No BREVO_API_KEY" };

    const senderEmail = process.env.BREVO_FROM_EMAIL?.trim() || payload.fromEmail || "admissions@ngi.org.in";
    const senderName = payload.fromName || "Nagarjuna Connect Admissions";

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: payload.to, name: payload.toName || "Candidate" }],
        subject: payload.subject,
        htmlContent: payload.html,
        textContent: payload.text,
        replyTo: payload.replyTo ? { email: payload.replyTo } : undefined,
      }),
    });

    const data: any = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.message || JSON.stringify(data) };
    }
    return { success: true, id: data?.messageId };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Creates an SMTP transporter from environment variables.
 * Compatible with Gmail App Passwords, Google Workspace, Outlook, Resend, SendGrid, Amazon SES, or custom SMTP.
 */
export function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  const cleanUser = user.trim();
  // Strip all internal whitespace in case user copied the Google App Password with spaces (e.g. 'abcd efgh ijkl mnop')
  const cleanPass = pass.replace(/\s+/g, "").trim();

  // If host is Gmail / Google Workspace, use dedicated Gmail transport
  if (host.includes("gmail") || cleanUser.includes("@gmail.com") || cleanUser.includes("ncetmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: cleanUser,
        pass: cleanPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: cleanUser,
      pass: cleanPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface SendEmailResult {
  success: boolean;
  provider?: "Resend" | "Brevo" | "SMTP" | "None";
  messageId?: string;
  error?: string;
}

/**
 * Asynchronously dispatches an official Thank You & Confirmation email to the registered candidate.
 * Supports HTTP REST API (Resend / Brevo over port 443) and SMTP (ports 465/587).
 */
export async function sendRegistrationThankYouEmail(
  params: SendConfirmationEmailParams
): Promise<SendEmailResult> {
  try {
    const { toEmail, registrationId } = params;

    if (!toEmail || !toEmail.includes("@")) {
      console.log(`[Mailer] No valid email provided for registration ${registrationId}. Skipped email.`);
      return { success: false, error: "Candidate has no valid email address." };
    }

    // Fetch cached dynamic template from Admin settings
    let activeTemplate: any = null;
    try {
      activeTemplate = await getActiveEmailTemplate();
    } catch (e) {
      console.warn("[Mailer] Could not load active template, using default template:", e);
    }

    const mergedOptions: RegistrationEmailTemplateOptions = {
      toEmail,
      candidateName: params.candidateName,
      registrationId: params.registrationId,
      institutionShortName:
        params.institutionShortName ||
        (activeTemplate?.institutionShortName === "ALL" ? undefined : activeTemplate?.institutionShortName),
      formTitle: params.formTitle,
      subject: params.subject || activeTemplate?.subject,
      fromName: params.fromName || activeTemplate?.fromName,
      fromEmail: params.fromEmail || activeTemplate?.fromEmail,
      replyTo: params.replyTo || activeTemplate?.replyTo,
      institutionHeader: params.institutionHeader || activeTemplate?.institutionHeader,
      headerTitle: params.headerTitle || activeTemplate?.headerTitle,
      academicYear: params.academicYear || activeTemplate?.academicYear,
      welcomeMessage: params.welcomeMessage || activeTemplate?.welcomeMessage,
      highlightLabel: params.highlightLabel || activeTemplate?.highlightLabel,
      campusBadge: params.campusBadge || activeTemplate?.campusBadge,
      stepsHeading: params.stepsHeading || activeTemplate?.stepsHeading,
      steps: params.steps || activeTemplate?.steps,
      supportEmail: params.supportEmail || activeTemplate?.supportEmail,
      supportPhone: params.supportPhone || activeTemplate?.supportPhone,
      footerAffiliation: params.footerAffiliation || activeTemplate?.footerAffiliation,
      footerCopyright: params.footerCopyright || activeTemplate?.footerCopyright,
      useCidLogo: params.useCidLogo !== undefined ? params.useCidLogo : (activeTemplate?.useCidLogo ?? true),
      logoUrl: params.logoUrl || activeTemplate?.logoUrl,
    };

    // Build the email payload with all customized or default values
    const emailPayload = buildRegistrationEmailTemplate(mergedOptions);

    // 1. Try Resend HTTP API (HTTPS port 443 - works everywhere including Render Free Tier)
    if (process.env.RESEND_API_KEY) {
      console.log(`[Mailer] Dispatching confirmation email via Resend API to ${toEmail}...`);
      const resendResult = await sendViaResend({
        to: emailPayload.to,
        fromName: emailPayload.fromName,
        fromEmail: emailPayload.fromEmail,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
        replyTo: emailPayload.replyTo,
      });

      if (resendResult.success) {
        console.log(`[Mailer] Confirmation email sent successfully via Resend to ${toEmail} (Id: ${resendResult.id})`);
        return { success: true, provider: "Resend", messageId: resendResult.id };
      }
      console.warn(`[Mailer] Resend API failed: ${resendResult.error}. Falling back to other providers...`);
    }

    // 2. Try Brevo HTTP API (HTTPS port 443)
    if (process.env.BREVO_API_KEY) {
      console.log(`[Mailer] Dispatching confirmation email via Brevo API to ${toEmail}...`);
      const brevoResult = await sendViaBrevo({
        to: emailPayload.to,
        toName: params.candidateName,
        fromName: emailPayload.fromName,
        fromEmail: emailPayload.fromEmail,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
        replyTo: emailPayload.replyTo,
      });

      if (brevoResult.success) {
        console.log(`[Mailer] Confirmation email sent successfully via Brevo to ${toEmail} (Id: ${brevoResult.id})`);
        return { success: true, provider: "Brevo", messageId: brevoResult.id };
      }
      console.warn(`[Mailer] Brevo API failed: ${brevoResult.error}. Falling back to other providers...`);
    }

    // 3. Fallback to standard SMTP (Nodemailer)
    const transporter = getTransporter();

    if (!transporter) {
      const msg = "No mail provider configured. Please set RESEND_API_KEY (port 443) or SMTP_USER/SMTP_PASS in environment variables.";
      console.log(`[Mailer] ${msg} Target: ${toEmail} | RegID: ${registrationId}`);
      return { success: false, provider: "None", error: msg };
    }

    console.log(`[Mailer] Dispatching confirmation email via SMTP to ${toEmail}...`);
    const info: any = await transporter.sendMail({
      from: emailPayload.from,
      to: emailPayload.to,
      replyTo: emailPayload.replyTo,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
      attachments: emailPayload.attachments,
    });

    console.log(
      `[Mailer] Confirmation email sent successfully to ${toEmail} from ${emailPayload.from} (MessageId: ${info?.messageId || "sent"})`
    );
    return { success: true, provider: "SMTP", messageId: info?.messageId || "sent" };
  } catch (error: any) {
    const isConnectionTimeout =
      error?.code === "ETIMEDOUT" ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ESOCKETTIMEDOUT" ||
      error?.message?.includes("timeout");

    let friendlyError = error?.message || String(error);
    if (isConnectionTimeout) {
      friendlyError =
        "Outbound SMTP port blocked or timed out. On Render Free tier, add RESEND_API_KEY to send via HTTPS (port 443).";
      console.warn(
        `[Mailer] ⚠️ Cloud Network Notice: Outbound SMTP connection timed out (${error.code || "TIMEOUT"}). ` +
        `Render Free Tier blocks outbound ports 25, 465, and 587. ` +
        `To send emails on Render Free Tier, provide RESEND_API_KEY (over HTTPS port 443) or upgrade to a Render paid plan.`
      );
    } else {
      console.error(`[Mailer] Error dispatching confirmation email to ${params.toEmail}:`, error);
    }
    return { success: false, error: friendlyError };
  }
}

/**
 * Dispatches a 6-digit OTP to the administrator for passwordless / OTP authentication.
 */
export async function sendAdminLoginOtpEmail({
  toEmail,
  otpCode,
  adminName,
}: {
  toEmail: string;
  otpCode: string;
  adminName: string;
}): Promise<boolean> {
  try {
    const logoPath = getLogoFilePath();
    const attachments = logoPath
      ? [{ filename: "ngi-logo.png", path: logoPath, cid: "ngiotplogo@ngi.edu" }]
      : [];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nagarjuna Connect OTP Verification</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 28px 12px; color: #102B46; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(16,43,70,0.06); }
          .header { background: #102B46; padding: 28px 24px; text-align: center; color: #ffffff; }
          .logo-badge { display: inline-block; background: #ffffff; padding: 8px; border-radius: 12px; margin-bottom: 12px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
          .header p { margin: 6px 0 0; font-size: 12px; color: #F28C28; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
          .body { padding: 32px 28px; }
          .otp-card { background: #f8fafc; border: 2px dashed #F28C28; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: monospace; font-size: 36px; font-weight: 800; color: #F28C28; letter-spacing: 10px; margin: 0; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${
              logoPath
                ? `<div class="logo-badge"><img src="cid:ngiotplogo@ngi.edu" alt="NGI Logo" width="56" height="56" style="display:block;" /></div>`
                : ""
            }
            <p>Nagarjuna Group of Institutions</p>
            <h1>Nagarjuna Connect Admin Studio</h1>
          </div>
          <div class="body">
            <p style="font-size: 15px; margin: 0 0 12px;">Hello <strong>${adminName}</strong>,</p>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.5; margin: 0 0 16px;">
              A request was made to sign in to the Nagarjuna Connect Administration Console. Use the one-time verification code below to authenticate:
            </p>
            <div class="otp-card">
              <p class="otp-code">${otpCode}</p>
              <p style="font-size: 11px; color: #64748b; margin: 8px 0 0;">Valid for 10 minutes. Do not share this code.</p>
            </div>
            <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;">
              If you did not request this login attempt, please notify the technical coordinator immediately.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} Nagarjuna Group of Institutions • Central Administration</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const subject = `Your Nagarjuna Connect Verification Code: ${otpCode}`;
    const text = `Hello ${adminName},\n\nYour Nagarjuna Connect verification code is: ${otpCode}\nValid for 10 minutes.`;

    // 1. Try Resend HTTP API
    if (process.env.RESEND_API_KEY) {
      const resendResult = await sendViaResend({
        to: toEmail,
        fromName: "Nagarjuna Connect Security",
        subject,
        html: htmlContent,
        text,
      });
      if (resendResult.success) {
        console.log(`[Mailer] OTP sent successfully via Resend to ${toEmail} (Id: ${resendResult.id})`);
        return true;
      }
    }

    // 2. Try Brevo HTTP API
    if (process.env.BREVO_API_KEY) {
      const brevoResult = await sendViaBrevo({
        to: toEmail,
        toName: adminName,
        fromName: "Nagarjuna Connect Security",
        subject,
        html: htmlContent,
        text,
      });
      if (brevoResult.success) {
        console.log(`[Mailer] OTP sent successfully via Brevo to ${toEmail} (Id: ${brevoResult.id})`);
        return true;
      }
    }

    // 3. Fallback to SMTP
    const transporter = getTransporter();
    if (!transporter) {
      console.log(`[Mailer] No mail service configured. Generated OTP for ${toEmail}: ${otpCode}`);
      return false;
    }

    const fromAddress =
      process.env.SMTP_FROM || `"Nagarjuna Connect Security" <${process.env.SMTP_USER || "security@ngi.org.in"}>`;

    const info: any = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject,
      html: htmlContent,
      attachments,
    });

    console.log(`[Mailer] OTP sent successfully via SMTP to ${toEmail} (MessageId: ${info?.messageId || "sent"})`);
    return true;
  } catch (err) {
    console.error(`[Mailer] Error dispatching OTP email to ${toEmail}:`, err);
    return false;
  }
}
