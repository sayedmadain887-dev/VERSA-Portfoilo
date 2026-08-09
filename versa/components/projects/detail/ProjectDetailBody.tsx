'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Gauge, Trophy, PlayCircle } from 'lucide-react';
import type { Project } from '@/lib/projectTypes';
import DetailSection from './DetailSection';

export default function ProjectDetailBody({ project }: { project: Project }) {
  const t = useTranslations('projectsPage');
  const s = (key: string) => t(`sections.${key}`);

  return (
    <>
      {/* Overview */}
      <DetailSection eyebrow={s('overview')}>
        <p className="max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
          {project.overview}
        </p>
      </DetailSection>

      {/* Features */}
      <DetailSection eyebrow={s('features')}>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {project.features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2.5 rounded-xl border px-4 py-3.5"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--accent-2)' }} className="shrink-0" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </DetailSection>

      {/* Tech Stack */}
      <DetailSection eyebrow={s('techStack')}>
        <div className="flex flex-wrap gap-3">
          {project.techs.map((tech) => (
            <span
              key={tech}
              className="font-display text-sm font-semibold px-5 py-3 rounded-xl border"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              {tech}
            </span>
          ))}
        </div>
      </DetailSection>

      {/* Gallery */}
      <DetailSection eyebrow={s('gallery')}>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="aspect-[4/3] rounded-xl border flex items-center justify-center"
              style={{ borderColor: 'var(--line)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 15%, var(--bg-elev)), var(--bg-elev))' }}
            >
              <span
                className="font-mono text-[10px] border border-dashed px-3 py-1.5 rounded-full"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)', background: 'var(--bg)' }}
              >
                [ gallery {n} ]
              </span>
            </div>
          ))}
        </div>
      </DetailSection>

      {/* Video */}
      <DetailSection eyebrow={s('video')}>
        <div
          className="aspect-video max-w-3xl rounded-xl border flex items-center justify-center relative overflow-hidden"
          style={{ borderColor: 'var(--line)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 15%, var(--bg-elev)), var(--bg-elev))' }}
        >
          <PlayCircle size={52} style={{ color: 'var(--ink-dim)' }} />
          <span
            className="absolute bottom-4 font-mono text-[10px] border border-dashed px-3 py-1.5 rounded-full"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)', background: 'var(--bg)' }}
          >
            [ video placeholder ]
          </span>
        </div>
      </DetailSection>

      {/* Challenges */}
      <DetailSection eyebrow={s('challenges')}>
        <p className="max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
          {project.challenges}
        </p>
      </DetailSection>

      {/* Security */}
      <DetailSection eyebrow={s('security')}>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.securityList.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 rounded-xl border px-4 py-3.5"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <ShieldCheck size={16} style={{ color: 'var(--accent)' }} className="shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </DetailSection>

      {/* Performance */}
      <DetailSection eyebrow={s('performance')}>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.performanceList.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 rounded-xl border px-4 py-3.5"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <Gauge size={16} style={{ color: 'var(--accent-2)' }} className="shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </DetailSection>

      {/* Results */}
      <DetailSection eyebrow={s('results')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px border" style={{ background: 'var(--line)', borderColor: 'var(--line)' }}>
          {project.resultsList.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 text-center flex flex-col items-center gap-2"
              style={{ background: 'var(--bg)' }}
            >
              <Trophy size={18} style={{ color: 'var(--accent)' }} />
              <span className="text-xs" style={{ color: 'var(--ink-dim)' }}>
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </DetailSection>
    </>
  );
}
