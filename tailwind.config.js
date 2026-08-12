/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vault: {
          paper: '#F7F3EC',             // Warm off-white paper base
          surface: '#FAF7F2',           // Clean card background
          surfaceHighlight: '#EFE9DF',  // Elevated hover background
          border: '#E5DFD5',            // Crisp warm divider
          borderDark: '#D8CFBF',        // Darker divider for contrast
          charcoal: '#1C1A17',          // Near-black warm body text
          text: '#F5F0E8',              // Dark mode safe light text
          muted: '#78726A',             // Calm secondary copy
          mutedDark: '#A5A096',         // Secondary copy for dark background
          subtle: '#A09A90',            // Subtle auxiliary text
          terracotta: '#B5563C',        // Primary committed accent (Deep Clay)
          terracottaHover: '#9E462E',
          terracottaLight: '#B5563C14', // Tinted background
          sage: '#6B8272',              // Muted secondary tag accent
          sageLight: '#6B82721A',
          amber: '#C68A2E',             // Warm warning accent
          amberLight: '#C68A2E1A',
          rose: '#9E3A3A',
          roseLight: '#9E3A3A1A'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
