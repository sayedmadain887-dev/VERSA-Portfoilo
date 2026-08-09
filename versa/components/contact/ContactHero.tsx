'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/publicApi';

export default function ContactHero() {
  const t = useTranslations('contactPage.hero');
  const [dynamicHero, setDynamicHero] = useState<{ title?: string; subtitle?: string } | null>(null);

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      if (res?.settings?.hero?.title || res?.settings?.hero?.subtitle) {
        setDynamicHero(res.settings.hero);
      }
    });
  }, []);

  return (
    <section className="relative px-[5vw] pt-40 pb-24 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(600px circle at 20% 20%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%), radial-gradient(500px circle at 80% 60%, color-mix(in srgb, var(--accent-2) 10%, transparent), transparent 60%)'
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
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
        className="font-display font-bold tracking-tighter leading-[1.02] text-[clamp(30px,5.5vw,64px)] mb-6 max-w-3xl"
      >
        {dynamicHero?.title || t('title')}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl text-lg leading-relaxed"
        style={{ color: 'var(--ink-dim)' }}
      >
        {dynamicHero?.subtitle || t('subtitle')}
      </motion.p>
    </section>
  );
}
