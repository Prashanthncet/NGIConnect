import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmailStep {
  title: string;
  description: string;
}

export interface IEmailTemplate extends Document {
  identifier: string; // "default" or institution-specific like "NCET" | "NCMS"
  institutionShortName: "ALL" | "NCET" | "NCMS";
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  institutionHeader: string;
  headerTitle: string;
  academicYear: string;
  welcomeMessage: string;
  highlightLabel: string;
  campusBadge: string;
  stepsHeading: string;
  steps: IEmailStep[];
  supportEmail: string;
  supportPhone: string;
  footerAffiliation: string;
  footerCopyright: string;
  useCidLogo: boolean;
  logoUrl?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailStepSchema = new Schema<IEmailStep>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    identifier: { type: String, required: true, unique: true, index: true, default: "default" },
    institutionShortName: { type: String, enum: ["ALL", "NCET", "NCMS"], default: "ALL" },
    subject: { type: String, default: "Registration Confirmed: {{registrationId}} - {{campusName}}" },
    fromName: { type: String, default: "Nagarjuna Connect Admissions" },
    fromEmail: { type: String, default: "" },
    replyTo: { type: String, default: "" },
    institutionHeader: { type: String, default: "NAGARJUNA GROUP OF INSTITUTIONS (NGI)" },
    headerTitle: { type: String, default: "Registration Confirmation & Thank You" },
    academicYear: { type: String, default: "2026-2027" },
    welcomeMessage: {
      type: String,
      default:
        "Thank you for registering with <strong>Nagarjuna Connect</strong> for <strong>{{campusName}}</strong>. Your application has been successfully logged into our central academic admissions registry.",
    },
    highlightLabel: { type: String, default: "YOUR OFFICIAL REGISTRATION ID" },
    campusBadge: { type: String, default: "{{institution}} Campus • Academic Session {{academicYear}}" },
    stepsHeading: { type: String, default: "WHAT HAPPENS NEXT:" },
    steps: {
      type: [EmailStepSchema],
      default: [
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
      ],
    },
    supportEmail: { type: String, default: "academic.connect@ncet.co.in" },
    supportPhone: { type: String, default: "+91 80 6746 2700" },
    footerAffiliation: {
      type: String,
      default: "Autonomous Institution • Affiliated to VTU / BNU • Approved by AICTE • Bengaluru",
    },
    footerCopyright: {
      type: String,
      default: "© 2026 Nagarjuna Education Society. All Rights Reserved.",
    },
    useCidLogo: { type: Boolean, default: true },
    logoUrl: { type: String, default: "" },
    updatedBy: { type: String, default: "Administrator" },
  },
  { timestamps: true }
);

export const EmailTemplate: Model<IEmailTemplate> =
  mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
