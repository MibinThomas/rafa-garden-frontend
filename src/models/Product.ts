import mongoose from 'mongoose';

const ProductVariantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String },
  description: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  category: { type: String, required: true, index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
  id: { type: String, required: true, unique: true },
  variants: [ProductVariantSchema],
  price: { type: Number },
  offerPrice: { type: Number },
  sku: { type: String },
  stock: { type: Number, default: 0 },
  stockStatus: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  },
  lowStockThreshold: { type: Number, default: 10 },
  weight: { type: String },
  ingredients: { type: String },
  nutritionalInfo: { type: String },
  packaging: { type: String },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  seoTitle: { type: String },
  seoDescription: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
