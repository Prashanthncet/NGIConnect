import nodemailer from "nodemailer";
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
 * Creates an SMTP transporter from environment variables.
 * Compatible with Gmail App Passwords, Outlook, Resend, SendGrid, Amazon SES, or custom SMTP.
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Asynchronously dispatches an official Thank You & Confirmation email to the registered candidate.
 * Fully customizable: sender ("from"), recipient ("to"), reply-to, subject, steps, branding, and NGI logo.
 */
export async function sendRegistrationThankYouEmail(
  params: SendConfirmationEmailParams
): Promise<boolean> {
  try {
    const { toEmail, registrationId } = params;

    if (!toEmail || !toEmail.includes("@")) {
      console.log(`[Mailer] No valid email provided for registration ${registrationId}. Skipped email.`);
      return false;
    }

    const transporter = getTransporter();

    if (!transporter) {
      console.log(
        `[Mailer] SMTP credentials not set in .env (SMTP_USER / SMTP_PASS). Ready to send once configured. Target: ${toEmail} | RegID: ${registrationId}`
      );
      return false;
    }

    // Fetch cached dynamic template from Admin settings (in-memory cached, ultra-fast)
    const activeTemplate = await getActiveEmailTemplate();

    const mergedOptions: RegistrationEmailTemplateOptions = {
      toEmail,
      candidateName: params.candidateName,
      registrationId: params.registrationId,
      institutionShortName: params.institutionShortName || activeTemplate?.institutionShortName,
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

    const info = await transporter.sendMail({
      from: emailPayload.from,
      to: emailPayload.to,
      replyTo: emailPayload.replyTo,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
      attachments: emailPayload.attachments,
    });

    console.log(
      `[Mailer] Confirmation email sent successfully to ${toEmail} from ${emailPayload.from} (MessageId: ${info.messageId})`
    );
    return true;
  } catch (error) {
    console.error(`[Mailer] Error dispatching confirmation email to ${params.toEmail}:`, error);
    return false;
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
    const transporter = getTransporter();
    if (!transporter) {
      console.log(`[Mailer] No SMTP credentials configured. Generated OTP for ${toEmail}: ${otpCode}`);
      return false;
    }

    const fromAddress =
      process.env.SMTP_FROM || `"NGi Connect Security" <${process.env.SMTP_USER || "security@ngi.org.in"}>`;

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
        <title>NGi Connect OTP Verification</title>
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
            <h1>NGi Connect Admin Studio</h1>
          </div>
          <div class="body">
            <p style="font-size: 15px; margin: 0 0 12px;">Hello <strong>${adminName}</strong>,</p>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.5; margin: 0 0 16px;">
              A request was made to sign in to the NGi Connect Administration Console. Use the one-time verification code below to authenticate:
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

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Your NGi Connect Verification Code: ${otpCode}`,
      html: htmlContent,
      attachments,
    });

    console.log(`[Mailer] OTP sent successfully to ${toEmail} (MessageId: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`[Mailer] Error dispatching OTP email to ${toEmail}:`, err);
    return false;
  }
}
