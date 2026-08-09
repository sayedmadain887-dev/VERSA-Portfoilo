const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema(
  {
    hero: {
      name: { type: String, trim: true },
      role: { type: String, trim: true },
      headline: { type: String, trim: true },
      description: { type: String, trim: true },
      primaryButtonText: { type: String, trim: true },
      primaryButtonLink: { type: String, trim: true },
      secondaryButtonText: { type: String, trim: true },
      secondaryButtonLink: { type: String, trim: true },
      image: { type: String }
    },
    stats: [
      {
        label: { type: String, trim: true },
        value: { type: Number, default: 0 },
        suffix: { type: String, trim: true, default: '' },
        order: { type: Number, default: 0 }
      }
    ],
    sections: {
      skills: {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        visible: { type: Boolean, default: true }
      },
      projects: {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        visible: { type: Boolean, default: true },
        featuredProjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
      },
      services: {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        visible: { type: Boolean, default: true },
        featuredServiceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeContent', homeContentSchema);
