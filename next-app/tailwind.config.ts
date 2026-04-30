import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f4c81",
        accent: "#f2b736",
        surface: "#f8fafc"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 76, 129, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
