import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:     "#09090f",
        surf:   "#111119",
        surf2:  "#18182a",
        cyan:   "#00e5c8",
        violet: "#7c6cf5",
        gold:   "#f5c518",
      },
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body:    ["var(--font-body)",    "DM Sans", "sans-serif"],
      },
    }
  },
  plugins: []
};

export default config;
