const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, default: 'globe' },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    visible: { type: Boolean, default: true },
    showOnHome: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

serviceSchema.index({ order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
