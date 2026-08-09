'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import type { Project } from '@/lib/projectTypes';
import { publicApi } from '@/lib/publicApi';
import { mapBackendProject } from '@/lib/mapBackendProject';

const CATEGORY_KEYS = ['all', 'ecommerce', 'education', 'dashboard', 'business', 'portfolio', 'landing'];

export default function ProjectFilterGrid() {
  const t = useTranslations('projectsPage');
  const staticProjects = t.raw('items') as Project[];
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [active, setActive] = useState('all');

  useEffect(() => {
    publicApi.getProjects().then((res) => {
      // Only switch to dynamic data if the CMS actually has published projects -
      // otherwise keep showing the built-in content so the site never looks empty.
      if (res?.projects?.length) {
        setProjects(res.projects.map(mapBackendProject));
      }
    });
  }, []);

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="px-[5vw] pb-32">
      <div className="flex gap-2.5 flex-wrap mb-14">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            data-cursor-hover
            className="text-sm px-5 py-2.5 rounded-full border transition-colors"
            style={{
              borderColor: active === key ? 'var(--accent)' : 'var(--line)',
              background: active === key ? 'var(--accent)' : 'transparent',
              color: active === key ? '#fff' : 'var(--ink-dim)'
            }}
          >
            {t(`filters.${key}`)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
