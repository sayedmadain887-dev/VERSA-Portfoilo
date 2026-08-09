'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ContactFaq() {
  const t = useTranslations('contactPage');
  const faqs = t.raw('faqs') as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-[5vw] pb-28">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('faqEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">{t('faqTitle')}</div>
      </div>

      <div className="max-w-2xl flex flex-col border-t" style={{ borderColor: 'var(--line)' }}>
        {faqs.map((faq, i) => (
          <div key={faq.q} className="border-b" style={{ borderColor: 'var(--line)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              data-cursor-hover
              className="w-full flex justify-between items-center gap-4 py-5 text-start"
            >
              <span className="font-medium text-sm">{faq.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
                <ChevronDown size={16} style={{ color: 'var(--ink-dim)' }} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm leading-relaxed pb-5" style={{ color: 'var(--ink-dim)' }}>
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
