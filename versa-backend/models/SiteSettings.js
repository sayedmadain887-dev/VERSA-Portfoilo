const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'VERSA' },
    logo: { type: String },
    favicon: { type: String },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true }
    },
    location: { type: String, trim: true },
    copyright: { type: String, trim: true },
    defaultSeoTitle: { type: String, trim: true },
    defaultSeoDescription: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
