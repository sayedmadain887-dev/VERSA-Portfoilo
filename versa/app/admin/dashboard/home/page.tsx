'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/adminApi';

const inputStyle = { background: '#0a0b10', borderColor: 'rgba(244,245,247,0.09)', color: '#f4f5f7' };

export default function HomeAdminPage() {
  const [home, setHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await api.get('/admin/settings/home');
    setHome(res.item);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await api.put('/admin/settings/home', home);
    setSaving(false);
  };

  const addStat = () => {
    setHome({ ...home, stats: [...(home.stats || []), { label: 'New stat', value: 0, suffix: '', order: home.stats?.length || 0 }] });
  };
  const updateStat = (i: number, key: string, value: any) => {
    const stats = [...home.stats];
    stats[i] = { ...stats[i], [key]: value };
    setHome({ ...home, stats });
  };
  const removeStat = (i: number) => {
    setHome({ ...home, stats: home.stats.filter((_: any, idx: number) => idx !== i) });
  };

  if (loading || !home) return <div className="text-sm" style={{ color: '#9096a6' }}>Loading...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="font-semibold text-2xl mb-1">Home Page</h1>
        <p className="text-sm" style={{ color: '#9096a6' }}>
          Controls the Hero section and stats on the live Home page. Leave a field empty to keep the site's built-in
          default text.
        </p>
      </div>

      {/* Hero */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <h3 className="font-medium text-sm mb-4">Hero</h3>
        <div className="flex flex-col gap-3">
          <Field label="Name" value={home.hero?.name} onChange={(v) => setHome({ ...home, hero: { ...home.hero, name: v } })} />
          <Field label="Role / Title" value={home.hero?.role} onChange={(v) => setHome({ ...home, hero: { ...home.hero, role: v } })} />
          <TextArea label="Headline" value={home.hero?.headline} onChange={(v) => setHome({ ...home, hero: { ...home.hero, headline: v } })} rows={2} />
          <TextArea label="Description" value={home.hero?.description} onChange={(v) => setHome({ ...home, hero: { ...home.hero, description: v } })} rows={3} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Primary Button Text" value={home.hero?.primaryButtonText} onChange={(v) => setHome({ ...home, hero: { ...home.hero, primaryButtonText: v } })} />
            <Field label="Primary Button Link" value={home.hero?.primaryButtonLink} onChange={(v) => setHome({ ...home, hero: { ...home.hero, primaryButtonLink: v } })} />
            <Field label="Secondary Button Text" value={home.hero?.secondaryButtonText} onChange={(v) => setHome({ ...home, hero: { ...home.hero, secondaryButtonText: v } })} />
            <Field label="Secondary Button Link" value={home.hero?.secondaryButtonLink} onChange={(v) => setHome({ ...home, hero: { ...home.hero, secondaryButtonLink: v } })} />
          </div>
          <Field label="Hero Image URL (from Media Library)" value={home.hero?.image} onChange={(v) => setHome({ ...home, hero: { ...home.hero, image: v } })} />
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-sm">Statistics</h3>
          <button onClick={addStat} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
            <Plus size={13} /> Add stat
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {(home.stats || []).map((stat: any, i: number) => (
            <div key={i} className="grid grid-cols-[1fr,90px,70px,auto] gap-2 items-center">
              <input placeholder="Label" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} className="rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
              <input type="number" placeholder="Value" value={stat.value} onChange={(e) => updateStat(i, 'value', Number(e.target.value))} className="rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
              <input placeholder="Suffix" value={stat.suffix} onChange={(e) => updateStat(i, 'suffix', e.target.value)} className="rounded-lg border px-3 py-2 text-xs" style={inputStyle} />
              <button onClick={() => removeStat(i)} style={{ color: '#9096a6' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {(!home.stats || home.stats.length === 0) && (
            <p className="text-xs" style={{ color: '#9096a6' }}>No custom stats yet — the site shows its built-in defaults.</p>
          )}
        </div>
      </section>

      {/* Section visibility */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <h3 className="font-medium text-sm mb-4">Section Visibility</h3>
        <div className="flex flex-col gap-3">
          {(['skills', 'projects', 'services'] as const).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">{key} section</span>
              <button
                onClick={() =>
                  setHome({
                    ...home,
                    sections: { ...home.sections, [key]: { ...home.sections?.[key], visible: !home.sections?.[key]?.visible } }
                  })
                }
                className="text-xs font-mono px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: 'rgba(244,245,247,0.09)',
                  background: home.sections?.[key]?.visible !== false ? 'rgba(53,229,201,0.15)' : 'rgba(244,245,247,0.08)',
                  color: home.sections?.[key]?.visible !== false ? '#35E5C9' : '#9096a6'
                }}
              >
                {home.sections?.[key]?.visible !== false ? 'Visible' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <button onClick={save} disabled={saving} className="self-start font-medium text-sm px-6 py-2.5 rounded-lg admin-primary-btn">
        {saving ? 'Saving...' : 'Save Home Page'}
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
