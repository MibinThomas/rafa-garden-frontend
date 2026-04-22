import mongoose, { Schema, model, models } from "mongoose";

export interface ISiteContent {
  key: string;
  value: string;
  type: "text" | "image" | "json" | "font";
  group: "global" | "home" | "about" | "heritage" | "header" | "footer" | "social" | "menus" | "shop";
  label?: string;
  hint?: string;
  maxLength?: number;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "json", "font"], default: "text" },
    group: { type: String, enum: ["global", "home", "about", "heritage", "header", "footer", "social", "menus", "shop"], required: true },
    label: { type: String },
    hint: { type: String },
    maxLength: { type: Number },
  },
  { timestamps: true }
);

const SiteContent = mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
// Explicitly update enum if model was already registered (Next.js HMR quirk)
if (mongoose.models.SiteContent && mongoose.models.SiteContent.schema) {
  mongoose.models.SiteContent.schema.path('group').options.enum = ["global", "home", "about", "heritage", "header", "footer", "social", "menus", "shop"];
}

export default SiteContent;

