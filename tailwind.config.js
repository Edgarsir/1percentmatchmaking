/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matte-black': '#0f0f0f',
        'deep-black': '#111111',
        'gold': '#d4af37',
        'gold-hover': '#b9962e',
        'soft-grey': '#cfcfcf',
      },
    },
  },
  plugins: [],
}
