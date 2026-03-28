/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base dark palette
        noir: {
          950: '#0D0D0D',
          900: '#141414',
          800: '#1C1C1C',
          700: '#242424',
          600: '#2E2E2E',
          500: '#3A3A3A',
          400: '#525252',
          300: '#737373',
          200: '#A3A3A3',
          100: '#D4D4D4',
        },
        // Warm cream accents
        cream: {
          50: '#FDFAF4',
          100: '#F9F3E3',
          200: '#F5ECD7',
          300: '#EDD8B0',
          400: '#E0C080',
          500: '#D4A855',
        },
        // Signature amber accent
        amber: {
          DEFAULT: '#C97D3A',
          light: '#E09050',
          dark: '#A66228',
          muted: '#C97D3A33',
        },
        // Status colors (dark-adapted)
        success: {
          DEFAULT: '#4ADE80',
          muted: '#4ADE8022',
        },
        warning: {
          DEFAULT: '#FBBF24',
          muted: '#FBBF2422',
        },
        danger: {
          DEFAULT: '#F87171',
          muted: '#F8717122',
        },
        info: {
          DEFAULT: '#60A5FA',
          muted: '#60A5FA22',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(201, 125, 58, 0.15)',
        'glow-sm': '0 0 10px rgba(201, 125, 58, 0.1)',
        'inner-glow': 'inset 0 1px 0 rgba(245, 236, 215, 0.05)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
