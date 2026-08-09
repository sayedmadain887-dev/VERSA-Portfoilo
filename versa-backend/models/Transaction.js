const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceCategory' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    linkedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    description: { type: String, trim: true },
    // For tracking money owed vs already received on a project
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'cancelled'],
      default: 'paid'
    },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
