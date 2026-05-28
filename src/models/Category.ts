import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true },
  color: { type: String, required: true },
  // Refactored: Products are now standalone documents
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  mobileTitle: { type: String },
  mobileShortDesc: { type: String },
  mobileActiveDesc: { type: String },
  mobileHeroImage: { type: String },
  desktopFeaturedProductId: { type: String },
  watermarkText: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
