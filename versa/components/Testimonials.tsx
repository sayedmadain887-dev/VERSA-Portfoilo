'use client';

import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as { text: string; name: string; role: string }[];

  return (
    <section id="testimonials" className="px-[5vw] pb-36">
      <div className="mb-14">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('eyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)] leading-tight">
          {t('titleLine1')}
          <br />
          {t('titleLine2')}
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-2.5" style={{ scrollSnapType: 'x mandatory' }}>
        {items.map((item) => (
          <div
            key={item.name}
            className="min-w-[380px] rounded-[20px] border p-8"
            style={{ borderColor: 'var(--line)', background: 'var(--card)', scrollSnapAlign: 'start' }}
          >
            <div className="text-sm tracking-widest mb-4.5" style={{ color: 'var(--accent-2)' }}>
              ★★★★★
            </div>
            <p className="text-[15px] leading-relaxed mb-6">{item.text}</p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              >
                {item.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs" style={{ color: 'var(--ink-dim)' }}>
                  {item.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
