'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/lib/projectTypes';
import { publicApi } from '@/lib/publicApi';
import { mapBackendProject } from '@/lib/mapBackendProject';

export default function Projects() {
  const t = useTranslations('projectsPage');
  const locale = useLocale();
  const staticItems = (t.raw('items') as Project[]).slice(0, 3);
  const [items, setItems] = useState<Project[]>(staticItems);

  useEffect(() => {
    publicApi.getProjects().then((res) => {
      if (res?.projects?.length) {
        setItems(res.projects.slice(0, 3).map(mapBackendProject));
      }
    });
  }, []);

  return (
    <section id="projects" className="px-[5vw] pb-36">
      <div className="flex justify-between items-end mb-14 flex-wrap gap-5">
        <div>
          <div className="font-mono text-xs tracking-[2px] mb-3.5" style={{ color: 'var(--accent)' }}>
            {t('eyebrow')}
          </div>
          <div className="font-display font-bold tracking-tight text-[clamp(24px,3.2vw,40px)] leading-tight">
            {t('title')}
          </div>
        </div>
        <Link
          href={`/${locale}/projects`}
          data-cursor-hover
          className="text-sm font-semibold px-6 py-3 rounded-full border shrink-0"
          style={{ borderColor: 'var(--line)' }}
        >
          {locale === 'ar' ? 'كل المشاريع' : 'View all projects'} →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/${locale}/projects/${p.slug}`}
              data-cursor-hover
              className="block border rounded-2xl overflow-hidden transition-transform hover:-translate-y-2"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <div
                className="aspect-[16/10] relative flex items-center justify-center overflow-hidden"
                style={{ background: p.mainImage ? undefined : 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, var(--bg-elev)), var(--bg-elev))' }}
              >
                {p.mainImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.mainImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span
                    className="font-mono text-[10px] border border-dashed px-3 py-1.5 rounded-full relative z-[1]"
                    style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)', background: 'var(--bg)' }}
                  >
                    [ {p.title} ]
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="font-mono text-[10px] tracking-wide mb-2" style={{ color: 'var(--accent-2)' }}>
                  {t(`filters.${p.category}`)}
                </div>
                <h3 className="font-display text-base font-semibold mb-2">{p.title}</h3>
                <p className="text-[13px] leading-relaxed mb-3.5 line-clamp-3" style={{ color: 'var(--ink-dim)' }}>
                  {p.shortDesc}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {p.techs.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2.5 py-1 rounded-full border"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}