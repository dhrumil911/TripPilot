/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--background)',
        surface: 'var(--surface)',
        charcoal: {
          DEFAULT: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
        },
        teal: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary)',
        },
        sand: {
          DEFAULT: 'var(--border)',
          light: 'var(--surface-muted)',
        },
        coral: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent)',
        },
        'warm-gray': 'var(--text-secondary)',
        'deep-forest': 'var(--primary)',
      },
      fontFamily: {
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
