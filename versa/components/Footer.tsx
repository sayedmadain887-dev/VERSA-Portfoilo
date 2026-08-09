'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer id="footer" className="border-t px-[5vw] pt-20 pb-8" style={{ borderColor: 'var(--line)' }}>
      <div className="text-center mb-24">
        <div className="font-mono text-xs tracking-[2px] flex justify-center mb-4" style={{ color: 'var(--accent)' }}>
          {t('eyebrow')}
        </div>
        <h2 className="font-display font-bold tracking-tighter text-[clamp(28px,4.5vw,60px)] mb-8">
          {t('titleLine1')}
          <br />
          {t('titleLine2')}
        </h2>
        <Link
          href={`/${locale}/contact`}
          data-cursor-hover
          className="font-semibold text-sm px-8 py-4 rounded-full inline-flex items-center gap-2"
          style={{ background: 'var(--ink)', color: 'var(--bg)' }}
        >
          {t('cta')}
        </Link>
      </div>

      <div className="flex justify-between flex-wrap gap-10 pb-10 border-b mb-6" style={{ borderColor: 'var(--line)' }}>
        <div>
          <h5 className="font-mono text-xs tracking-[1.5px] mb-4.5" style={{ color: 'var(--ink-dim)' }}>
            {t('navTitle')}
          </h5>
          <Link href={`/${locale}`} className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            {nav('home')}
          </Link>
          <Link href={`/${locale}/about`} className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            {nav('about')}
          </Link>
          <Link href={`/${locale}/services`} className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            {nav('services')}
          </Link>
          <Link href={`/${locale}/skills`} className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            {nav('skills')}
          </Link>
          <Link href={`/${locale}/projects`} className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            {nav('projects')}
          </Link>
          <Link href={`/${locale}/contact`} className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            {nav('contact')}
          </Link>
        </div>
        <div>
          <h5 className="font-mono text-xs tracking-[1.5px] mb-4.5" style={{ color: 'var(--ink-dim)' }}>
            {t('contactTitle')}
          </h5>
          <a href="mailto:hello@versa.dev" className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            hello@versa.dev
          </a>
          <a href="#" className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            WhatsApp
          </a>
          <a href="#" className="block text-sm mb-2.5 opacity-85 hover:opacity-100">
            LinkedIn
          </a>
        </div>
        <div>
          <h5 className="font-mono text-xs tracking-[1.5px] mb-4.5" style={{ color: 'var(--ink-dim)' }}>
            {t('locationTitle')}
          </h5>
          <div className="text-sm mb-2.5 opacity-85">{t('location')}</div>
          <div className="text-sm mb-2.5 opacity-85">{t('remote')}</div>
        </div>
      </div>

      <div className="flex justify-between font-mono text-xs flex-wrap gap-2.5" style={{ color: 'var(--ink-dim)' }}>
        <span>© 2026 VERSA. {t('rights')}</span>
        <span>{t('builtWith')}</span>
      </div>
    </footer>
  );
}
