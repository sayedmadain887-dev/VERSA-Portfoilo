'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { publicApi } from '@/lib/publicApi';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [extraLinks, setExtraLinks] = useState<{ href: string; label: string; route: boolean }[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Any navigation items added from the Admin Dashboard (e.g. a future
    // Blog page, or an external link) show up here automatically.
    publicApi.getNavigation?.().then((res: any) => {
      if (res?.items?.length) {
        setExtraLinks(
          res.items.map((item: any) => ({
            href: item.external ? item.href : `/${locale}${item.href}`,
            label: item.label,
            route: !item.external
          }))
        );
      }
    });
  }, [locale]);

  const switchLocale = (next: string) => {
    const rest = pathname.split('/').slice(2).join('/');
    router.push(`/${next}/${rest}`);
  };

  const links = [
    { href: `/${locale}`, label: t('home'), route: true },
    { href: `/${locale}/services`, label: t('services'), route: true },
    { href: `/${locale}/projects`, label: t('projects'), route: true },
    { href: `/${locale}/about`, label: t('about'), route: true },
    { href: `/${locale}/contact`, label: t('contact'), route: true },
    ...extraLinks
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-[100] px-[5vw] py-5 flex justify-between items-center backdrop-blur-md transition-colors duration-300 ${
        scrolled ? 'border-b' : 'border-b border-transparent'
      }`}
      style={{
        background: 'color-mix(in srgb, var(--bg) 70%, transparent)',
        borderColor: scrolled ? 'var(--line)' : 'transparent'
      }}
    >
      <div className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M4 6 L11 15 L4 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 24 H26" stroke="url(#lg)" strokeWidth="2.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="lg" x1="15" y1="24" x2="26" y2="24">
              <stop stopColor="#7C5CFC" />
              <stop offset="1" stopColor="#35E5C9" />
            </linearGradient>
          </defs>
        </svg>
        VERSA
      </div>

      <div className="hidden md:flex gap-9 text-sm font-medium">
        {links.map((l) =>
          l.route ? (
            <Link
              key={l.href}
              href={l.href}
              className="relative group transition-colors"
              style={{ color: 'var(--ink-dim)' }}
            >
              {l.label}
            </Link>
          ) : (
            <a
              key={l.href}
              href={l.href}
              className="relative group transition-colors"
              style={{ color: 'var(--ink-dim)' }}
            >
              {l.label}
            </a>
          )
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex text-xs font-mono border rounded-full overflow-hidden" style={{ borderColor: 'var(--line)' }}>
          {['en', 'ar'].map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className="px-3 py-1.5 transition-colors"
              style={{
                background: locale === l ? 'var(--accent)' : 'transparent',
                color: locale === l ? '#fff' : 'var(--ink-dim)'
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={toggle}
          data-cursor-hover
          className="w-11 h-6 rounded-full border relative"
          style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
          aria-label="Toggle theme"
        >
          <span
            className="absolute top-0.5 w-[18px] h-[18px] rounded-full transition-transform duration-300"
            style={{
              background: 'var(--accent)',
              left: '2px',
              transform: theme === 'light' ? 'translateX(20px)' : 'translateX(0)'
            }}
          />
        </button>
      </div>
    </nav>
  );
}
