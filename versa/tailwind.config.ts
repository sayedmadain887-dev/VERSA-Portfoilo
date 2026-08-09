import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        ink: 'var(--ink)',
        'ink-dim': 'var(--ink-dim)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        line: 'var(--line)',
        card: 'var(--card)'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        blink: 'blink 1s step-end infinite',
        pulseSoft: 'pulseSoft 2s infinite'
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        blink: {
          '50%': { opacity: '0' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' }
        }
      }
    }
  },
  plugins: []
};

export default config;
