import mongoose from "mongoose";

const ReelSchema = new mongoose.Schema(
  {
    title:     { type: String, trim: true, default: "" },
    videoUrl:  { type: String, required: true, trim: true },
    thumbUrl:  { type: String, default: "" },   // optional poster image
    order:     { type: Number, default: 0, index: true },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Reel || mongoose.model("Reel", ReelSchema);
