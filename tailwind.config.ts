import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dq: {
          blue: "#1a3a6b",
          gold: "#c9a227",
          cream: "#f5f0e1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
