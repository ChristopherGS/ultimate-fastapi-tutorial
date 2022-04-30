module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
          'fade-in-down': {
              '0%': {
                  opacity: '0',
              },
              '100%': {
                  opacity: '1',
              },
          }
      },
      animation: {
          'fade-in-down': 'fade-in-down 0.5s ease-out'
      }
    },
  },
  plugins: [],
}