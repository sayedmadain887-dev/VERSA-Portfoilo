'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-black/25 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#7C5CFC]';

export default function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/admin/media`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.message || 'Upload failed');
        return;
      }
      const data = await res.json();
      onChange(data.item.url);
    } catch {
      alert('Upload failed - is the backend running?');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {value && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/[0.08]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste an image URL, or upload from your device →"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.svg"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'Uploading' : 'Upload'}
        </button>
      </div>
    </div>
  );
}