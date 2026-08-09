const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    projectType: { type: String, trim: true },
    budget: { type: String, trim: true },
    timeline: { type: String, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new'
    }
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
