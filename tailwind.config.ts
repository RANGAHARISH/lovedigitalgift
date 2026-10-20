import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D7263D",
          dark: "#A4122A",
          soft: "#FFD9E0",
          50: "#FFF6F7",
          100: "#FFD9E0",
        },
        rosebg: "#FFF6F7",
        ink: "#2B1A20",
        muted: "#6E5A60",
        gold: "#FF8FA3",
        lavender: "#FFA6B5",
        strawberry: "#FFB7C5",
        crimson: "#D7263D",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(215, 38, 61, 0.18)",
        softer: "0 6px 24px rgba(43, 26, 32, 0.08)",
        glow: "0 12px 32px rgba(215, 38, 61, 0.35)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(4deg)" },
        },
        floatySlow: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-26px) rotate(5deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        pulseSoft: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(215,38,61,0.35)" },
          "50%": { boxShadow: "0 0 0 14px rgba(215,38,61,0)" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        "floaty-slow": "floatySlow 11s ease-in-out infinite",
        bob: "bob 2.4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "pulse-soft": "pulseSoft 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
