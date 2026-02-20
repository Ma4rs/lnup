/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        card: "#1A1A2E",
        "card-hover": "#252540",
        border: "#2A2A3E",
        primary: "#6C5CE7",
        "primary-light": "#8B7CF7",
        secondary: "#00D2FF",
        accent: "#FF6B9D",
        success: "#00E676",
        warning: "#FFC107",
        danger: "#FF5252",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A0A0B8",
        "text-muted": "#6B6B80",
      },
    },
  },
  plugins: [],
};
