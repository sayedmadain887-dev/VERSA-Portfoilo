'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { publicApi } from '@/lib/publicApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const fieldStyle = {
  background: 'var(--bg-elev)',
  borderColor: 'var(--line)',
  color: 'var(--ink)'
};

export default function ContactForm() {
  const t = useTranslations('contactPage.form');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [form, setForm] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: ''
  });

  const [projectTypes, setProjectTypes] = useState(t.raw('projectTypes') as string[]);
  const [budgets, setBudgets] = useState(t.raw('budgets') as string[]);
  const [timelines, setTimelines] = useState(t.raw('timelines') as string[]);

  useEffect(() => {
    publicApi.getContactSettings().then((res) => {
      const opts = res?.settings?.formOptions;
      if (opts?.projectTypes?.length) setProjectTypes(opts.projectTypes.map((o: any) => o.label));
      if (opts?.budgets?.length) setBudgets(opts.budgets.map((o: any) => o.label));
      if (opts?.timelines?.length) setTimelines(opts.timelines.map((o: any) => o.label));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Primary path: saves the message to the database so it shows up in
      // Admin Dashboard → Messages.
      const res = await fetch(`${API_BASE}/contact-messages/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('sent');
    } catch {
      // Fallback if the backend isn't running: open a pre-filled email so
      // the person can still send their inquiry.
      const subject = encodeURIComponent(`New project inquiry — ${form.projectType || 'General'}`);
      const body = encodeURIComponent(
        `Name: ${form.fullName}\nCompany: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\nProject Type: ${form.projectType}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\n\nDescription:\n${form.description}`
      );
      window.location.href = `mailto:hello@versa.dev?subject=${subject}&body=${body}`;
      setStatus('sent');
    }
  };

  return (
    <section id="contact-form" className="px-[5vw] pb-28">
      <div className="mb-10">
        <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
          {t('eyebrow')}
        </div>
        <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)]">{t('title')}</div>
      </div>

      <div className="relative max-w-3xl rounded-2xl border p-8 md:p-10" style={{ borderColor: 'var(--line)', background: 'var(--card)' }}>
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              >
                <CheckCircle2 size={56} style={{ color: 'var(--accent-2)' }} />
              </motion.div>
              <h3 className="font-display text-2xl font-semibold mt-6 mb-2">{t('successTitle')}</h3>
              <p className="text-sm max-w-sm" style={{ color: 'var(--ink-dim)' }}>
                {t('successDesc')}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t('fullName')} required value={form.fullName} onChange={(v) => update('fullName', v)} />
                <Field label={t('company')} value={form.company} onChange={(v) => update('company', v)} />
                <Field label={t('email')} type="email" required value={form.email} onChange={(v) => update('email', v)} />
                <Field label={t('phone')} type="tel" value={form.phone} onChange={(v) => update('phone', v)} />
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <Select label={t('projectType')} options={projectTypes} value={form.projectType} onChange={(v) => update('projectType', v)} />
                <Select label={t('budget')} options={budgets} value={form.budget} onChange={(v) => update('budget', v)} />
                <Select label={t('timeline')} options={timelines} value={form.timeline} onChange={(v) => update('timeline', v)} />
              </div>

              <div>
                <label className="text-xs font-mono mb-2 block" style={{ color: 'var(--ink-dim)' }}>
                  {t('description')}
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={t('descriptionPlaceholder')}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  style={fieldStyle}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                data-cursor-hover
                className="self-start font-semibold text-sm px-8 py-4 rounded-full mt-2 disabled:opacity-60"
                style={{ background: 'var(--ink)', color: 'var(--bg)' }}
              >
                {status === 'sending' ? t('sending') : `${t('submit')} →`}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-mono mb-2 block" style={{ color: 'var(--ink-dim)' }}>
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
        style={fieldStyle}
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-mono mb-2 block" style={{ color: 'var(--ink-dim)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
        style={fieldStyle}
      >
        <option value="" disabled>
          —
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
