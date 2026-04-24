/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9F7F2",
        primary: "#000000",
        terracotta: "#8E392B",
        mustard: "#D18D3D",
      },
      fontFamily: {
        sans: ['Inter', 'Gilroy', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
