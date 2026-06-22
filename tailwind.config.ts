import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FCF9F2",
          50: "#FEFDFA",
          100: "#FDFBF5",
          200: "#FCF9F2",
          300: "#F8F0E0",
          400: "#F0E4C8",
        },
        champagne: {
          DEFAULT: "#F5E6CC",
          50: "#FEFCF8",
          100: "#FDF8F0",
          200: "#F9EED9",
          300: "#F5E6CC",
          400: "#E8C482",
          500: "#D4AF37",
        },
        blush: {
          DEFAULT: "#EED5D2",
          50: "#FDF8F7",
          100: "#FAF0EE",
          200: "#EED5D2",
          300: "#E2BAB5",
          400: "#D69F98",
        },
        sage: {
          DEFAULT: "#9CAF88",
          50: "#F4F7F0",
          100: "#E2ECD4",
          200: "#C8DAB0",
          300: "#A8C48A",
          400: "#8DAF6A",
          500: "#6F944F",
          600: "#56763D",
          700: "#415A2E",
        },
        gold: {
          DEFAULT: "#C9A96E",
          50: "#FDF8F0",
          100: "#F9EED9",
          200: "#F2DCB0",
          300: "#E8C482",
          400: "#D4AF37",
          500: "#C9A96E",
          600: "#A8874F",
          700: "#8A6B3E",
        },
        warm: {
          50: "#F9F7F4",
          100: "#F0ECE6",
          200: "#E0D9CE",
          300: "#C4BAA8",
          400: "#A69A84",
          500: "#8A7C64",
          600: "#6B5F4C",
          700: "#4A4235",
          800: "#2D2A26",
          900: "#1A1815",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "soft": "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        "card": "0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.02)",
        "elevated": "0 4px 12px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
