'use client';

import { motion } from 'framer-motion';

export default function DetailSection({
  eyebrow,
  children
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7 }}
      className="px-[5vw] pb-24"
    >
      <div className="font-mono text-xs tracking-[2px] mb-5" style={{ color: 'var(--accent)' }}>
        {eyebrow}
      </div>
      {children}
    </motion.section>
  );
}
