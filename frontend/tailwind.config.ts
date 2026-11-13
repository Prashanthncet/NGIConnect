import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#102B46",
          dark: "#0a1c2e",
          light: "#174A70",
        },
        blue: {
          institutional: "#174A70",
          accent: "#2A6496",
        },
        orange: {
          DEFAULT: "#F28C28",
          hover: "#d9771a",
          light: "#fef3e7",
        },
        surface: {
          canvas: "#F7F8FA",
          card: "#FFFFFF",
          muted: "#F0F4F8",
        },
        text: {
          dark: "#202A35",
          muted: "#697586",
          light: "#9AA4B2",
        },
        border: {
          light: "#E4E8ED",
          DEFAULT: "#D1DBEA",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

