import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    city: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    bio: { type: String, trim: true },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Lawyer = mongoose.model("Lawyer", LawyerSchema);
