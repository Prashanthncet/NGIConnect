import mongoose, { Schema, Document, Model } from "mongoose";

export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "file"
  | "url"
  | "section_heading"
  | "description";

export interface IFormField {
  id: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for dropdown, radio, checkbox
  defaultValue?: string;
  order: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customErrorMessage?: string;
  };
  conditionalLogic?: {
    enabled: boolean;
    fieldId?: string;
    operator?: "equals" | "not_equals" | "contains";
    value?: string;
  };
}

export interface IFormSettings {
  allowMultipleSubmissions: boolean;
  uniqueField?: string; // e.g. "email" or "phone"
  submitButtonText?: string;
  successMessage?: string;
  requiresVerification?: boolean;
}

export interface IForm extends Document {
  title: string;
  description: string;
  institutionShortName: "NCET" | "NCMS";
  slug: string;
  status: "draft" | "published" | "archived";
  currentPublishedVersion: number;
  fields: IFormField[];
  settings: IFormSettings;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormVersion extends Document {
  formId: mongoose.Types.ObjectId;
  versionNumber: number;
  fields: IFormField[];
  settings: IFormSettings;
  publishedAt: Date;
  publishedBy?: mongoose.Types.ObjectId;
  notes?: string;
}

const FormFieldSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "short_text",
        "long_text",
        "email",
        "phone",
        "number",
        "date",
        "dropdown",
        "radio",
        "checkbox",
        "file",
        "url",
        "section_heading",
        "description",
      ],
    },
    description: { type: String },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
    defaultValue: { type: String },
    order: { type: Number, default: 0 },
    validation: {
      minLength: { type: Number },
      maxLength: { type: Number },
      min: { type: Number },
      max: { type: Number },
      pattern: { type: String },
      customErrorMessage: { type: String },
    },
    conditionalLogic: {
      enabled: { type: Boolean, default: false },
      fieldId: { type: String },
      operator: { type: String, enum: ["equals", "not_equals", "contains"] },
      value: { type: String },
    },
  },
  { _id: false }
);

const FormSettingsSchema = new Schema(
  {
    allowMultipleSubmissions: { type: Boolean, default: false },
    uniqueField: { type: String, default: "email" },
    submitButtonText: { type: String, default: "Submit Registration" },
    successMessage: { type: String, default: "Thank you for registering with Nagarjuna Connect." },
    requiresVerification: { type: Boolean, default: true },
  },
  { _id: false }
);

const FormSchema: Schema<IForm> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    institutionShortName: { type: String, enum: ["NCET", "NCMS"], required: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    currentPublishedVersion: { type: Number, default: 0 },
    fields: [FormFieldSchema],
    settings: { type: FormSettingsSchema, default: () => ({}) },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

const FormVersionSchema: Schema<IFormVersion> = new Schema(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
    versionNumber: { type: Number, required: true },
    fields: [FormFieldSchema],
    settings: { type: FormSettingsSchema, required: true },
    publishedAt: { type: Date, default: Date.now },
    publishedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    notes: { type: String },
  },
  { timestamps: true }
);

FormVersionSchema.index({ formId: 1, versionNumber: 1 }, { unique: true });

export const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);
export const FormVersion: Model<IFormVersion> =
  mongoose.models.FormVersion || mongoose.model<IFormVersion>("FormVersion", FormVersionSchema);

