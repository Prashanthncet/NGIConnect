import nodemailer from "nodemailer";

interface SendConfirmationEmailParams {
  toEmail: string;
  candidateName: string;
  registrationId: string;
  institutionShortName: "NCET" | "NCMS" | string;
  formTitle: string;
}

/**
 * Creates an SMTP transporter from environment variables.
 * Compatible with Gmail App Passwords, Outlook, Resend, SendGrid, Amazon SES, or custom SMTP.
 */
function getTransporter() {
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
 */
export async function sendRegistrationThankYouEmail({
  toEmail,
  candidateName,
  registrationId,
  institutionShortName,
  formTitle,
}: SendConfirmationEmailParams): Promise<boolean> {
  try {
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

    const isNCET = institutionShortName.toUpperCase() === "NCET";
    const campusName = isNCET
      ? "Nagarjuna College of Engineering and Technology (NCET)"
      : "Nagarjuna College of Management Studies (NCMS)";
    const campusDetails = isNCET
      ? "Autonomous Institution • Affiliated to VTU • NAAC 'A' Grade • Devanahalli, Bengaluru"
      : "Affiliated to Bengaluru North University (BNU) • Chikkaballapur Campus";

    const fromAddress = process.env.SMTP_FROM || `"NGi Connect Admissions" <${process.env.SMTP_USER}>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9ff; margin: 0; padding: 24px 0; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(16,43,70,0.06); }
          .header { background: #102B46; padding: 28px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
          .header p { margin: 6px 0 0 0; font-size: 12px; color: #F28C28; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
          .body { padding: 32px 28px; }
          .greeting { font-size: 18px; font-weight: 700; color: #102b46; margin-bottom: 12px; }
          .highlight-card { background: #102B46; border-radius: 14px; padding: 20px; color: #ffffff; text-align: center; margin: 24px 0; }
          .reg-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700; }
          .reg-id { font-size: 26px; font-family: monospace; font-weight: 800; color: #F28C28; margin: 8px 0; letter-spacing: 1px; }
          .campus-badge { display: inline-block; background: rgba(242,140,40,0.2); color: #F28C28; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
          .steps { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .steps h3 { margin: 0 0 10px 0; font-size: 13px; color: #102b46; text-transform: uppercase; font-weight: 700; }
          .steps li { font-size: 12px; color: #475569; margin-bottom: 6px; line-height: 1.5; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
          .footer a { color: #174a70; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p>Nagarjuna Group of Institutions (NGi)</p>
            <h1>Registration Confirmation & Thank You</h1>
          </div>
          <div class="body">
            <div class="greeting">Dear ${candidateName},</div>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Thank you for registering with <strong>NGi Connect</strong> for <strong>${campusName}</strong>. Your application has been successfully logged into our central academic admissions registry.
            </p>

            <div class="highlight-card">
              <div class="reg-label">Your Official Registration ID</div>
              <div class="reg-id">${registrationId}</div>
              <div class="campus-badge">${institutionShortName.toUpperCase()} Campus • Academic Session 2026</div>
            </div>

            <div class="steps">
              <h3>What Happens Next:</h3>
              <ol style="padding-left: 20px; margin: 0;">
                <li><strong>Document Review:</strong> Our admissions team is reviewing your details against program prerequisites.</li>
                <li><strong>Print Acknowledgement Slip:</strong> Keep a copy of your Registration ID for campus visits and counseling.</li>
                <li><strong>Official Communications:</strong> You will receive notifications regarding orientation schedules and fee challan procedures.</li>
              </ol>
            </div>

            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
              For immediate questions regarding your application status, reply directly to this email or contact the admissions office at <a href="mailto:academic.connect@ncet.co.in" style="color: #F28C28; font-weight: 700;">academic.connect@ncet.co.in</a> or <strong>+91 80 6746 2700</strong>.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px 0;"><strong>${campusName}</strong></p>
            <p style="margin: 0 0 6px 0;">${campusDetails}</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} Nagarjuna Education Society. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Registration Confirmed: ${registrationId} - ${campusName}`,
      html: htmlContent,
    });

    console.log(`[Mailer] Confirmation email sent successfully to ${toEmail} (MessageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[Mailer] Error dispatching confirmation email to ${toEmail}:`, error);
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

    const fromAddress = process.env.SMTP_FROM || `"NGi Connect Security" <${process.env.SMTP_USER}>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9ff; margin: 0; padding: 24px; color: #102B46; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(16,43,70,0.06); }
          .header { background: #102B46; padding: 28px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
          .header p { margin: 6px 0 0; font-size: 12px; color: #94a3b8; }
          .body { padding: 32px 28px; }
          .otp-card { background: #f8fafc; border: 2px dashed #F28C28; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: monospace; font-size: 36px; font-weight: 800; color: #F28C28; letter-spacing: 10px; margin: 0; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NGi Connect Admin Studio</h1>
            <p>One-Time Verification Code</p>
          </div>
          <div class="body">
            <p style="font-size: 15px; margin: 0 0 12px;">Hello <strong>${adminName}</strong>,</p>
            <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0 0 16px;">
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
    });

    console.log(`[Mailer] OTP sent successfully to ${toEmail} (MessageId: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`[Mailer] Error dispatching OTP email to ${toEmail}:`, err);
    return false;
  }
}

