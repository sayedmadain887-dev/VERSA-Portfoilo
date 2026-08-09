const mongoose = require('mongoose');

const navigationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    external: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

navigationSchema.index({ order: 1 });

module.exports = mongoose.model('Navigation', navigationSchema);
