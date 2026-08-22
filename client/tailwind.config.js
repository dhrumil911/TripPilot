/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        charcoal: {
          DEFAULT: '#1C1C1C',
          muted: '#5A5A5A',
        },
        teal: {
          DEFAULT: '#1B3B2B',
          hover: '#132A1E',
        },
        sand: {
          DEFAULT: '#EAE3DA',
          light: '#F4EFEB',
        },
        coral: {
          DEFAULT: '#D46241',
          hover: '#C25333',
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
