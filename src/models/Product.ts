import mongoose from 'mongoose';

const ProductVariantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    index: true
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: false // Optional for backward compatibility during migration
  },
  id: { type: String, required: true, unique: true }, // Legacy ID like 'c-1'
  variants: [ProductVariantSchema],
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
