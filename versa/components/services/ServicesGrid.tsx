'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { serviceIconMap } from './iconMap';
import { publicApi } from '@/lib/publicApi';
import { mapBackendService, type ServiceItem } from '@/lib/mapBackendService';

export default function ServicesGrid() {
  const t = useTranslations('servicesPage');
  const locale = useLocale();
  const staticItems = t.raw('items') as ServiceItem[];
  const [items, setItems] = useState<ServiceItem[]>(staticItems);

  useEffect(() => {
    publicApi.getServices().then((res) => {
      if (res?.services?.length) {
        setItems(res.services.map(mapBackendService));
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-32">
      <div className="grid md:grid-cols-2 gap-5">
        {items.map((service, i) => {
          const Icon = serviceIconMap[service.icon] ?? serviceIconMap.globe;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
              data-cursor-hover
              className="group rounded-2xl border p-8 relative overflow-hidden flex flex-col"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <div
                className="absolute -top-14 -end-14 w-44 h-44 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500"
                style={{ background: 'var(--accent)' }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}
              >
                <Icon size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 relative">{service.title}</h3>
              <p className="text-sm leading-relaxed mb-5 relative" style={{ color: 'var(--ink-dim)' }}>
                {service.desc}
              </p>
              <ul className="flex flex-col gap-2 mb-7 relative flex-1">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px]" style={{ color: 'var(--ink-dim)' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--accent-2)' }} className="shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/contact`}
                className="relative self-start text-sm font-semibold px-6 py-3 rounded-full border transition-colors"
                style={{ borderColor: 'var(--line)' }}
              >
                {t('requestService')} →
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
