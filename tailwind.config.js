/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        lumora: {
          blue: "#5b8cff",
          violet: "#a855f7",
          ink: "#050508",
        },
      },
      boxShadow: {
        glow: "0 0 80px rgba(91, 140, 255, 0.18)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 20%, rgba(91,140,255,.18), transparent 28%), radial-gradient(circle at 80% 0%, rgba(168,85,247,.18), transparent 24%)",
      },
    },
  },
  plugins: [],
};
