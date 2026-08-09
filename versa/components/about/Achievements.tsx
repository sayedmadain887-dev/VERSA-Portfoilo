'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/publicApi';

export default function Achievements() {
  const t = useTranslations('about');
  const staticItems = t.raw('achievements') as { num: string; label: string }[];
  const [items, setItems] = useState(staticItems);

  useEffect(() => {
    publicApi.getAbout().then((res) => {
      const stats = res?.about?.stats;
      if (stats) {
        setItems([
          { num: String(stats.projectsCompleted ?? 0), label: staticItems[0]?.label || 'Projects' },
          { num: String(stats.clients ?? 0), label: staticItems[1]?.label || 'Clients' },
          { num: String(stats.technologies ?? 0), label: staticItems[2]?.label || 'Technologies' },
          { num: String(stats.yearsExperience ?? 0), label: staticItems[3]?.label || 'Years' }
        ]);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="px-[5vw] pb-28">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('achievementsEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">
          {t('achievementsTitle')}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border" style={{ background: 'var(--line)', borderColor: 'var(--line)' }}>
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="p-8 text-center"
            style={{ background: 'var(--bg)' }}
          >
            <div className="font-display text-4xl font-bold text-gradient mb-2">{item.num}</div>
            <div className="text-xs" style={{ color: 'var(--ink-dim)' }}>
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
