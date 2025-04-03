// tailwind.config.js
import typography from "npm:@tailwindcss/typography@0.5.10";
import forms from "npm:@tailwindcss/forms@0.5.7";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./routes/**/*.{tsx,ts}",
    "./islands/**/*.{tsx,ts}",
    "./components/**/*.{tsx,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "inherit",
            a: {
              color: "inherit",
              textDecoration: "none",
            },
            h1: {
              color: "inherit",
            },
            h2: {
              color: "inherit",
            },
            h3: {
              color: "inherit",
            },
            h4: {
              color: "inherit",
            },
            strong: {
              color: "inherit",
            },
            code: {
              color: "inherit",
            },
            pre: {
              color: "inherit",
            },
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.5s ease-in-out",
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 8s linear infinite",
        "text-shimmer": "text-shimmer 2.5s ease-out infinite alternate",
        "border-shimmer": "border-shimmer 2.5s ease-out infinite alternate",
        scale: "scale 0.3s ease-in-out",
        glow: "glow 2s ease-in-out infinite alternate",
        marquee: "marquee 25s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "border-shimmer": {
          "0%": { borderColor: "transparent" },
          "100%": { borderColor: "currentColor" },
        },
        scale: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(14, 165, 233, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.8)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.1) 1px, transparent 1px)",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.1) 0px, transparent 50%)",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        html: { scrollBehavior: "smooth" },
        body: {
          backgroundColor: theme("colors.gray.50"),
          color: theme("colors.gray.900"),
        },
        "body.dark": {
          backgroundColor: theme("colors.gray.900"),
          color: theme("colors.gray.100"),
        },
      });
    },
  ],
};
