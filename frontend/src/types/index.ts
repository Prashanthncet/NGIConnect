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
  options?: string[];
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
  uniqueField?: string;
  submitButtonText?: string;
  successMessage?: string;
  requiresVerification?: boolean;
}

export interface IForm {
  _id?: string;
  title: string;
  description: string;
  institutionShortName: "NCET" | "NCMS";
  slug: string;
  status: "draft" | "published" | "archived";
  currentPublishedVersion: number;
  fields: IFormField[];
  settings: IFormSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInstitution {
  _id?: string;
  name: string;
  shortName: string;
  description: string;
  officialWebsite: string;
  logo: string;
  location: string;
  establishedYear: number;
  affiliation: string;
  tags: string[];
  isActive: boolean;
}

export interface IRegistration {
  _id: string;
  registrationId: string;
  formId: string;
  formVersionNumber: number;
  institutionShortName: "NCET" | "NCMS";
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  department?: string;
  category?: string;
  responses: Record<string, any>;
  status: "Verified" | "Pending" | "Under Review" | "Rejected";
  submittedAt: string;
}

export interface IDashboardStats {
  total: number;
  today: number;
  week: number;
  ncetCount: number;
  ncmsCount: number;
  verifiedCount: number;
  pendingCount: number;
  trends: { date: string; ncet: number; ncms: number; total: number }[];
  categories: { name: string; count: number }[];
}

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
