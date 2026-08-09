const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'code' },
    category: { type: String, required: true, trim: true }, // e.g. Frontend, Backend, Database...
    level: { type: Number, min: 0, max: 100, default: 80 },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
