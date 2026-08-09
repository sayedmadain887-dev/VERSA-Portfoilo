'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, X, Loader2, Inbox } from 'lucide-react';
import { api } from '@/lib/adminApi';
import type { FieldConfig } from './fieldTypes';
import ImageField from './ImageField';
import GalleryField from './GalleryField';

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-black/25 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#7C5CFC]';

export default function ResourceManager({
  title,
  apiPath,
  fields,
  columns
}: {
  title: string;
  apiPath: string;
  fields: FieldConfig[];
  columns: string[];
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await api.get(apiPath);
    setItems(res.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [apiPath]);

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };
  const openEdit = (item: any) => {
    setEditing(item);
    setShowModal(true);
  };

  const remove = async (id: string) => {
    await api.delete(`${apiPath}/${id}`);
    setConfirmDelete(null);
    load();
  };

  const toggleVisible = async (item: any) => {
    await api.put(`${apiPath}/${item._id}`, { visible: !item.visible });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight">{title}</h1>
          <p className="text-xs text-[#9096a6] mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(90deg, #7C5CFC, #35E5C9)', color: '#08090d' }}
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#9096a6] py-10">
          <Loader2 size={14} className="animate-spin" /> Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="admin-glass rounded-2xl flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.04]">
            <Inbox size={18} className="text-[#5b5f6e]" />
          </div>
          <p className="text-sm text-[#9096a6]">Nothing here yet.</p>
          <button onClick={openCreate} className="text-xs font-medium text-[#7C5CFC]">
            + Create your first item
          </button>
        </div>
      ) : (
        <div className="admin-glass rounded-2xl overflow-hidden">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="flex justify-between items-center px-5 py-4 border-b border-white/[0.05] last:border-b-0 gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {columns.map((c) => item[c]).filter(Boolean).join(' · ')}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {'visible' in item && (
                  <button
                    onClick={() => toggleVisible(item)}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full transition-colors"
                    style={{
                      background: item.visible ? 'rgba(53,229,201,0.14)' : 'rgba(244,245,247,0.06)',
                      color: item.visible ? '#35E5C9' : '#9096a6'
                    }}
                  >
                    {item.visible ? 'Visible' : 'Hidden'}
                  </button>
                )}
                <button
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9096a6] hover:text-[#f4f5f7] hover:bg-white/[0.05] transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setConfirmDelete(item._id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9096a6] hover:text-red-300 hover:bg-red-500/[0.08] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <ResourceModal
            title={editing ? `Edit ${title}` : `New ${title}`}
            fields={fields}
            initial={editing}
            onClose={() => setShowModal(false)}
            onSubmit={async (data) => {
              if (editing) await api.put(`${apiPath}/${editing._id}`, data);
              else await api.post(apiPath, data);
              setShowModal(false);
              load();
            }}
          />
        )}
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm admin-glass rounded-2xl p-6"
            >
              <p className="text-sm mb-5">Delete this item? This can't be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => remove(confirmDelete)}
                  className="flex-1 text-sm font-semibold py-2.5 rounded-xl bg-red-500 text-white transition-opacity hover:opacity-90"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 text-sm font-medium py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResourceModal({
  title,
  fields,
  initial,
  onClose,
  onSubmit
}: {
  title: string;
  fields: FieldConfig[];
  initial: any | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const base: Record<string, any> = {};
    fields.forEach((f) => {
      const defaultBoolean = f.key === 'visible' ? true : false;
      base[f.key] = initial?.[f.key] ?? (f.type === 'boolean' ? defaultBoolean : f.type === 'tags' || f.type === 'imageList' ? [] : '');
    });
    return base;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg admin-glass rounded-2xl p-6 my-8"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-semibold text-base">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9096a6] hover:bg-white/[0.06] transition-colors">
            <X size={15} />
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs mb-1.5 block text-[#9096a6]">{f.label}</label>
              {f.type === 'textarea' && (
                <textarea
                  rows={3}
                  required={f.required}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              )}
              {f.type === 'text' && (
                <input
                  type="text"
                  required={f.required}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className={inputClass}
                />
              )}
              {f.type === 'date' && (
                <input
                  type="date"
                  required={f.required}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className={inputClass}
                />
              )}
              {f.type === 'number' && (
                <input
                  type="number"
                  required={f.required}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
                  className={inputClass}
                />
              )}
              {f.type === 'boolean' && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [f.key]: !form[f.key] })}
                  className="text-xs font-mono px-3.5 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: form[f.key] ? 'rgba(124,92,252,0.4)' : 'rgba(244,245,247,0.08)',
                    background: form[f.key] ? 'rgba(124,92,252,0.14)' : 'transparent',
                    color: form[f.key] ? '#7C5CFC' : '#9096a6'
                  }}
                >
                  {form[f.key] ? 'Yes' : 'No'}
                </button>
              )}
              {f.type === 'select' && (
                <select value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputClass}>
                  <option value="">—</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}
              {f.type === 'image' && (
                <ImageField value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />
              )}
              {f.type === 'imageList' && (
                <GalleryField value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />
              )}
              {f.type === 'tags' && (
                <input
                  type="text"
                  placeholder="Comma-separated, e.g. React, Next.js, Tailwind"
                  value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [f.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className={inputClass}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="mt-3 font-semibold text-sm py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #7C5CFC, #35E5C9)', color: '#08090d' }}
          >
            Save
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}