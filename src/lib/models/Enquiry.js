import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    // Export or India enquiry
    enquiryVariant: {
      type: String,
      enum: ["export", "india"],
      required: true,
      index: true,
    },

    // Contact details
    companyName:   { type: String, trim: true, required: true },
    contactName:   { type: String, trim: true, required: true },
    businessEmail: { type: String, trim: true, lowercase: true, required: true },
    country:       { type: String, trim: true, required: true },
    phone:         { type: String, trim: true, required: true },

    // Enquiry specifics
    enquiryType:     { type: String, trim: true, default: "" },
    orderQty:        { type: String, trim: true, default: "" },
    productCategory: { type: String, trim: true, default: "" },
    customisation:   { type: String, enum: ["Yes", "No", "Not Sure", ""], default: "" },
    packaging:       { type: String, enum: ["Yes", "No", "Not Sure", ""], default: "" },
    message:         { type: String, trim: true, default: "" },

    // Admin workflow
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
      index: true,
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
