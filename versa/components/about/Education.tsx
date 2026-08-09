'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Education() {
  const t = useTranslations('about');
  const items = t.raw('education') as { title: string; org: string; year: string }[];

  return (
    <section className="px-[5vw] pb-28">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('educationEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">
          {t('educationTitle')}
        </div>
      </div>

      <div className="flex flex-col border-t" style={{ borderColor: 'var(--line)' }}>
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="flex justify-between items-center py-6 border-b flex-wrap gap-2"
            style={{ borderColor: 'var(--line)' }}
          >
            <div>
              <h4 className="font-display text-base font-semibold">{item.title}</h4>
              <div className="text-[13px]" style={{ color: 'var(--ink-dim)' }}>
                {item.org}
              </div>
            </div>
            <div className="font-mono text-xs" style={{ color: 'var(--accent-2)' }}>
              {item.year}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
