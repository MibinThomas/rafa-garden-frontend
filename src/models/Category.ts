import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number },
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  variants: [VariantSchema],
});

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true },
  color: { type: String, required: true },
  products: [ProductSchema],
}, { timestamps: true });

// Check if the model exists before creating it (useful for Next.js hot reloading)
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
