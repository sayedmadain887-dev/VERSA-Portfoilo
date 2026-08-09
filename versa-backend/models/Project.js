const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    mainImage: { type: String },
    galleryImages: [{ type: String }],
    videoUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    technologies: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    challenges: { type: String, trim: true },
    solutions: { type: String, trim: true },
    security: [{ type: String, trim: true }],
    performance: [{ type: String, trim: true }],
    completionDate: { type: Date },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['completed', 'inProgress'], default: 'completed' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true }
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });

module.exports = mongoose.model('Project', projectSchema);