/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0d0d0f",
        "bg-card": "#1a1a2e",
        "bg-card-hover": "#1f1f3a",
        "border-dark": "#2d2d4e",
        "accent-purple": "#7c3aed",
        "accent-cyan": "#06b6d4",
        "accent-yellow": "#f59e0b",
        "accent-pink": "#ec4899",
        "text-primary": "#f3f4f6",
        "text-secondary": "#9ca3af",
        "text-muted": "#6b7280",
        success: "#34d399",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "confetti-fall": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) rotate(0deg) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(90px) rotate(480deg) scale(0.5)",
          },
        },
        "bar-fill": {
          "0%": { width: "0%" },
        },
        "score-count": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ticker: "ticker 28s linear infinite",
        "fade-up": "fade-up 0.45s ease-out forwards",
        "confetti-fall": "confetti-fall 0.9s ease-out forwards",
        "bar-fill": "bar-fill 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
