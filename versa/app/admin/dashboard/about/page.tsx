'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';
import { api } from '@/lib/adminApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const inputStyle = { background: '#0a0b10', borderColor: 'rgba(244,245,247,0.09)', color: '#f4f5f7' };

export default function AboutAdminPage() {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await api.get('/admin/about');
    setAbout(res.about);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const { name, role, bio, description, photo, location, email, phone, stats } = about;
    await api.put('/admin/about', { name, role, bio, description, photo, location, email, phone, stats });
    setSaving(false);
  };

  const addTimelineItem = async () => {
    await api.post('/admin/about/timeline', { date: '', title: 'New milestone', description: '', order: about.timeline.length });
    load();
  };
  const updateTimelineItem = async (id: string, data: any) => {
    await api.put(`/admin/about/timeline/${id}`, data);
  };
  const saveTimelineItem = async (id: string, data: any) => {
    await api.put(`/admin/about/timeline/${id}`, data);
    load();
  };
  const deleteTimelineItem = async (id: string) => {
    await api.delete(`/admin/about/timeline/${id}`);
    load();
  };

  const uploadCv = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/admin/media`, { method: 'POST', credentials: 'include', body: formData });
    const data = await res.json();
    await api.put('/api/admin/about/cv', { fileUrl: data.item.url, fileName: file.name });
    load();
  };

  if (loading || !about) return <div className="text-sm" style={{ color: '#9096a6' }}>Loading...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="font-semibold text-2xl mb-1">About</h1>
        <p className="text-sm" style={{ color: '#9096a6' }}>Personal info, timeline, and CV — all editable here, no code changes needed.</p>
      </div>

      {/* Personal Info */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <h3 className="font-medium text-sm mb-4">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {['name', 'role', 'location', 'email', 'phone'].map((key) => (
            <input
              key={key}
              placeholder={key}
              value={about[key] || ''}
              onChange={(e) => setAbout({ ...about, [key]: e.target.value })}
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={inputStyle}
            />
          ))}
        </div>
        <textarea
          placeholder="Bio"
          rows={2}
          value={about.bio || ''}
          onChange={(e) => setAbout({ ...about, bio: e.target.value })}
          className="w-full rounded-lg border px-3 py-2.5 text-sm mt-3 resize-none"
          style={inputStyle}
        />
        <textarea
          placeholder="Full description"
          rows={4}
          value={about.description || ''}
          onChange={(e) => setAbout({ ...about, description: e.target.value })}
          className="w-full rounded-lg border px-3 py-2.5 text-sm mt-3 resize-none"
          style={inputStyle}
        />
      </section>

      {/* Stats */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <h3 className="font-medium text-sm mb-4">Experience Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['yearsExperience', 'Years of Experience'],
            ['projectsCompleted', 'Projects Completed'],
            ['clients', 'Clients'],
            ['technologies', 'Technologies']
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs mb-1.5 block" style={{ color: '#9096a6' }}>{label}</label>
              <input
                type="number"
                value={about.stats?.[key] || 0}
                onChange={(e) => setAbout({ ...about, stats: { ...about.stats, [key]: Number(e.target.value) } })}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="self-start font-medium text-sm px-6 py-2.5 rounded-lg admin-primary-btn"
      >
        {saving ? 'Saving...' : 'Save Personal Info & Stats'}
      </button>

      {/* Timeline */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-sm">Timeline</h3>
          <button onClick={addTimelineItem} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
            <Plus size={13} /> Add item
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {about.timeline?.map((item: any) => (
            <div key={item._id} className="rounded-lg border p-4" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <input
                  placeholder="Date (e.g. 2025)"
                  defaultValue={item.date}
                  onBlur={(e) => saveTimelineItem(item._id, { date: e.target.value })}
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={inputStyle}
                />
                <input
                  placeholder="Title"
                  defaultValue={item.title}
                  onBlur={(e) => saveTimelineItem(item._id, { title: e.target.value })}
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={inputStyle}
                />
              </div>
              <textarea
                placeholder="Description"
                defaultValue={item.description}
                onBlur={(e) => saveTimelineItem(item._id, { description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border px-3 py-2 text-xs resize-none mb-2"
                style={inputStyle}
              />
              <button onClick={() => deleteTimelineItem(item._id)} className="flex items-center gap-1.5 text-xs" style={{ color: '#9096a6' }}>
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CV */}
      <section className="rounded-xl border p-6" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
        <h3 className="font-medium text-sm mb-4">CV / Resume</h3>
        {about.cv?.fileName ? (
          <div className="flex items-center justify-between rounded-lg border px-4 py-3 mb-3" style={{ borderColor: 'rgba(244,245,247,0.09)' }}>
            <div className="flex items-center gap-2.5 text-sm">
              <FileText size={15} style={{ color: '#7C5CFC' }} />
              {about.cv.fileName}
            </div>
            <span className="text-xs" style={{ color: '#9096a6' }}>
              {new Date(about.cv.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <p className="text-xs mb-3" style={{ color: '#9096a6' }}>No CV uploaded yet.</p>
        )}
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCv(e.target.files[0])} />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg admin-primary-btn"
        >
          <Upload size={14} /> Upload New CV (replaces current)
        </button>
      </section>
    </div>
  );
}
