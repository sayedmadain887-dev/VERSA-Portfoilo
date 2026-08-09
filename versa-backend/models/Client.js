const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    // What the client asked for / is working on with you
    requestSummary: { type: String, trim: true },
    projectType: { type: String, trim: true },
    status: {
      type: String,
      enum: ['lead', 'negotiating', 'active', 'completed', 'lost'],
      default: 'lead'
    },
    source: { type: String, trim: true }, // e.g. "Contact form", "Referral", "Upwork"
    notes: { type: String, trim: true }, // free-form private notes only you see
    tags: [{ type: String, trim: true }],
    linkedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
