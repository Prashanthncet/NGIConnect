import path from "path";
import fs from "fs";

export interface EmailStep {
  title: string;
  description: string;
}

export interface RegistrationEmailTemplateOptions {
  // Destination and Routing (Fully Editable)
  toEmail: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;

  // Candidate and Application Details
  candidateName: string;
  registrationId: string;
  institutionShortName?: "NCET" | "NCMS" | "NGI" | string;
  formTitle?: string;

  // Content Customization (Fully Editable with defaults)
  subject?: string;
  institutionHeader?: string;
  headerTitle?: string;
  academicYear?: string;
  welcomeMessage?: string;
  highlightLabel?: string;
  campusBadge?: string;
  stepsHeading?: string;
  steps?: EmailStep[];
  supportEmail?: string;
  supportPhone?: string;
  supportNote?: string;
  footerAffiliation?: string;
  footerCopyright?: string;

  // Logo Customization
  logoUrl?: string; // Optional external hosted image URL (e.g. https://yourdomain.com/images/ngi-logo.png)
  useCidLogo?: boolean; // Set to true to embed the local logo as an inline attachment
}

/**
 * Robustly resolves the absolute file path of the NGI logo on disk.
 */
export function getLogoFilePath(): string | null {
  const possiblePaths = [
    path.join(__dirname, "../../assets/ngi-logo.png"),
    path.join(__dirname, "../assets/ngi-logo.png"),
    path.resolve(process.cwd(), "assets", "ngi-logo.png"),
    path.resolve(process.cwd(), "backend", "assets", "ngi-logo.png"),
    path.resolve(process.cwd(), "frontend", "public", "images", "ngi-logo.png"),
    path.resolve(process.cwd(), "..", "frontend", "public", "images", "ngi-logo.png"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

/**
 * Builds the complete email payload (subject, html, text, attachments)
 * with full customization options and professional NGI branding.
 */
export function buildRegistrationEmailTemplate(options: RegistrationEmailTemplateOptions) {
  const shortName = (options.institutionShortName || "NGI").toUpperCase();
  const isNCET = shortName === "NCET";
  const isNCMS = shortName === "NCMS";

  const defaultCampusName = isNCET
    ? "Nagarjuna College of Engineering and Technology (NCET)"
    : isNCMS
    ? "Nagarjuna College of Management Studies (NCMS)"
    : "Nagarjuna Group of Institutions (NGI)";

  const defaultCampusDetails = isNCET
    ? "Autonomous Institution • Affiliated to VTU • NAAC 'A' Grade • Devanahalli, Bengaluru"
    : isNCMS
    ? "Affiliated to Bengaluru North University (BNU) • Chikkaballapur Campus"
    : "Pioneering Excellence in Education • Bengaluru, Karnataka";

  const defaultSupportEmail = isNCET
    ? "academic.connect@ncet.co.in"
    : isNCMS
    ? "admissions@ncms.ac.in"
    : (process.env.SUPPORT_EMAIL || "admissions@ngi.org.in");

  const defaultSupportPhone = process.env.SUPPORT_PHONE || "+91 80 6746 2700";
  const defaultAcademicYear = options.academicYear || "2026-2027";

  const replaceTokens = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/\{\{candidateName\}\}/gi, options.candidateName || "Candidate")
      .replace(/\{\{registrationId\}\}/gi, options.registrationId || "")
      .replace(/\{\{campusName\}\}/gi, defaultCampusName)
      .replace(/\{\{institution\}\}/gi, shortName)
      .replace(/\{\{academicYear\}\}/gi, defaultAcademicYear);
  };

  // Editable fields with smart defaults
  const subject = replaceTokens(
    options.subject ||
    `Registration Confirmed: ${options.registrationId} - ${defaultCampusName}`
  );

  const institutionHeader = replaceTokens(
    options.institutionHeader || "NAGARJUNA GROUP OF INSTITUTIONS (NGI)"
  );

  const headerTitle = replaceTokens(
    options.headerTitle || "Registration Confirmation & Thank You"
  );

  const welcomeMessage = replaceTokens(
    options.welcomeMessage ||
    `Thank you for registering with <strong>NGI Connect</strong> for <strong>${defaultCampusName}</strong>. Your application has been successfully logged into our central academic admissions registry.`
  );

  const highlightLabel = replaceTokens(
    options.highlightLabel || "YOUR OFFICIAL REGISTRATION ID"
  );

  const campusBadge = replaceTokens(
    options.campusBadge ||
    `${shortName} Campus • Academic Session ${defaultAcademicYear}`
  );

  const stepsHeading = replaceTokens(options.stepsHeading || "WHAT HAPPENS NEXT:");

  const steps = options.steps || [
    {
      title: "Document Review",
      description:
        "Our admissions team is reviewing your details and uploaded documents against program prerequisites.",
    },
    {
      title: "Print Acknowledgement Slip",
      description:
        "Keep a digital or printed copy of your Registration ID for campus visits, counseling, and document verification.",
    },
    {
      title: "Official Communications",
      description:
        "You will receive notifications via email and SMS regarding interview schedules, orientation dates, and fee challan procedures.",
    },
  ];

  const supportEmail = options.supportEmail || defaultSupportEmail;
  const supportPhone = options.supportPhone || defaultSupportPhone;

  const footerAffiliation =
    options.footerAffiliation || defaultCampusDetails;

  const footerCopyright =
    options.footerCopyright ||
    `© ${new Date().getFullYear()} Nagarjuna Education Society. All Rights Reserved.`;

  // Attachments setup for inline logo
  const attachments: Array<{ filename: string; path: string; cid: string }> = [];
  const logoPath = getLogoFilePath();

  let logoSrc = "";
  if (options.logoUrl) {
    logoSrc = options.logoUrl;
  } else if (logoPath && options.useCidLogo !== false) {
    attachments.push({
      filename: "ngi-logo.png",
      path: logoPath,
      cid: "ngilogo@ngi.edu",
    });
    logoSrc = "cid:ngilogo@ngi.edu";
  }

  // HTML Steps Rendering
  const stepsHtml = steps
    .map(
      (step, idx) => `
      <li style="margin-bottom: 12px; line-height: 1.5; color: #334155;">
        <strong style="color: #0f172a;">${idx + 1}. ${step.title}:</strong> ${step.description}
      </li>
    `
    )
    .join("");

  // Plain Text Steps Rendering (for email spam filters & accessibility)
  const stepsText = steps
    .map((step, idx) => `${idx + 1}. ${step.title}: ${step.description}`)
    .join("\n");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      margin: 0;
      padding: 32px 12px;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(16, 43, 70, 0.08), 0 8px 10px -6px rgba(16, 43, 70, 0.04);
    }
    .header {
      background: linear-gradient(135deg, #0b1f33 0%, #102B46 100%);
      padding: 36px 28px 30px;
      text-align: center;
      color: #ffffff;
      position: relative;
    }
    .logo-container {
      margin-bottom: 14px;
      text-align: center;
    }
    .logo-img {
      display: inline-block;
      width: 68px;
      height: 68px;
      object-fit: contain;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.14);
      padding: 4px;
      margin: 0 auto;
    }
    .header-institution {
      margin: 0;
      font-size: 13px;
      color: #F28C28;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .header-title {
      margin: 8px 0 0 0;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1.3;
    }
    .body {
      padding: 36px 32px;
      background: #ffffff;
    }
    .greeting {
      font-size: 19px;
      font-weight: 700;
      color: #102B46;
      margin-bottom: 14px;
    }
    .intro-text {
      font-size: 15px;
      line-height: 1.65;
      color: #334155;
      margin: 0 0 24px 0;
    }
    .highlight-card {
      background: linear-gradient(135deg, #102B46 0%, #15385b 100%);
      border-radius: 16px;
      padding: 24px 20px;
      color: #ffffff;
      text-align: center;
      margin: 28px 0;
      border: 1px solid #1e3a5f;
      box-shadow: 0 4px 15px rgba(16, 43, 70, 0.12);
    }
    .reg-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #94a3b8;
      font-weight: 700;
    }
    .reg-id {
      font-size: 28px;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 800;
      color: #F28C28;
      margin: 10px 0;
      letter-spacing: 1.5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .campus-badge {
      display: inline-block;
      background: rgba(242, 140, 40, 0.18);
      color: #ffb066;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      border: 1px solid rgba(242, 140, 40, 0.35);
    }
    .steps-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 22px 24px;
      margin: 26px 0;
    }
    .steps-heading {
      margin: 0 0 14px 0;
      font-size: 13px;
      color: #102B46;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    .steps-list {
      padding-left: 20px;
      margin: 0;
    }
    .contact-note {
      font-size: 13.5px;
      color: #475569;
      line-height: 1.6;
      margin: 26px 0 0 0;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .contact-link {
      color: #F28C28;
      font-weight: 700;
      text-decoration: none;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 28px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      line-height: 1.6;
    }
    .footer strong {
      color: #1e293b;
    }
    @media only screen and (max-width: 480px) {
      .body { padding: 24px 20px; }
      .header { padding: 28px 18px 24px; }
      .header-title { font-size: 19px; }
      .reg-id { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header Section with NGI Logo -->
    <div class="header">
      ${
        logoSrc
          ? `
      <div class="logo-container">
        <img src="${logoSrc}" alt="NGI Logo" class="logo-img" width="68" height="68" />
      </div>
      `
          : ""
      }
      <p class="header-institution">${institutionHeader}</p>
      <h1 class="header-title">${headerTitle}</h1>
    </div>

    <!-- Main Email Body -->
    <div class="body">
      <div class="greeting">Dear ${options.candidateName},</div>
      
      <p class="intro-text">
        ${welcomeMessage}
      </p>

      <!-- Highlight Card with Registration ID -->
      <div class="highlight-card">
        <div class="reg-label">${highlightLabel}</div>
        <div class="reg-id">${options.registrationId}</div>
        <div class="campus-badge">${campusBadge}</div>
      </div>

      <!-- What Happens Next Checklist -->
      <div class="steps-card">
        <h3 class="steps-heading">${stepsHeading}</h3>
        <ul class="steps-list">
          ${stepsHtml}
        </ul>
      </div>

      <!-- Helpdesk / Contact Information -->
      <p class="contact-note">
        For immediate questions regarding your application status, reply directly to this email or reach our admissions helpdesk at 
        <a href="mailto:${supportEmail}" class="contact-link">${supportEmail}</a> or call 
        <a href="tel:${supportPhone.replace(/\s+/g, "")}" class="contact-link">${supportPhone}</a>.
      </p>
    </div>

    <!-- Footer Information -->
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>${defaultCampusName}</strong></p>
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px;">${footerAffiliation}</p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">${footerCopyright}</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain Text Version (for email accessibility and minimal spam score)
  const text = `
${institutionHeader}
${headerTitle}
==================================================

Dear ${options.candidateName},

${welcomeMessage.replace(/<[^>]+>/g, "")}

${highlightLabel}: ${options.registrationId}
${campusBadge}

${stepsHeading}
${stepsText}

Need Help?
Admissions Helpdesk: ${supportEmail}
Helpline: ${supportPhone}

${defaultCampusName}
${footerAffiliation}
${footerCopyright}
  `.trim();

  return {
    subject,
    html,
    text,
    attachments,
    to: options.toEmail,
    from:
      options.fromEmail && options.fromName
        ? `"${options.fromName}" <${options.fromEmail}>`
        : options.fromEmail ||
          process.env.SMTP_FROM ||
          `"NGi Connect Admissions" <${process.env.SMTP_USER || "admissions@ngi.org.in"}>`,
    replyTo:
      options.replyTo ||
      process.env.SMTP_REPLY_TO ||
      supportEmail,
  };
}
