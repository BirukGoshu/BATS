/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0f8',
          100: '#c5d9f0',
          200: '#9fc0e8',
          300: '#79a7e0',
          400: '#5c94da',
          500: '#3f81d4', // Main denim blue
          600: '#3872c9',
          700: '#3062be',
          800: '#2852b3',
          900: '#1a38a1',
        },
        denim: {
          50: '#e8ecf0',
          100: '#c5d0db',
          200: '#9eb1c4',
          300: '#7792ad',
          400: '#597a9b',
          500: '#3b6289', // Classic denim
          600: '#355a81',
          700: '#2d5076',
          800: '#25466c',
          900: '#183456',
        },
        indigo: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
        fashion: {
          gold: '#d4af37',
          rose: '#e8b4b8',
          navy: '#1e3a5f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}


