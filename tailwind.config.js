/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta "A Predileta Modas": preto/prata elegante
        ink: {
          DEFAULT: '#0B0B0C',
          soft: '#141416',
          card: '#1B1B1E',
        },
        silver: {
          50: '#F7F7F8',
          100: '#EDEDF0',
          200: '#D9D9DE',
          300: '#C0C0C8',
          400: '#A8A8B3',
          500: '#8E8E9A',
          600: '#6E6E79',
          700: '#525259',
          800: '#38383D',
          900: '#222225',
        },
        paper: '#FBFBFA',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      backgroundImage: {
        'silver-shimmer': 'linear-gradient(110deg, #8E8E9A 20%, #F2F2F4 40%, #C0C0C8 55%, #8E8E9A 75%)',
      },
      boxShadow: {
        premium: '0 10px 40px -12px rgba(0,0,0,0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
