/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F5EF',
        charcoal: {
          DEFAULT: '#171717',
          muted: '#6B7280',
        },
        teal: {
          DEFAULT: '#173F32',
          hover: '#0F2D24',
        },
        sand: {
          DEFAULT: '#DDD7CE',
          light: '#F3EEE7',
        },
        coral: {
          DEFAULT: '#D76545',
          hover: '#B95235',
        }
      },
      fontFamily: {
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
