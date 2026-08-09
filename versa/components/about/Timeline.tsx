'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/publicApi';

type TimelineItem = { year: string; title: string; desc: string };

export default function Timeline() {
  const t = useTranslations('about');
  const staticItems = t.raw('timeline') as TimelineItem[];
  const [items, setItems] = useState<TimelineItem[]>(staticItems);

  useEffect(() => {
    publicApi.getAbout().then((res) => {
      if (res?.about?.timeline?.length) {
        setItems(
          res.about.timeline.map((it: any) => ({ year: it.date, title: it.title, desc: it.description }))
        );
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-28">
      <div className="mb-14">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('journeyEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">
          {t('journeyTitle')}
        </div>
      </div>

      <div className="relative ps-8">
        <div className="absolute top-0 bottom-0 start-[7px] w-px" style={{ background: 'var(--line)' }} />
        <div className="flex flex-col gap-12">
          {items.map((item, i) => (
            <motion.div
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative"
            >
              <div
                className="absolute -start-[33px] top-1 w-3.5 h-3.5 rounded-full border-2"
                style={{ borderColor: 'var(--accent)', background: 'var(--bg)' }}
              />
              <div className="font-mono text-xs mb-1.5" style={{ color: 'var(--accent-2)' }}>
                {item.year}
              </div>
              <h4 className="font-display text-lg font-semibold mb-1.5">{item.title}</h4>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--ink-dim)' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
