/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        carbon: { DEFAULT: '#0a0a0a', 100: '#111111', 200: '#161616', 300: '#1f1f1f' },
        orange: { DEFAULT: '#f97316', dim: 'rgba(249,115,22,0.15)' },
      },
    },
  },
  plugins: [],
}
