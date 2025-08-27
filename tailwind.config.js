/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
// tailwind.config.js
theme: {
  extend: {
    colors: {
      coffee: {
        100: '#F5EBE0',
        200: '#E6D5C3',
        300: '#D4A373',
        400: '#BC8A5F',
        500: '#A47148',
        600: '#6F4E37',
        700: '#5C4033',
        800: '#4A3529',
        900: '#38261F',
      }
    }
  }
},
  plugins: [],
}
