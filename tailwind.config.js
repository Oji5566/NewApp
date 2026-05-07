/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-soft": "var(--color-surface-soft)",
        "surface-muted": "var(--color-surface-muted)",
        ink: "var(--color-text)",
        "ink-muted": "var(--color-text-muted)",
        "ink-soft": "var(--color-text-soft)",
        line: "var(--color-border)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-soft": "var(--color-primary-soft)",
        danger: "var(--color-danger)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(38,36,33,0.04), 0 4px 16px rgba(38,36,33,0.04)",
      },
    },
  },
  plugins: [],
};
