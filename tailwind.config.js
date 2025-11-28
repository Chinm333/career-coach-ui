/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Work Sans',
          'system-ui',
          'sans-serif'
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5',    // indigo-600
          light: '#818cf8',   // indigo-400
          accent: '#a78bfa',  // purple-400
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
