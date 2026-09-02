import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['hero', 'productList', 'offer', 'custom'],
    default: 'custom'
  },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  content: mongoose.Schema.Types.Mixed, // flexible content based on type
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);

