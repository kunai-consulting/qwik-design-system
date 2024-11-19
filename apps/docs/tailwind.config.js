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
    },
    colors: {
      qwik: {
        purple: {
          50: "#f9f6fe",
          100: "#f1e9fe",
          200: "#e5d7fd",
          300: "#d1b8fa",
          400: "#ac7ef4",
          500: "#985eee",
          600: "#803edf",
          700: "#6c2cc4",
          800: "#5d29a0",
          900: "#4d2281",
          950: "#310c5f"
        },
        blue: {
          50: "#f0f9ff",
          100: "#dff3ff",
          200: "#b9e7fe",
          300: "#7ad6ff",
          400: "#34c2fc",
          500: "#19b5f6",
          600: "#0088cb",
          700: "#006da4",
          800: "#045c88",
          900: "#0a4d70",
          950: "#07304a"
        },
        neutral: {
          50: "#f4f7f7",
          100: "#e2ebeb",
          200: "#c8d9d9",
          300: "#a2bebe",
          400: "#749c9c",
          500: "#598081",
          600: "#4c6b6e",
          700: "#42595c",
          800: "#3b4c4f",
          900: "#2d383a",
          950: "#202a2c"
        }
      }
    }
  },
  plugins: []
};
