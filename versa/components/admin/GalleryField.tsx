'use client';

import ImageField from './ImageField';
import { Plus, X } from 'lucide-react';

export default function GalleryField({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const images = value || [];

  const updateAt = (i: number, url: string) => {
    const next = [...images];
    next[i] = url;
    onChange(next.filter(Boolean));
  };

  const removeAt = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  const addSlot = () => onChange([...images, '']);

  return (
    <div className="flex flex-col gap-3">
      {images.map((url, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <ImageField value={url} onChange={(v) => updateAt(i, v)} />
          </div>
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="shrink-0 w-8 h-8 mt-0.5 rounded-lg flex items-center justify-center text-[#9096a6] hover:text-red-300 hover:bg-red-500/[0.08] transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addSlot}
        className="self-start flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors"
      >
        <Plus size={13} /> Add image to gallery
      </button>
    </div>
  );
}