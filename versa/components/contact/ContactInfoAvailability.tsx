'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

const STATUS_COLOR: Record<string, string> = {
  available: 'var(--accent-2)',
  limited: '#e6b800',
  booked: '#ff5050'
};

export default function ContactInfoAvailability() {
  const t = useTranslations('contactPage');
  const [contact, setContact] = useState({
    email: 'hello@versa.dev',
    phone: '+20 100 000 0000',
    linkedin: '#',
    github: '#'
  });
  const [availability, setAvailability] = useState({
    status: 'available',
    statusText: t('availabilityStatus'),
    desc: t('availabilityDesc')
  });

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      const info = res?.settings?.contactInfo;
      if (info) {
        setContact({
          email: info.email || 'hello@versa.dev',
          phone: info.phone || '+20 100 000 0000',
          linkedin: info.linkedin || '#',
          github: info.github || '#'
        });
        setAvailability({
          status: info.availabilityStatus || 'available',
          statusText: info.availabilityText || t('availabilityStatus'),
          desc: info.availabilityText || t('availabilityDesc')
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dotColor = STATUS_COLOR[availability.status] || 'var(--accent-2)';

  return (
    <section className="px-[5vw] pb-28 grid md:grid-cols-[1fr,0.8fr] gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border p-8"
        style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
      >
        <div className="font-mono text-xs tracking-[2px] mb-5" style={{ color: 'var(--accent)' }}>
          {t('infoEyebrow')}
        </div>
        <h3 className="font-display text-xl font-semibold mb-6">{t('infoTitle')}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`mailto:${contact.email}`} data-cursor-hover className="flex items-center gap-3 text-sm rounded-xl border px-4 py-3.5" style={{ borderColor: 'var(--line)' }}>
            <Mail size={16} style={{ color: 'var(--accent)' }} /> {contact.email}
          </a>
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} data-cursor-hover className="flex items-center gap-3 text-sm rounded-xl border px-4 py-3.5" style={{ borderColor: 'var(--line)' }}>
            <Phone size={16} style={{ color: 'var(--accent)' }} /> {contact.phone}
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" data-cursor-hover className="flex items-center gap-3 text-sm rounded-xl border px-4 py-3.5" style={{ borderColor: 'var(--line)' }}>
            <Linkedin size={16} style={{ color: 'var(--accent)' }} /> LinkedIn
          </a>
          <a href={contact.github} target="_blank" rel="noreferrer" data-cursor-hover className="flex items-center gap-3 text-sm rounded-xl border px-4 py-3.5" style={{ borderColor: 'var(--line)' }}>
            <Github size={16} style={{ color: 'var(--accent)' }} /> GitHub
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="rounded-2xl border p-8 flex flex-col justify-center relative overflow-hidden"
        style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
      >
        <div
          className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--accent-2)' }}
        />
        <div className="font-mono text-xs tracking-[2px] mb-5 relative" style={{ color: 'var(--accent)' }}>
          {t('availabilityEyebrow')}
        </div>
        <div className="relative">
          <div className="text-xs mb-2" style={{ color: 'var(--ink-dim)' }}>
            {t('availabilityTitle')}
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full animate-pulseSoft" style={{ background: dotColor }} />
            <span className="font-display text-lg font-semibold">{availability.statusText}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
            {availability.desc}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
