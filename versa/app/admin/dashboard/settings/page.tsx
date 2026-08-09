'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/adminApi';

const inputStyle = { background: '#0a0b10', borderColor: 'rgba(244,245,247,0.09)', color: '#f4f5f7' };
const PAGES = ['home', 'about', 'skills', 'projects', 'services', 'contact'];

export default function SettingsAdminPage() {
  const [tab, setTab] = useState<'general' | 'seo'>('general');
  const [settings, setSettings] = useState<any>(null);
  const [seoItems, setSeoItems] = useState<Record<string, any>>({});
  const [activeSeoPage, setActiveSeoPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [siteRes, seoRes] = await Promise.all([api.get('/admin/settings/site'), api.get('/admin/settings/seo')]);
    setSettings(siteRes.item);
    const map: Record<string, any> = {};
    seoRes.items.forEach((s: any) => (map[s.page] = s));
    setSeoItems(map);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveGeneral = async () => {
    setSaving(true);
    await api.put('/admin/settings/site', settings);
    setSaving(false);
  };

  const saveSeo = async (page: string) => {
    setSaving(true);
    const data = seoItems[page] || {};
    await api.put(`/admin/settings/seo/${page}`, data);
    setSaving(false);
  };

  if (loading || !settings) return <div className="text-sm" style={{ color: '#9096a6' }}>Loading...</div>;

  const currentSeo = seoItems[activeSeoPage] || {};

  return (
    <div className="max-w-2xl">
      <h1 className="font-semibold text-2xl mb-1">Site Settings</h1>
      <p className="text-sm mb-6" style={{ color: '#9096a6' }}>
        General site info and per-page SEO metadata.
      </p>

      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        {(['general', 'seo'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm border-b-2 -mb-px capitalize"
            style={{ borderColor: tab === t ? '#7C5CFC' : 'transparent', color: tab === t ? '#f4f5f7' : '#9096a6' }}
          >
            {t === 'seo' ? 'SEO' : 'General'}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="flex flex-col gap-4">
          <Field label="Site Name" value={settings.siteName} onChange={(v) => setSettings({ ...settings, siteName: v })} />
          <Field label="Logo URL" value={settings.logo} onChange={(v) => setSettings({ ...settings, logo: v })} />
          <Field label="Favicon URL" value={settings.favicon} onChange={(v) => setSettings({ ...settings, favicon: v })} />
          <Field label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
          <Field label="Phone" value={settings.phone} onChange={(v) => setSettings({ ...settings, phone: v })} />
          <Field label="Location" value={settings.location} onChange={(v) => setSettings({ ...settings, location: v })} />
          <Field label="Copyright Text" value={settings.copyright} onChange={(v) => setSettings({ ...settings, copyright: v })} />

          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {(['linkedin', 'github', 'twitter', 'instagram'] as const).map((key) => (
              <Field
                key={key}
                label={key[0].toUpperCase() + key.slice(1)}
                value={settings.socialLinks?.[key]}
                onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [key]: v } })}
              />
            ))}
          </div>

          <TextArea label="Default SEO Title" value={settings.defaultSeoTitle} onChange={(v) => setSettings({ ...settings, defaultSeoTitle: v })} rows={2} />
          <TextArea label="Default SEO Description" value={settings.defaultSeoDescription} onChange={(v) => setSettings({ ...settings, defaultSeoDescription: v })} rows={3} />

          <button
            onClick={saveGeneral}
            disabled={saving}
            className="self-start font-medium text-sm px-6 py-2.5 rounded-lg mt-2 admin-primary-btn"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {tab === 'seo' && (
        <div>
          <div className="flex gap-2 flex-wrap mb-5">
            {PAGES.map((p) => (
              <button
                key={p}
                onClick={() => setActiveSeoPage(p)}
                className="text-xs px-3 py-1.5 rounded-full border capitalize"
                style={{
                  borderColor: activeSeoPage === p ? '#7C5CFC' : 'rgba(244,245,247,0.09)',
                  color: activeSeoPage === p ? '#7C5CFC' : '#9096a6'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Field
              label="Meta Title"
              value={currentSeo.metaTitle}
              onChange={(v) => setSeoItems({ ...seoItems, [activeSeoPage]: { ...currentSeo, metaTitle: v } })}
            />
            <TextArea
              label="Meta Description"
              value={currentSeo.metaDescription}
              onChange={(v) => setSeoItems({ ...seoItems, [activeSeoPage]: { ...currentSeo, metaDescription: v } })}
              rows={3}
            />
            <Field
              label="Open Graph Image URL"
              value={currentSeo.ogImage}
              onChange={(v) => setSeoItems({ ...seoItems, [activeSeoPage]: { ...currentSeo, ogImage: v } })}
            />
            <button
              onClick={() => saveSeo(activeSeoPage)}
              disabled={saving}
              className="self-start font-medium text-sm px-6 py-2.5 rounded-lg mt-2 admin-primary-btn"
            >
              {saving ? 'Saving...' : `Save SEO for "${activeSeoPage}"`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: '#9096a6' }}>
        {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm"
        style={inputStyle}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value?: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: '#9096a6' }}>
        {label}
      </label>
      <textarea
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm resize-none"
        style={inputStyle}
      />
    </div>
  );
}
