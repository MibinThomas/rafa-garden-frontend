import mongoose, { Schema, model, models } from "mongoose";

export interface ISiteContent {
  key: string;
  value: string;
  type: "text" | "image" | "json" | "font";
  group: "global" | "home" | "about" | "heritage" | "header" | "footer" | "social" | "menus";
  label?: string;
  hint?: string;
  maxLength?: number;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "json", "font"], default: "text" },
    group: { type: String, enum: ["global", "home", "about", "heritage", "header", "footer", "social", "menus"], required: true },
    label: { type: String },
    hint: { type: String },
    maxLength: { type: Number },
  },
  { timestamps: true }
);

const SiteContent = models.SiteContent || model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;
