const TECHS = ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'GSAP'];

export default function Marquee() {
  const content = (
    <span className="font-display text-2xl opacity-50 flex items-center gap-16" style={{ color: 'var(--ink-dim)' }}>
      {TECHS.map((t) => (
        <span key={t}>
          <b className="opacity-100 font-semibold" style={{ color: 'var(--ink)' }}>
            {t}
          </b>{' '}
          ·
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="border-t border-b py-6 overflow-hidden whitespace-nowrap my-32"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
}
