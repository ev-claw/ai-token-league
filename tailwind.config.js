/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          900: '#06091a',
          800: '#0a0f24',
          700: '#0f172a',
          600: '#141e36',
          500: '#1a2647',
          400: '#1e2d52',
        },
        border: {
          DEFAULT: '#1e2d52',
          subtle: '#131c35',
          bright: '#2a3d6e',
        },
        cursor: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dark: '#5b21b6',
          muted: 'rgba(124,58,237,0.15)',
        },
        gemini: {
          DEFAULT: '#1d7cde',
          light: '#60a5fa',
          dark: '#1558a8',
          muted: 'rgba(29,124,222,0.15)',
        },
        claude: {
          DEFAULT: '#f97316',
          light: '#fb923c',
          dark: '#c2410c',
          muted: 'rgba(249,115,22,0.15)',
        },
        openai: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
          muted: 'rgba(16,185,129,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,45,82,0.8)',
        glow: '0 0 20px rgba(124,58,237,0.15)',
      },
    },
  },
  plugins: [],
}
