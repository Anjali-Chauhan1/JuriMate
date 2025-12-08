import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

// Create index for faster email lookups
userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);
