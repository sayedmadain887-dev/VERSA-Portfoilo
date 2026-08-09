const { z } = require('zod');
const Transaction = require('../models/Transaction');
const FinanceCategory = require('../models/FinanceCategory');
const Client = require('../models/Client');

// ---------- Categories (custom "تقسيمة شغلي") ----------

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
  icon: z.string().optional()
});

async function listCategories(req, res) {
  const categories = await FinanceCategory.find().sort({ order: 1, createdAt: 1 });
  res.json({ categories });
}

async function createCategory(req, res) {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid category data' });
  const category = await FinanceCategory.create(parsed.data);
  res.status(201).json({ category });
}

async function updateCategory(req, res) {
  const category = await FinanceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ category });
}

async function deleteCategory(req, res) {
  await FinanceCategory.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
}

// ---------- Transactions (money in / money out) ----------

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  currency: z.string().optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  linkedProject: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
  date: z.string().optional()
});

async function listTransactions(req, res) {
  const { type, status, client, from, to, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (client) filter.client = client;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('category', 'name type color icon')
      .populate('client', 'name company')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(filter)
  ]);

  res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

async function createTransaction(req, res) {
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid transaction data' });
  const transaction = await Transaction.create(parsed.data);
  res.status(201).json({ transaction });
}

async function updateTransaction(req, res) {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ transaction });
}

async function deleteTransaction(req, res) {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Transaction deleted' });
}

// ---------- Clients (who's asking for what) ----------

const clientSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  requestSummary: z.string().optional(),
  projectType: z.string().optional(),
  status: z.enum(['lead', 'negotiating', 'active', 'completed', 'lost']).optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
});

async function listClients(req, res) {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const clients = await Client.find(filter).sort({ createdAt: -1 });
  res.json({ clients });
}

async function createClient(req, res) {
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid client data' });
  const client = await Client.create(parsed.data);
  res.status(201).json({ client });
}

async function updateClient(req, res) {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json({ client });
}

async function deleteClient(req, res) {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: 'Client deleted' });
}

// ---------- Stats (the dashboard numbers) ----------

async function getStats(req, res) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [totalIncomeAgg, totalExpenseAgg, monthIncomeAgg, pendingAgg, yearIncomeAgg, byCategory, clientStats] =
    await Promise.all([
      Transaction.aggregate([{ $match: { type: 'income', status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { type: 'expense', status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([
        { $match: { type: 'income', status: 'paid', date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'income', status: { $in: ['pending', 'overdue'] } } },
        { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'income', status: 'paid', date: { $gte: startOfYear } } },
        { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
        { $sort: { _id: 1 } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'income', status: 'paid' } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
      ]),
      Client.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);

  res.json({
    totalIncome: totalIncomeAgg[0]?.total || 0,
    totalExpense: totalExpenseAgg[0]?.total || 0,
    netProfit: (totalIncomeAgg[0]?.total || 0) - (totalExpenseAgg[0]?.total || 0),
    monthIncome: monthIncomeAgg[0]?.total || 0,
    pendingByStatus: pendingAgg,
    monthlyIncomeThisYear: yearIncomeAgg,
    incomeByCategory: byCategory,
    clientsByStatus: clientStats
  });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  listClients,
  createClient,
  updateClient,
  deleteClient,
  getStats
};
