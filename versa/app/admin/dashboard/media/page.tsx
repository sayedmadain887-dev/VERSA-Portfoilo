'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Copy, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '@/lib/adminApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type MediaItem = {
  _id: string;
  fileName: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  kind: 'image' | 'document';
  createdAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaAdminPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'' | 'image' | 'document'>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await api.get(`/admin/media${filter ? `?kind=${filter}` : ''}`);
    setItems(res.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${API_BASE}/admin/media`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          alert(body.message || `Failed to upload ${file.name}`);
        }
      } catch {
        alert(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/admin/media/${id}`);
    load();
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item._id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="font-semibold text-2xl mb-1">Media Library</h1>
          <p className="text-sm" style={{ color: '#9096a6' }}>
            Upload images and PDFs here, then paste the copied URL into Projects, About, or anywhere else that needs it.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center my-6">
        <div className="flex gap-2">
          {(['', 'image', 'document'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className="text-xs px-3 py-1.5 rounded-full border"
              style={{
                borderColor: filter === k ? '#7C5CFC' : 'rgba(244,245,247,0.09)',
                color: filter === k ? '#7C5CFC' : '#9096a6'
              }}
            >
              {k === '' ? 'All' : k === 'image' ? 'Images' : 'Documents'}
            </button>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-60 admin-primary-btn"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>

      {loading ? (
        <div className="text-sm" style={{ color: '#9096a6' }}>
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-sm text-center rounded-xl border py-16"
          style={{ borderColor: 'rgba(244,245,247,0.09)', color: '#9096a6' }}
        >
          No files yet. Upload images (JPG, PNG, WebP, SVG) or PDFs — max 15MB each.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'rgba(244,245,247,0.09)', background: 'rgba(255,255,255,0.03)' }}
            >
              <div
                className="aspect-square flex items-center justify-center"
                style={{ background: '#0a0b10' }}
              >
                {item.kind === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
                ) : (
                  <FileText size={28} style={{ color: '#9096a6' }} />
                )}
              </div>
              <div className="p-3">
                <div className="text-xs font-medium truncate mb-1">{item.originalName}</div>
                <div className="text-[10px] mb-2.5" style={{ color: '#9096a6' }}>
                  {formatSize(item.size)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-[11px] py-1.5 rounded-lg border"
                    style={{ borderColor: 'rgba(244,245,247,0.09)', color: copiedId === item._id ? '#35E5C9' : '#9096a6' }}
                  >
                    <Copy size={11} /> {copiedId === item._id ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => remove(item._id)}
                    className="px-2.5 rounded-lg border"
                    style={{ borderColor: 'rgba(244,245,247,0.09)', color: '#9096a6' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}