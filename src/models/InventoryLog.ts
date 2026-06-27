import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLog extends Document {
  productId: string;
  productName: string;
  sku: string;
  changeType: 'add' | 'reduce' | 'adjust';
  previousQty: number;
  newQty: number;
  note?: string;
  adminUser?: string;
  createdAt: Date;
}

const InventoryLogSchema: Schema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  sku: { type: String },
  changeType: {
    type: String,
    enum: ['add', 'reduce', 'adjust'],
    required: true
  },
  previousQty: { type: Number, required: true },
  newQty: { type: Number, required: true },
  note: { type: String },
  adminUser: { type: String, default: 'admin' },
}, { timestamps: true });

export default mongoose.models.InventoryLog || mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);
