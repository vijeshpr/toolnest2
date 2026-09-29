/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf8', 100: '#d3f3ee', 200: '#a8e6dd', 300: '#74d2c8', 400: '#3fb8ae',
          500: '#1f9d94', 600: '#147d78', 700: '#14635f', 800: '#154f4d', 900: '#154240',
        },
        ink: { 900: '#0b1620', 950: '#07101a' },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,22,32,.04), 0 8px 24px -12px rgba(11,22,32,.12)',
      },
    },
  },
  plugins: [],
};
