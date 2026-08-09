'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6"
          style={{ background: 'var(--bg)' }}
        >
          <div className="font-display text-sm tracking-[6px]" style={{ color: 'var(--ink-dim)' }}>
            V E R S A
          </div>
          <div className="w-56 h-px relative overflow-hidden" style={{ background: 'var(--line)' }}>
            <div
              className="absolute inset-0 h-full transition-[width] duration-150"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-2))'
              }}
            />
          </div>
          <div className="font-mono text-xs" style={{ color: 'var(--ink-dim)' }}>
            {Math.floor(Math.min(progress, 100))}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
