import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-default)', 'sans-serif'],
        recruiter: ['var(--font-recruiter)', 'sans-serif'],
        adventurer: ['var(--font-adventurer)', 'cursive'],
        stalker: ['var(--font-stalker)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;