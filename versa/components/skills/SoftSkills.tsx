'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function SoftSkills() {
  const t = useTranslations('skillsPage');
  const soft = t.raw('soft') as string[];
  const languages = t.raw('languages') as { name: string; level: string }[];

  return (
    <section className="px-[5vw] pb-32">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('softEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">
          {t('softTitle')}
        </div>
      </div>

      <div className="grid md:grid-cols-[1.4fr,1fr] gap-5">
        <div className="flex flex-wrap gap-3 content-start">
          {soft.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              data-cursor-hover
              className="text-sm px-5 py-3 rounded-full border transition-colors hover:border-[var(--accent)]"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              {s}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {languages.map((l) => (
            <div
              key={l.name}
              className="flex justify-between items-center px-5 py-4 rounded-xl border"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <span className="text-sm font-medium">{l.name}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--accent-2)' }}>
                {l.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
