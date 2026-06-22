import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  content: { type: String, required: true }, // Rich Text editor content
  mainImage: { type: String, required: true }, // Recommended: 1000x562px (16:9)
  gallery: [{ type: String }], // Array of Vercel Blob URLs
  location: { type: String },
  status: { type: String, default: 'Completed' }, // e.g. Completed, In Progress, Draft
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
