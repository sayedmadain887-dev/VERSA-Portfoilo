'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Project } from '@/lib/projectTypes';

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const t = useTranslations('projectsPage');
  const locale = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const onMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: (py - 0.5) * -6, ry: (px - 0.5) * 6 });
    setGlow({ x: px * 100, y: py * 100, active: true });
  };

  const onMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlow((g) => ({ ...g, active: false }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor-hover
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 0.25s ease-out'
      }}
      className="group rounded-2xl border overflow-hidden relative"
    >
      <div
        className="rounded-2xl border overflow-hidden relative"
        style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
      >
        {glow.active && (
          <div
            className="pointer-events-none absolute inset-0 opacity-60 transition-opacity z-10"
            style={{
              background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)`
            }}
          />
        )}

        <div className="aspect-[16/10] relative overflow-hidden">
          {project.mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.mainImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, var(--bg-elev)), var(--bg-elev))' }}
            >
              <span
                className="font-mono text-[10px] border border-dashed px-3 py-1.5 rounded-full"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)', background: 'var(--bg)' }}
              >
                [ {project.title} — image placeholder ]
              </span>
            </div>
          )}
          <div
            className="absolute top-3 end-3 font-mono text-[10px] px-3 py-1.5 rounded-full backdrop-blur"
            style={{
              background: project.status === 'completed' ? 'color-mix(in srgb, var(--accent-2) 25%, var(--bg))' : 'color-mix(in srgb, var(--accent) 25%, var(--bg))',
              color: project.status === 'completed' ? 'var(--accent-2)' : 'var(--accent)'
            }}
          >
            {t(`status.${project.status}`)}
          </div>
        </div>

        <div className="p-6 relative">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-display text-lg font-semibold">{project.title}</h3>
            <span className="font-mono text-[11px]" style={{ color: 'var(--ink-dim)' }}>
              {project.date}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed mb-4 line-clamp-4" style={{ color: 'var(--ink-dim)' }}>
            {project.shortDesc}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techs.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] px-2.5 py-1 rounded-full border"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
              >
                {tech}
              </span>
            ))}
          </div>

          <ul className="mb-5 flex flex-col gap-1">
            {project.highlights.map((h) => (
              <li key={h} className="text-xs flex items-center gap-2" style={{ color: 'var(--ink-dim)' }}>
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--accent-2)' }} />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 flex-wrap">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: 'var(--ink)', color: 'var(--bg)' }}
            >
              {t('liveDemo')} ↗
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full border"
              style={{ borderColor: 'var(--line)' }}
            >
              {t('github')}
            </a>
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="text-xs font-semibold px-4 py-2 rounded-full border"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              {t('caseStudy')} →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}