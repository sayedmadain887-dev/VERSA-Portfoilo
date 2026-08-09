'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${mx}px`;
        glowRef.current.style.top = `${my}px`;
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => ringRef.current?.classList.add('cursor-hover');
    const onLeave = () => ringRef.current?.classList.remove('cursor-hover');

    window.addEventListener('mousemove', onMove);
    animate();

    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="custom-cursor">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'var(--accent)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 border transition-[width,height,background] duration-200"
        style={{ borderColor: 'var(--accent)' }}
      />
      <div
        ref={glowRef}
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 70%)'
        }}
      />
      <style jsx global>{`
        .cursor-hover {
          width: 56px !important;
          height: 56px !important;
          background: color-mix(in srgb, var(--accent) 10%, transparent);
        }
      `}</style>
    </div>
  );
}
