'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default function WhenToReachOut() {
  const t = useTranslations('contactPage');
  const staticItems = t.raw('whenItems') as string[];
  const [items, setItems] = useState<string[]>(staticItems);

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      if (res?.settings?.whenToReachOut?.length) {
        setItems(res.settings.whenToReachOut.map((i: any) => i.text));
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-28">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('whenEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">{t('whenTitle')}</div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="flex items-start gap-3 rounded-xl border p-4"
            style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
          >
            <CheckCircle2 size={18} style={{ color: 'var(--accent-2)' }} className="shrink-0 mt-0.5" />
            <span className="text-sm leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
