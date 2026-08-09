const mongoose = require('mongoose');

const seoSettingsSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true, trim: true }, // 'home' | 'about' | 'skills' | 'projects' | 'services' | 'contact'
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    ogImage: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeoSettings', seoSettingsSchema);
