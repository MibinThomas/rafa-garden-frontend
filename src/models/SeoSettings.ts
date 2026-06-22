import mongoose from 'mongoose';

const SeoSettingsSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // e.g. 'home', 'about', 'shop', 'contact', 'blog'
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  keywords: { type: String }, // Comma separated tags
  ogImage: { type: String }, // Recommended: 1200x630px
}, { timestamps: true });

export default mongoose.models.SeoSettings || mongoose.model('SeoSettings', SeoSettingsSchema);
