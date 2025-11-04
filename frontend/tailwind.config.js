// tailwind.config.js
// Tailwind CSS configuration

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        aztec: {
          50: "#f1f6fd",
          100: "#dfeafa",
          200: "#c6dbf7",
          300: "#9bc1f0",
          400: "#72a4e8",
          500: "#5183e0",
          600: "#3c68d4",
          700: "#3354c2",
          800: "#2f469e",
          900: "#2b3e7d",
          950: "#1e284d",
        },
        myYellow: {
          50: "#FFD66B",
          100: "#FFC327",
        },
        myBlue: {
          50: "#5B93FF",
          100: "#605BFF",
        },
        myOrange: "#FF8F6B",
      },
    },
  },
  plugins: [],
};
