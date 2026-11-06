/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0A09',
        surface: '#14120F',
        fg: '#F2EDE4',
        muted: '#8F887D',
        accent: '#E4A36A',
        sage: '#93B09E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(60px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-40px, 30px) scale(0.95)' },
        },
        ping2: {
          '75%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        drift: 'drift 18s ease-in-out infinite',
        'drift-slow': 'drift 26s ease-in-out infinite reverse',
        ping2: 'ping2 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
