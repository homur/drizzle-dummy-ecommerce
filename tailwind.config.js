/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Client-facing colors
        primary: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
        },
        secondary: {
          DEFAULT: "#6b7280",
          hover: "#4b5563",
        },
        // CMS-specific colors
        "cms-bg": "#f3f4f6",
        "cms-text-primary": "#111827",
        "cms-text-secondary": "#4b5563",
        "cms-input-text": "#1f2937",
        "cms-input-border": "#d1d5db",
        "cms-input-focus": "#4f46e5",
      },
    },
  },
  plugins: [],
};
