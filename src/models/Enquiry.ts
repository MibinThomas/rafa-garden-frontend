import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  productId?: string;
  status: "new" | "contacted" | "completed" | "ignored";
  notes: Array<{ text: string; createdAt: Date }>;
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  productId: { type: String },
  status: {
    type: String,
    enum: ["new", "contacted", "completed", "ignored"],
    default: "new"
  },
  notes: [{
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
