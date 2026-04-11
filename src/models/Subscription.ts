import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  email: string;
  status: "active" | "unsubscribed";
  createdAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ["active", "unsubscribed"], 
    default: "active" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
