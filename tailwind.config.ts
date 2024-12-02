import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    screens: {
      'sm': '440px',
      'md': '700px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      zIndex: {
        '100': '100',
        '9999': '9999',
      },
      boxShadow: {
        'up-lg': '0 -4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
};

export default config;
