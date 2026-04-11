import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  readingTime: { type: String },
  category: { type: String, required: true },
  accentColor: { type: String, default: '#c81c6a' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// Check if the model exists before creating it (useful for Next.js hot reloading)
export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
