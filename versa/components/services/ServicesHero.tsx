'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ServicesHero() {
  const t = useTranslations('servicesPage');

  return (
    <section className="px-[5vw] pt-40 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-mono text-xs tracking-[2px] mb-5"
        style={{ color: 'var(--accent)' }}
      >
        {t('eyebrow')}
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-display font-bold tracking-tighter leading-[1.02] text-[clamp(30px,5.5vw,64px)] mb-6"
      >
        {t('title')}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl text-[15px] leading-relaxed"
        style={{ color: 'var(--ink-dim)' }}
      >
        {t('desc')}
      </motion.p>
    </section>
  );
}
