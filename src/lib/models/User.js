import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    label:     { type: String, default: "Home" },
    firstName: { type: String, trim: true, default: "" },
    lastName:  { type: String, trim: true, default: "" },
    line1:     { type: String, trim: true, default: "" },
    line2:     { type: String, trim: true, default: "" },
    city:      { type: String, trim: true, default: "" },
    state:     { type: String, trim: true, default: "" },
    pincode:   { type: String, trim: true, default: "" },
    country:   { type: String, trim: true, default: "India" },
    phone:     { type: String, trim: true, default: "" },
    altPhone:  { type: String, trim: true, default: "" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true,
      default: "",
      sparse: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      index: true,
    },
    name:  { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
