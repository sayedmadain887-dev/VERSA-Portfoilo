const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    cloudinaryId: { type: String },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    kind: { type: String, enum: ['image', 'document'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);