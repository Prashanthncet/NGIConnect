import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInstitution extends Document {
  name: string;
  shortName: string; // NCET, NCMS
  description: string;
  officialWebsite: string;
  logo: string;
  location: string;
  establishedYear: number;
  affiliation: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema: Schema<IInstitution> = new Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, required: true },
    officialWebsite: { type: String, required: true },
    logo: { type: String, default: "" },
    location: { type: String, required: true },
    establishedYear: { type: Number, required: true },
    affiliation: { type: String, required: true },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Institution: Model<IInstitution> =
  mongoose.models.Institution || mongoose.model<IInstitution>("Institution", InstitutionSchema);

