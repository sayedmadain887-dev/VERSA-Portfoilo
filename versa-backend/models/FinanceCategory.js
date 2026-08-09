const mongoose = require('mongoose');

const financeCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    color: { type: String, default: '#7C5CFC' }, // for chart display
    icon: { type: String, default: 'tag' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FinanceCategory', financeCategorySchema);
