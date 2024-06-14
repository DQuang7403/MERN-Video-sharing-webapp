/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
          border: "rgb(var(--color-primary-border) / <alpha-value>)",
          text: "rgb(var(--color-primary-text) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
          "dark-hover": "rgb(var(--color-primary-dark-hover) / <alpha-value>)",
          red: "rgb(var(--color-primary-red) / <alpha-value>)",
          "red-hover": "rgb(var(--color-primary-red-hover) / <alpha-value>)",
          blue: "rgb(var(--color-primary-blue) / <alpha-value>)",
          "blue-hover": "rgb(var(--color-primary-blue-hover) / <alpha-value>)",
          bg: "rgb(var(--color-bg) / <alpha-value>)",
        },
        secondary: {
          text: "rgb(var(--color-secondary-text) / <alpha-value>)",
          "text-hover":
          "rgb(var(--color-secondary-text-hover) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
