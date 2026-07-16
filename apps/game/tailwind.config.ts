import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: 'var(--color-void)',
        charcoal: 'var(--color-charcoal)',
        graphite: 'var(--color-graphite)',
        accent: 'var(--color-accent)',
        'accent-strong': 'var(--color-accent-strong)',
        ink: 'var(--color-ink)',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
