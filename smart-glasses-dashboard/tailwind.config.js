/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0d1117',
          50:  '#f8fafc',
          100: '#1a2235',
          200: '#141c2e',
          300: '#0f1623',
          400: '#0d1117',
        },
        accent: {
          purple: '#a78bfa',
          blue:   '#60a5fa',
          cyan:   '#22d3ee',
          green:  '#34d399',
          orange: '#fb923c',
          red:    '#f87171',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          hover:   'rgba(255,255,255,0.14)',
          accent:  'rgba(167,139,250,0.35)',
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%)',
        'gradient-card':   'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(96,165,250,0.04) 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(167,139,250,0.15)',
        'glow-blue':   '0 0 30px rgba(96,165,250,0.15)',
        'glow-green':  '0 0 30px rgba(52,211,153,0.15)',
        'glow-red':    '0 0 30px rgba(248,113,113,0.15)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':  '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out',
        'slide-up':    'slideUp 0.5s ease-out',
        'pulse-glow':  'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(167,139,250,0.4)' },
          '50%':      { boxShadow: '0 0 20px rgba(167,139,250,0.8), 0 0 40px rgba(96,165,250,0.3)' },
        },
      },
    },
  },
  plugins: [],
}
