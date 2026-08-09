'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageCircle, ClipboardList, Palette, FlaskConical, Rocket, Wrench, type LucideIcon } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

const iconMap: Record<string, LucideIcon> = {
  'message-circle': MessageCircle,
  'clipboard-list': ClipboardList,
  palette: Palette,
  'flask-conical': FlaskConical,
  rocket: Rocket,
  wrench: Wrench
};

type Step = { icon: string; title: string; desc: string };

export default function HowWeWork() {
  const t = useTranslations('contactPage');
  const staticSteps = t.raw('steps') as Step[];
  const [steps, setSteps] = useState<Step[]>(staticSteps);

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      if (res?.settings?.howWeWork?.length) {
        setSteps(res.settings.howWeWork.map((s: any) => ({ icon: s.icon, title: s.title, desc: s.description })));
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-28">
      <div className="mb-14">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('howEyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">{t('howTitle')}</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border" style={{ background: 'var(--line)', borderColor: 'var(--line)' }}>
        {steps.map((step, i) => {
          const Icon = iconMap[step.icon] ?? MessageCircle;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="p-7 relative"
              style={{ background: 'var(--bg)' }}
            >
              <div className="font-mono text-xs mb-4" style={{ color: 'var(--ink-dim)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}
              >
                <Icon size={19} style={{ color: 'var(--accent)' }} />
              </div>
              <h4 className="font-display text-base font-semibold mb-2">{step.title}</h4>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                {step.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
