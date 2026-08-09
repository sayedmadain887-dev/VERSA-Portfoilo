'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function MissionVision() {
  const t = useTranslations('about');

  const cards = [
    { key: 'mission', glow: 'var(--accent)' },
    { key: 'vision', glow: 'var(--accent-2)' }
  ];

  return (
    <section className="px-[5vw] pb-28 grid md:grid-cols-2 gap-5">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: i * 0.1 }}
          className="rounded-2xl border p-9 relative overflow-hidden"
          style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
        >
          <div
            className="absolute -top-16 -end-16 w-48 h-48 rounded-full opacity-20 blur-3xl"
            style={{ background: c.glow }}
          />
          <h3 className="font-display text-2xl font-semibold mb-4 relative">{t(`${c.key}.title`)}</h3>
          <p className="text-sm leading-relaxed relative" style={{ color: 'var(--ink-dim)' }}>
            {t(`${c.key}.text`)}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
