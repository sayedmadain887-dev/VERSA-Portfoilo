import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export default function StatCard({
  label,
  value,
  accent,
  icon: Icon
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: LucideIcon;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="admin-glass rounded-xl p-5 relative overflow-hidden transition-shadow hover:shadow-[0_0_0_1px_rgba(124,92,252,0.25)]"
    >
      <div
        className="absolute -top-8 -end-8 w-28 h-28 rounded-full opacity-[0.15] blur-2xl"
        style={{ background: accent || '#7C5CFC' }}
      />
      <div className="relative flex items-start justify-between mb-3">
        <div className="text-xs text-[#9096a6]">{label}</div>
        {Icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${accent || '#7C5CFC'}22` }}
          >
            <Icon size={13} style={{ color: accent || '#7C5CFC' }} />
          </div>
        )}
      </div>
      <div className="font-display font-semibold text-2xl relative" style={{ color: accent || '#f4f5f7' }}>
        {value}
      </div>
    </motion.div>
  );
}
