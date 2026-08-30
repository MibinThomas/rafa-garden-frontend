import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
  createdAt: Date;
}

const MediaSchema = new Schema({
  url: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  size: { type: Number },
  mimeType: { type: String }
}, { timestamps: true });

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
