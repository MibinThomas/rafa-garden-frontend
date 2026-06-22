import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: { type: String },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5 },
  image: { type: String }, // Recommended: 150x150px square avatar
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
