'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/publicApi';

function useTypingLoop(words: string[]) {
  const [text, setText] = useState('');
  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        setText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          deleting = true;
          timeout = setTimeout(tick, 1400);
          return;
        }
        timeout = setTimeout(tick, 55);
      } else {
        charIndex--;
        setText(current.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeout = setTimeout(tick, 300);
          return;
        }
        timeout = setTimeout(tick, 30);
      }
    };
    timeout = setTimeout(tick, 55);
    return () => clearTimeout(timeout);
  }, [words]);
  return text;
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7C5CFC';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.35;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" />;
}

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const duration = 1800;
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setVal(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="font-display text-4xl font-bold">
      {val}
    </div>
  );
}

export default function Hero() {
  const t = useTranslations('hero');
  const words = t.raw('typing') as string[];
  const typed = useTypingLoop(words);
  const [statTargets, setStatTargets] = useState({ projects: 47, satisfaction: 99, years: 6 });
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    publicApi.getHome().then((res) => {
      if (res?.home?.hero && (res.home.hero.headline || res.home.hero.description)) {
        setHomeData(res.home);
      }
    });
  }, []);

  useEffect(() => {
    publicApi.getAbout().then((res) => {
      const stats = res?.about?.stats;
      if (stats) {
        setStatTargets((prev) => ({
          projects: stats.projectsCompleted ?? prev.projects,
          satisfaction: prev.satisfaction, // not modeled on the backend yet - stays static
          years: stats.yearsExperience ?? prev.years
        }));
      }
    });
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center relative overflow-hidden px-[5vw]">
      <ParticleField />
      <div className="relative z-[2] pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
          className="font-mono text-[13px] tracking-[2px] flex items-center gap-2.5 mb-7"
          style={{ color: 'var(--accent-2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulseSoft" style={{ background: 'var(--accent-2)' }} />
          {t('eyebrow')}
        </motion.div>

        {homeData?.hero?.headline ? (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold leading-[0.95] tracking-tighter mb-7 text-[clamp(32px,6vw,84px)]"
          >
            {homeData.hero.headline}
          </motion.h1>
        ) : (
          <h1 className="font-display font-bold leading-[0.95] tracking-tighter mb-7 text-[clamp(32px,6vw,84px)]">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {t('titleLine1')}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-gradient"
              >
                {t('titleLine2Accent')}
              </motion.span>{' '}
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {t('titleLine2Rest')}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {t('titleLine3')}
              </motion.span>
            </span>
          </h1>
        )}

        <div className="font-mono text-base mb-11" style={{ color: 'var(--ink-dim)' }}>
          {typed}
          <span className="inline-block w-0.5 h-4 ml-1 align-middle animate-blink" style={{ background: 'var(--accent)' }} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="max-w-xl text-lg leading-relaxed mb-11"
          style={{ color: 'var(--ink-dim)' }}
        >
          {homeData?.hero?.description || t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.9 }}
          className="flex gap-4 flex-wrap items-center mb-24"
        >
          <a
            href={homeData?.hero?.primaryButtonLink || '#projects'}
            data-cursor-hover
            className="font-semibold text-sm px-8 py-4 rounded-full inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--ink)', color: 'var(--bg)' }}
          >
            {homeData?.hero?.primaryButtonText || t('ctaPrimary')} →
          </a>
          <a
            href={homeData?.hero?.secondaryButtonLink || '#footer'}
            data-cursor-hover
            className="font-semibold text-sm px-8 py-4 rounded-full border inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            {homeData?.hero?.secondaryButtonText || t('ctaSecondary')}
          </a>
        </motion.div>

        <div className="flex gap-14 pt-9 border-t" style={{ borderColor: 'var(--line)' }}>
          <div>
            <Counter target={statTargets.projects} />
            <div className="text-xs mt-1" style={{ color: 'var(--ink-dim)' }}>
              {t('stats.projects')}
            </div>
          </div>
          <div>
            <Counter target={statTargets.satisfaction} />
            <div className="text-xs mt-1" style={{ color: 'var(--ink-dim)' }}>
              {t('stats.satisfaction')}
            </div>
          </div>
          <div>
            <Counter target={statTargets.years} />
            <div className="text-xs mt-1" style={{ color: 'var(--ink-dim)' }}>
              {t('stats.years')}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-9 start-[5vw] flex items-center gap-2.5 font-mono text-[11px] tracking-wide" style={{ color: 'var(--ink-dim)' }}>
        <div className="w-px h-10 relative overflow-hidden" style={{ background: 'var(--line)' }} />
        {t('scroll')}
      </div>
    </section>
  );
}
