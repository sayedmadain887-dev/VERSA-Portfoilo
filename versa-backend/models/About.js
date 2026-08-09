const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    organization: { type: String, trim: true },
    icon: { type: String, default: 'briefcase' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { _id: true }
);

const aboutSchema = new mongoose.Schema(
  {
    // Singleton - there is only ever one About document
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    bio: { type: String, trim: true },
    description: { type: String, trim: true },
    photo: { type: String },
    location: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },

    timeline: [timelineItemSchema],

    stats: {
      yearsExperience: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      clients: { type: Number, default: 0 },
      technologies: { type: Number, default: 0 }
    },

    cv: {
      fileUrl: { type: String },
      fileName: { type: String },
      uploadedAt: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);
