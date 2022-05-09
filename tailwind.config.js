const colors = require("tailwindcss/colors");
module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      purple: "#c609e7",
      orange: "#FF8A00",
      "orange-3": "#FFA133",
      "light-gray": "#ADADAD",
      "light-gray-2": "#F2F2F2",
      magenta: "#ED018C",
      cyan: "#01AEF0",
      "dark-gray": "#444444",
      "beige-1": "#F0E5CF",
      "beige-2": "#F7F6F2",
      "beige-3": "#EAE7E0",
      "beige-4": "#E1DDD2",
      "beige-5": "#BFBBAF",
      "green-1": "#A6CC8E",
      "green-2": "#C0CA7F",
      "green-3": "#A4CCCA",
      "blue-1": "#7F9ECA",
      "blue-2": "#63A3CD",
      "purple-1": "#D4BED8",
      "gold-1": "#EBD5AA",
      "brown-1": "#CA917F",
      "pink-1": "#EBAAC8",
    },
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        scale80: {
          "0%": { width: "0%" },
          "50%": { width: "0%" },
          "100%": { width: "80%" },
        },
        scale90: {
          "0%": { width: "0%" },
          "25%": { width: "0%" },
          "100%": { width: "90%" },
        },
        scale100: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "15px",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s linear",
        fadeOut: "fadeOut 0.3s linear",
        scale80: "scale80 1s ease-in-out",
        scale90: "scale90 1s ease-in-out",
        scale100: "scale100 1s ease-in-out",
      },
    },
  },
  plugins: [],
}
