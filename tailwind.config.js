module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        'glitch-1': 'glitch1 0.7s infinite',
        'glitch-2': 'glitch2 0.7s infinite',
        'spotlight': 'spotlight 2s ease 0.75s 1 forwards',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        glitch1: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)' },
          '40%': { transform: 'translate(-3px, -3px)' },
          '60%': { transform: 'translate(3px, 3px)' },
          '80%': { transform: 'translate(3px, -3px)' },
          '100%': { transform: 'translate(0)' },
        },
        glitch2: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(3px, -3px)' },
          '40%': { transform: 'translate(3px, 3px)' },
          '60%': { transform: 'translate(-3px, -3px)' },
          '80%': { transform: 'translate(-3px, 3px)' },
          '100%': { transform: 'translate(0)' },
        },
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -40%) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};