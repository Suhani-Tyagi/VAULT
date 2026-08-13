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
          // Warm Paper & Obsidian Surface Architecture
          paper: '#FAF8F5',             // Light mode warm off-white background
          surface: '#FFFFFF',           // Crisp white light container surface
          surfaceHighlight: '#F5F2EB',  // Subtle hairline hover surface
          rule: '#E7E5E4',              // Crisp 1px stone divider
          ruleDark: '#292524',          // Dark mode 1px stone divider
          ink: '#1C1917',               // Deep charcoal text
          text: '#F5F5F4',              // Off-white text for dark mode
          muted: '#78716C',             // Secondary muted text
          mutedDark: '#A8A29E',         // Dark mode secondary text
          subtle: '#A8A29E',
          
          // Primary Accent: Warm VAULT Terracotta
          reserveBlue: '#C85A32',       // Primary Terracotta Accent
          reserveBlueHover: '#B34E2A',
          reserveBlueLight: '#C85A3212',
          
          // Status Accents (Subtle Financial Indicators)
          emerald: '#15803D',           // Subtle green positive credit
          emeraldLight: '#15803D14',
          amber: '#D97706',
          amberLight: '#D977061A',
          rose: '#B91C1C',              // Subtle red debit
          roseLight: '#B91C1C1A',

          // Backward compatibility aliases
          terracotta: '#C85A32',
          bronze: '#C85A32',
          bronzeHover: '#B34E2A',
          bronzeLight: '#C85A3212',
          teal: '#15803D',
          tealLight: '#15803D14',
          border: '#E7E5E4',
          borderDark: '#292524',
          charcoal: '#1C1917',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}

