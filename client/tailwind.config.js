/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary":    "var(--bg-primary)",
        "bg-card":       "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "border-dark":   "var(--border)",
        "accent-purple": "var(--accent-purple)",
        "accent-cyan":   "var(--accent-cyan)",
        "accent-yellow": "var(--accent-yellow)",
        "accent-pink":   "var(--accent-pink)",
        "text-primary":  "var(--text-primary)",
        "text-secondary":"var(--text-secondary)",
        "text-muted":    "var(--text-muted)",
        success:         "var(--success)",
        danger:          "var(--danger)",
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
          "0%":   { opacity: "1", transform: "translateY(0) rotate(0deg) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(90px) rotate(480deg) scale(0.5)" },
        },
        "bar-fill": {
          "0%": { width: "0%" },
        },
        "score-count": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ticker:           "ticker 28s linear infinite",
        "fade-up":        "fade-up 0.45s ease-out forwards",
        "confetti-fall":  "confetti-fall 0.9s ease-out forwards",
        "bar-fill":       "bar-fill 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
