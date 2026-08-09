'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/adminApi';
import StatCard from '@/components/admin/StatCard';

type Category = { _id: string; name: string; type: 'income' | 'expense'; color: string };
type TxItem = {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  status: string;
  date: string;
  category?: Category;
  client?: { _id: string; name: string };
};
type ClientItem = {
  _id: string;
  name: string;
  company?: string;
  projectType?: string;
  requestSummary?: string;
  status: string;
};
type Stats = {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  monthIncome: number;
  pendingByStatus: { _id: string; total: number; count: number }[];
};

const TABS = ['Overview', 'Transactions', 'Clients', 'Categories'] as const;

export default function FinancePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<TxItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [s, c, t, cl] = await Promise.all([
      api.get('/finance/stats'),
      api.get('/finance/categories'),
      api.get('/finance/transactions'),
      api.get('/finance/clients')
    ]);
    setStats(s);
    setCategories(c.categories);
    setTransactions(t.transactions);
    setClients(cl.clients);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const deleteTx = async (id: string) => {
    await api.delete(`/finance/transactions/${id}`);
    loadAll();
  };
  const deleteClient = async (id: string) => {
    await api.delete(`/finance/clients/${id}`);
    loadAll();
  };
  const deleteCategory = async (id: string) => {
    await api.delete(`/finance/categories/${id}`);
    loadAll();
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="font-semibold text-2xl mb-1">Finance</h1>
          <p className="text-sm" style={{ color: '#9096a6' }}>
            Private to you — this data is never exposed on the public site or API.
          </p>
        </div>
      </div>

      <div className="flex gap-1 my-6 border-b" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors"
            style={{
              borderColor: tab === t ? '#7C5CFC' : 'transparent',
              color: tab === t ? '#f4f5f7' : '#9096a6'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm" style={{ color: '#9096a6' }}>
          Loading...
        </div>
      ) : (
        <>
          {tab === 'Overview' && stats && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Income" value={`$${stats.totalIncome.toLocaleString()}`} accent="#35E5C9" />
              <StatCard label="Total Expenses" value={`$${stats.totalExpense.toLocaleString()}`} accent="#ff8080" />
              <StatCard label="Net Profit" value={`$${stats.netProfit.toLocaleString()}`} accent="#7C5CFC" />
              <StatCard label="This Month" value={`$${stats.monthIncome.toLocaleString()}`} />
              {stats.pendingByStatus.map((p) => (
                <StatCard
                  key={p._id}
                  label={`${p._id === 'pending' ? 'Pending' : 'Overdue'} (${p.count})`}
                  value={`$${p.total.toLocaleString()}`}
                  accent={p._id === 'overdue' ? '#ff8080' : undefined}
                />
              ))}
            </div>
          )}

          {tab === 'Transactions' && (
            <div>
              <button
                onClick={() => setShowTxModal(true)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg mb-5 admin-primary-btn"
              >
                <Plus size={15} /> Add Transaction
              </button>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
                {transactions.length === 0 && (
                  <div className="p-6 text-sm text-center" style={{ color: '#9096a6' }}>
                    No transactions yet.
                  </div>
                )}
                {transactions.map((t) => (
                  <div
                    key={t._id}
                    className="flex justify-between items-center px-5 py-3.5 border-b last:border-b-0"
                    style={{ borderColor: 'rgba(244,245,247,0.09)' }}
                  >
                    <div>
                      <div className="text-sm font-medium">{t.description || t.category?.name || '—'}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9096a6' }}>
                        {t.client?.name ? `${t.client.name} · ` : ''}
                        {new Date(t.date).toLocaleDateString()} · {t.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color: t.type === 'income' ? '#35E5C9' : '#ff8080' }}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </span>
                      <button onClick={() => deleteTx(t._id)} style={{ color: '#9096a6' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Clients' && (
            <div>
              <button
                onClick={() => setShowClientModal(true)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg mb-5 admin-primary-btn"
              >
                <Plus size={15} /> Add Client
              </button>
              <div className="grid sm:grid-cols-2 gap-4">
                {clients.map((c) => (
                  <div key={c._id} className="rounded-xl border p-5" style={{ borderColor: 'rgba(244,245,247,0.09)', background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{c.name}</div>
                      <button onClick={() => deleteClient(c._id)} style={{ color: '#9096a6' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {c.company && (
                      <div className="text-xs mb-1" style={{ color: '#9096a6' }}>
                        {c.company}
                      </div>
                    )}
                    <div
                      className="inline-block text-[10px] font-mono px-2 py-1 rounded-full mb-2"
                      style={{ background: 'rgba(124,92,252,0.15)', color: '#7C5CFC' }}
                    >
                      {c.status}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#9096a6' }}>
                      {c.requestSummary || 'No summary added yet.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Categories' && (
            <div>
              <button
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg mb-5 admin-primary-btn"
              >
                <Plus size={15} /> Add Category
              </button>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center gap-2 text-xs px-3.5 py-2 rounded-full border"
                    style={{ borderColor: 'rgba(244,245,247,0.09)' }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.name}
                    <span style={{ color: '#9096a6' }}>({c.type})</span>
                    <button onClick={() => deleteCategory(c._id)} style={{ color: '#9096a6' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showTxModal && (
          <TxModal
            categories={categories}
            clients={clients}
            onClose={() => setShowTxModal(false)}
            onSaved={() => {
              setShowTxModal(false);
              loadAll();
            }}
          />
        )}
        {showClientModal && (
          <ClientModal
            onClose={() => setShowClientModal(false)}
            onSaved={() => {
              setShowClientModal(false);
              loadAll();
            }}
          />
        )}
        {showCatModal && (
          <CategoryModal
            onClose={() => setShowCatModal(false)}
            onSaved={() => {
              setShowCatModal(false);
              loadAll();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border p-6"
        style={{ borderColor: 'rgba(244,245,247,0.09)', background: '#0f1119' }}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-base">{title}</h3>
          <button onClick={onClose} style={{ color: '#9096a6' }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

const inputStyle = { background: '#0a0b10', borderColor: 'rgba(244,245,247,0.09)', color: '#f4f5f7' };

function TxModal({
  categories,
  clients,
  onClose,
  onSaved
}: {
  categories: Category[];
  clients: ClientItem[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ type: 'income', amount: '', description: '', category: '', client: '', status: 'paid' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/finance/transactions', { ...form, amount: Number(form.amount) });
    onSaved();
  };
  return (
    <ModalShell title="Add Transaction" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input required type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="">No category</option>
          {categories.filter((c) => c.type === form.type).map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="">No client</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button type="submit" className="mt-2 font-medium text-sm py-2.5 rounded-lg admin-primary-btn">
          Save
        </button>
      </form>
    </ModalShell>
  );
}

function ClientModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', company: '', projectType: '', requestSummary: '', status: 'lead' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/finance/clients', form);
    onSaved();
  };
  return (
    <ModalShell title="Add Client" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
        <input placeholder="Project type" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
        <textarea placeholder="What did they ask for?" value={form.requestSummary} onChange={(e) => setForm({ ...form, requestSummary: e.target.value })} rows={3} className="rounded-lg border px-3 py-2.5 text-sm resize-none" style={inputStyle} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="lead">Lead</option>
          <option value="negotiating">Negotiating</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="lost">Lost</option>
        </select>
        <button type="submit" className="mt-2 font-medium text-sm py-2.5 rounded-lg admin-primary-btn">
          Save
        </button>
      </form>
    </ModalShell>
  );
}

function CategoryModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', type: 'income', color: '#7C5CFC' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/finance/categories', form);
    onSaved();
  };
  return (
    <ModalShell title="Add Category" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input required placeholder="e.g. Freelance projects, Hosting costs..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="rounded-lg border h-10" style={inputStyle} />
        <button type="submit" className="mt-2 font-medium text-sm py-2.5 rounded-lg admin-primary-btn">
          Save
        </button>
      </form>
    </ModalShell>
  );
}
