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
    },
  },
  plugins: [],
};
