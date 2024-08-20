/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./styled-copy-paste/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      animation: {
        "blink-caret": "blink-caret 1.25s ease-out infinite"
      },
      keyframes: {
        "blink-caret": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" }
        }
      }
    }
  },
  plugins: []
};
