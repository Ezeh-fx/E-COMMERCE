/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      tablet: { max: "1251px" },
      mobile: { max: "640px" },
    },    
    extend: {},
  },
  plugins: [],
}