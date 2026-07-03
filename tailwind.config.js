/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand + semantic tokens. Kept centralized so the whole app
        // can be re-themed from one place.
        ink: {
          DEFAULT: '#0f172a', // slate-900 — primary text
          soft: '#334155', // slate-700 — secondary text
          faint: '#64748b', // slate-500 — muted text
        },
        surface: {
          DEFAULT: '#ffffff',
          sunken: '#f8fafc', // slate-50 — app background
          raised: '#ffffff',
        },
        brand: {
          DEFAULT: '#e2492e', // Databricks-ish warm red/orange
          soft: '#fce8e4',
          strong: '#b83a24',
        },
        accent: {
          DEFAULT: '#2563eb', // blue — links / info
          soft: '#dbeafe',
        },
        good: { DEFAULT: '#16a34a', soft: '#dcfce7' },
        warn: { DEFAULT: '#d97706', soft: '#fef3c7' },
        bad: { DEFAULT: '#dc2626', soft: '#fee2e2' },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        card: '44rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out both',
        'pop-in': 'pop-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
