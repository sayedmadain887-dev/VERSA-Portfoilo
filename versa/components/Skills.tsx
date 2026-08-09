'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const PERCENTAGES = [95, 90, 88, 85, 92, 87, 80, 93];

export default function Skills() {
  const t = useTranslations('skills');
  const items = t.raw('items') as { title: string; desc: string }[];

  return (
    <section id="skills" className="px-[5vw] pb-36">
      <div className="flex justify-between items-end mb-14 flex-wrap gap-5">
        <div>
          <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
            {t('eyebrow')}
          </div>
          <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)] leading-tight">
            {t('titleLine1')}
            <br />
            {t('titleLine2')}
          </div>
        </div>
        <p className="max-w-[420px] text-sm leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
          {t('desc')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border" style={{ background: 'var(--line)', borderColor: 'var(--line)' }}>
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="p-8 relative overflow-hidden transition-colors hover:bg-[var(--card)]"
            style={{ background: 'var(--bg)' }}
          >
            <div className="font-mono text-xs" style={{ color: 'var(--ink-dim)' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h4 className="font-display text-lg font-semibold mt-3.5 mb-2.5">{item.title}</h4>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
              {item.desc}
            </p>
            <div className="h-0.5 mt-4.5 relative overflow-hidden" style={{ background: 'var(--line)' }}>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformOrigin: 'left',
                  width: `${PERCENTAGES[i]}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                  height: '100%'
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
