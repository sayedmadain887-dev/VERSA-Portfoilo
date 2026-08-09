'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/publicApi';

export default function ContactFinalCta() {
  const t = useTranslations('contactPage');
  const [cta, setCta] = useState<{ title?: string; buttonText?: string; buttonLink?: string } | null>(null);

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      if (res?.settings?.finalCta?.title || res?.settings?.finalCta?.buttonText) {
        setCta(res.settings.finalCta);
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-28 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="font-display font-bold tracking-tighter text-[clamp(30px,5vw,56px)] mb-8"
      >
        {cta?.title || t('finalTitle')}
      </motion.h2>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        href={cta?.buttonLink || '#contact-form'}
        data-cursor-hover
        className="inline-flex font-semibold text-sm px-9 py-4.5 rounded-full"
        style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', color: '#fff' }}
      >
        {cta?.buttonText || t('finalCta')} →
      </motion.a>
    </section>
  );
}
