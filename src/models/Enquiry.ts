import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["unread", "read", "archived"], 
    default: "unread" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
