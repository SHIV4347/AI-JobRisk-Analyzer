/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        gray: {
          950: '#002a70',
          900: '#013ba0',
          850: '#0156d6',
          800: '#1a73e8',
          700: '#4285f4',
        },
        'brand-blue':   '#0156d6',
        'brand-yellow': '#ffcc33',
        'brand-teal':   '#00d2c1',
        'brand-orange': '#ff8a00',
        yellow: {
          400: '#facc15', // Icon Yellow accent
          500: '#eab308',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'spin-fast': 'spin 0.7s linear infinite',
        'score-count': 'scoreCount 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
