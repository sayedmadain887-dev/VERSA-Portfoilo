'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import type { Project } from '@/lib/projectTypes';

export default function ProjectDetailHero({ project }: { project: Project }) {
  const t = useTranslations('projectsPage');
  const locale = useLocale();

  return (
    <section className="px-[5vw] pt-36 pb-14">
      <Link href={`/${locale}/projects`} className="font-mono text-xs mb-8 inline-block" style={{ color: 'var(--ink-dim)' }}>
        {t('backToProjects')}
      </Link>

      <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 items-end mb-10">
        <div>
          <div className="font-mono text-xs tracking-[2px] mb-4" style={{ color: 'var(--accent)' }}>
            {t(`filters.${project.category}`)} · {project.date}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display font-bold tracking-tighter leading-[1.02] text-[clamp(32px,5.5vw,64px)] mb-4"
          >
            {project.title}
          </motion.h1>
          <p className="text-lg" style={{ color: 'var(--ink-dim)' }}>
            {project.tagline}
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap lg:justify-end">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="text-sm font-semibold px-6 py-3 rounded-full"
            style={{ background: 'var(--ink)', color: 'var(--bg)' }}
          >
            {t('liveDemo')} ↗
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="text-sm font-semibold px-6 py-3 rounded-full border"
            style={{ borderColor: 'var(--line)' }}
          >
            {t('github')}
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="aspect-[21/9] rounded-2xl border relative flex items-center justify-center overflow-hidden"
        style={{ borderColor: 'var(--line)', background: project.mainImage ? undefined : 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, var(--bg-elev)), var(--bg-elev))' }}
      >
        {project.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.mainImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span
            className="font-mono text-xs border border-dashed px-4 py-2 rounded-full"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)', background: 'var(--bg)' }}
          >
            [ {project.title} — hero image placeholder ]
          </span>
        )}
      </motion.div>
    </section>
  );
}