import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistration extends Document {
  registrationId: string;
  formId: mongoose.Types.ObjectId;
  formVersionNumber: number;
  institutionShortName: "NCET" | "NCMS";
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  department?: string;
  category?: string; // Student, Alumni, Faculty, Industry
  responses: Record<string, any>;
  status: "Verified" | "Pending" | "Under Review" | "Rejected";
  submittedAt: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema<IRegistration> = new Schema(
  {
    registrationId: { type: String, required: true, unique: true, index: true },
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
    formVersionNumber: { type: Number, required: true },
    institutionShortName: { type: String, enum: ["NCET", "NCMS"], required: true, index: true },
    candidateName: { type: String, required: true, index: true },
    candidateEmail: { type: String, required: true, lowercase: true, index: true },
    candidatePhone: { type: String, default: "" },
    department: { type: String, default: "" },
    category: { type: String, default: "Student" },
    responses: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["Verified", "Pending", "Under Review", "Rejected"],
      default: "Pending",
      index: true,
    },
    submittedAt: { type: Date, default: Date.now, index: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

// Composite indexes for fast queries
RegistrationSchema.index({ formId: 1, candidateEmail: 1 });
RegistrationSchema.index({ institutionShortName: 1, submittedAt: -1 });

export const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

