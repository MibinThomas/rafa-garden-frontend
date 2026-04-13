import mongoose, { Schema, model, models } from "mongoose";

export interface ISiteContent {
  key: string;
  value: string;
  type: "text" | "image" | "json" | "font";
  group: "global" | "home" | "about" | "heritage";
  label?: string;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "json", "font"], default: "text" },
    group: { type: String, enum: ["global", "home", "about", "heritage"], required: true },
    label: { type: String },
  },
  { timestamps: true }
);

const SiteContent = models.SiteContent || model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;
