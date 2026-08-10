'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';
import { api } from '@/lib/adminApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const inputStyle = { background: '#0a0b10', borderColor: 'rgba(244,245,247,0.09)', color: '#f4f5f7' };
const TABS = ['Hero', 'When to Reach Out', 'How We Work', 'Form Options', 'Contact Info', 'Work Agreement', 'Final CTA'] as const;

export default function ContactAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await api.get('/admin/settings/contact');
    setSettings(res.item);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await api.put('/admin/settings/contact', settings);
    setSaving(false);
  };

  const uploadAgreement = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/admin/media`, { method: 'POST', credentials: 'include', body: formData });
    const data = await res.json();
    const updated = { ...settings, workAgreement: { fileUrl: data.item.url, fileName: file.name, uploadedAt: new Date().toISOString() } };
    setSettings(updated);
    await api.put('/api/admin/settings/contact', updated);
  };

  if (loading || !settings) return <div className="text-sm" style={{ color: '#9096a6' }}>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-semibold text-2xl mb-1">Contact Page</h1>
      <p className="text-sm mb-6" style={{ color: '#9096a6' }}>
        Every editable part of the existing Contact page — no new sections, same design.
      </p>

      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3.5 py-2.5 text-xs whitespace-nowrap border-b-2 -mb-px"
            style={{ borderColor: tab === t ? '#7C5CFC' : 'transparent', color: tab === t ? '#f4f5f7' : '#9096a6' }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Hero' && (
        <div className="flex flex-col gap-3">
          <Field label="Title" value={settings.hero?.title} onChange={(v) => setSettings({ ...settings, hero: { ...settings.hero, title: v } })} />
          <TextArea label="Subtitle" value={settings.hero?.subtitle} onChange={(v) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: v } })} rows={2} />
        </div>
      )}

      {tab === 'When to Reach Out' && (
        <ListEditor
          items={settings.whenToReachOut || []}
          onChange={(items) => setSettings({ ...settings, whenToReachOut: items })}
          newItem={{ text: 'New case', icon: 'check', order: 0, visible: true }}
          renderFields={(item, update) => (
            <input placeholder="Text" value={item.text} onChange={(e) => update({ ...item, text: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
          )}
        />
      )}

      {tab === 'How We Work' && (
        <ListEditor
          items={settings.howWeWork || []}
          onChange={(items) => setSettings({ ...settings, howWeWork: items })}
          newItem={{ title: 'New step', description: '', icon: 'message-circle', order: 0, visible: true }}
          renderFields={(item, update) => (
            <div className="flex flex-col gap-2">
              <input placeholder="Title" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
              <input placeholder="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
            </div>
          )}
        />
      )}

      {tab === 'Form Options' && (
        <div className="flex flex-col gap-6">
          {(['projectTypes', 'budgets', 'timelines'] as const).map((key) => (
            <div key={key}>
              <h4 className="text-xs font-mono mb-2 capitalize" style={{ color: '#9096a6' }}>{key}</h4>
              <ListEditor
                items={settings.formOptions?.[key] || []}
                onChange={(items) => setSettings({ ...settings, formOptions: { ...settings.formOptions, [key]: items } })}
                newItem={{ label: 'New option', order: 0, visible: true }}
                renderFields={(item, update) => (
                  <input placeholder="Label" value={item.label} onChange={(e) => update({ ...item, label: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
                )}
              />
            </div>
          ))}
        </div>
      )}

      {tab === 'Contact Info' && (
        <div className="flex flex-col gap-3">
          {(['email', 'phone', 'whatsapp', 'linkedin', 'github', 'location'] as const).map((key) => (
            <Field
              key={key}
              label={key[0].toUpperCase() + key.slice(1)}
              value={settings.contactInfo?.[key]}
              onChange={(v) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, [key]: v } })}
            />
          ))}
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9096a6' }}>Availability Status</label>
            <select
              value={settings.contactInfo?.availabilityStatus || 'available'}
              onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, availabilityStatus: e.target.value } })}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
              style={inputStyle}
            >
              <option value="available">🟢 Available for New Projects</option>
              <option value="limited">🟡 Limited Availability</option>
              <option value="booked">🔴 Fully Booked</option>
            </select>
          </div>
          <Field
            label="Availability Text"
            value={settings.contactInfo?.availabilityText}
            onChange={(v) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, availabilityText: v } })}
          />
        </div>
      )}

      {tab === 'Work Agreement' && (
        <div>
          {settings.workAgreement?.fileName ? (
            <div className="flex items-center justify-between rounded-lg border px-4 py-3 mb-3" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
              <div className="flex items-center gap-2.5 text-sm">
                <FileText size={15} style={{ color: '#7C5CFC' }} />
                {settings.workAgreement.fileName}
              </div>
              <span className="text-xs" style={{ color: '#9096a6' }}>
                {new Date(settings.workAgreement.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <p className="text-xs mb-3" style={{ color: '#9096a6' }}>No agreement uploaded yet.</p>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAgreement(e.target.files[0])} />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg admin-primary-btn">
            <Upload size={14} /> Upload New Agreement (replaces current)
          </button>
        </div>
      )}

      {tab === 'Final CTA' && (
        <div className="flex flex-col gap-3">
          <Field label="Title" value={settings.finalCta?.title} onChange={(v) => setSettings({ ...settings, finalCta: { ...settings.finalCta, title: v } })} />
          <Field label="Button Text" value={settings.finalCta?.buttonText} onChange={(v) => setSettings({ ...settings, finalCta: { ...settings.finalCta, buttonText: v } })} />
          <Field label="Button Link" value={settings.finalCta?.buttonLink} onChange={(v) => setSettings({ ...settings, finalCta: { ...settings.finalCta, buttonLink: v } })} />
        </div>
      )}

      <button onClick={save} disabled={saving} className="font-medium text-sm px-6 py-2.5 rounded-lg mt-6 admin-primary-btn">
        {saving ? 'Saving...' : 'Save Contact Page'}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: '#9096a6' }}>{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2.5 text-sm" style={inputStyle} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value?: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: '#9096a6' }}>{label}</label>
      <textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2.5 text-sm resize-none" style={inputStyle} />
    </div>
  );
}

function ListEditor({
  items,
  onChange,
  newItem,
  renderFields
}: {
  items: any[];
  onChange: (items: any[]) => void;
  newItem: any;
  renderFields: (item: any, update: (v: any) => void) => React.ReactNode;
}) {
  const add = () => onChange([...items, { ...newItem, _id: `tmp-${Date.now()}` }]);
  const update = (i: number, value: any) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <div key={item._id || i} className="rounded-lg border p-3 flex items-start gap-3" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
          <div className="flex-1">{renderFields(item, (v) => update(i, v))}</div>
          <button onClick={() => remove(i)} style={{ color: '#9096a6' }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border self-start" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <Plus size={13} /> Add
      </button>
    </div>
  );
}
