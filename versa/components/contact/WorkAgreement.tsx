'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default function WorkAgreement() {
  const t = useTranslations('contactPage');
  const [fileUrl, setFileUrl] = useState('/work-agreement-placeholder.pdf');

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      if (res?.settings?.workAgreement?.fileUrl) {
        setFileUrl(res.settings.workAgreement.fileUrl);
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
      >
        <div>
          <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
            {t('agreementEyebrow')}
          </div>
          <h3 className="font-display text-xl font-semibold mb-2.5">{t('agreementTitle')}</h3>
          <p className="text-sm max-w-md" style={{ color: 'var(--ink-dim)' }}>
            {t('agreementDesc')}
          </p>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="shrink-0 font-semibold text-sm px-7 py-3.5 rounded-full border inline-flex items-center gap-2"
          style={{ borderColor: 'var(--line)' }}
        >
          <FileText size={16} />
          {t('agreementCta')}
        </a>
      </motion.div>
    </section>
  );
}