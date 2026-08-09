'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { iconMap } from './iconMap';
import { publicApi } from '@/lib/publicApi';

type SkillItem = { name: string; level: number; desc?: string };
type Category = { name: string; icon: string; items: SkillItem[] };

function groupBackendSkills(skills: any[]): Category[] {
  const groups = new Map<string, Category>();
  skills.forEach((s) => {
    if (!groups.has(s.category)) {
      groups.set(s.category, { name: s.category, icon: s.icon || 'layout', items: [] });
    }
    groups.get(s.category)!.items.push({ name: s.name, level: s.level ?? 80 });
  });
  return Array.from(groups.values());
}

export default function SkillCategories() {
  const t = useTranslations('skillsPage');
  const staticCategories = t.raw('categories') as Category[];
  const [categories, setCategories] = useState<Category[]>(staticCategories);

  useEffect(() => {
    publicApi.getSkills().then((res) => {
      if (res?.skills?.length) {
        setCategories(groupBackendSkills(res.skills));
      }
    });
  }, []);

  return (
    <section className="px-[5vw] pb-28">
      <div className="grid md:grid-cols-2 gap-5">
        {categories.map((cat, ci) => {
          const Icon = iconMap[cat.icon] ?? iconMap.layout;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (ci % 2) * 0.08 }}
              data-cursor-hover
              className="group rounded-2xl border p-7 relative overflow-hidden transition-colors"
              style={{ borderColor: 'var(--line)', background: 'var(--card)' }}
            >
              <div
                className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500"
                style={{ background: 'var(--accent)' }}
              />
              <div className="flex items-center gap-3 mb-6 relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
              </div>

              <div className="flex flex-col gap-5 relative">
                {cat.items.map((item, ii) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="font-mono text-[11px]" style={{ color: 'var(--ink-dim)' }}>
                        {item.level}%
                      </span>
                    </div>
                    {item.desc && (
                      <p className="text-xs mb-2" style={{ color: 'var(--ink-dim)' }}>
                        {item.desc}
                      </p>
                    )}
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 + ii * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          transformOrigin: 'left',
                          width: `${item.level}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--accent), var(--accent-2))'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
