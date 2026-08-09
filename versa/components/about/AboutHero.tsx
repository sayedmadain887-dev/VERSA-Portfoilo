'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/publicApi';

export default function AboutHero() {
  const t = useTranslations('about');
  const [intro, setIntro] = useState(t('intro'));
  const [cvUrl, setCvUrl] = useState('/cv-placeholder.pdf');

  useEffect(() => {
    publicApi.getAbout().then((res) => {
      if (res?.about?.description) setIntro(res.about.description);
      if (res?.about?.cv?.fileUrl) setCvUrl(res.about.cv.fileUrl);
    });
  }, []);

  return (
    <section className="px-[5vw] pt-40 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-mono text-xs tracking-[2px] mb-5"
        style={{ color: 'var(--accent)' }}
      >
        {t('eyebrow')}
      </motion.div>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-14 items-start">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-bold tracking-tighter leading-[1.02] text-[clamp(32px,5.5vw,68px)]"
        >
          {t('titleLine1')} <span className="text-gradient">{t('titleLine2')}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-[15px] leading-relaxed mb-7" style={{ color: 'var(--ink-dim)' }}>
            {intro}
          </p>
          <a
            href={cvUrl}
            download
            data-cursor-hover
            className="font-semibold text-sm px-7 py-3.5 rounded-full border inline-flex items-center gap-2"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            {t('downloadCV')} ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}