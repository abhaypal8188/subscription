/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        sand: "#f8f5ee",
        coral: "#ff7a59",
        mint: "#4dd4ac",
        gold: "#f5c76c"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(8, 17, 31, 0.18)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(255,122,89,0.25), transparent 35%), radial-gradient(circle at 20% 20%, rgba(77,212,172,0.18), transparent 30%)"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

