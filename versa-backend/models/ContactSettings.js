const mongoose = require('mongoose');

const reachOutItemSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true },
    icon: { type: String, default: 'check' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { _id: true }
);

const workStepSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, default: 'message-circle' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { _id: true }
);

const formOptionSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { _id: true }
);

const contactSettingsSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, trim: true },
      subtitle: { type: String, trim: true }
    },
    whenToReachOut: [reachOutItemSchema],
    howWeWork: [workStepSchema],
    formOptions: {
      projectTypes: [formOptionSchema],
      budgets: [formOptionSchema],
      timelines: [formOptionSchema]
    },
    contactInfo: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      whatsapp: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      location: { type: String, trim: true },
      availabilityStatus: {
        type: String,
        enum: ['available', 'limited', 'booked'],
        default: 'available'
      },
      availabilityText: { type: String, trim: true }
    },
    workAgreement: {
      fileUrl: { type: String },
      fileName: { type: String },
      uploadedAt: { type: Date }
    },
    finalCta: {
      title: { type: String, trim: true },
      buttonText: { type: String, trim: true },
      buttonLink: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactSettings', contactSettingsSchema);
