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
          // Clean Editorial Ledger Palette
          paper: '#FAF9F6',             // Light neutral ledger background
          surface: '#FFFFFF',           // Crisp white container surface
          surfaceHighlight: '#F3F4F6',  // Subtle hairline hover surface
          rule: '#E5E7EB',              // Crisp 1px divider
          ruleDark: '#1F2937',          // Dark mode 1px divider
          ink: '#111827',               // Deep charcoal text
          text: '#F3F4F6',              // Off-white text for dark mode
          muted: '#6B7280',             // Secondary text
          mutedDark: '#9CA3AF',         // Dark mode secondary copy
          subtle: '#9CA3AF',
          
          // Primary Accent: Deep Institutional Navy Blue
          reserveBlue: '#1E3A8A',       
          reserveBlueHover: '#1D4ED8',
          reserveBlueLight: '#1E3A8A14',
          
          // Status Accents
          emerald: '#047857',           
          emeraldLight: '#04785714',
          amber: '#D97706',
          amberLight: '#D977061A',
          rose: '#BE123C',
          roseLight: '#BE123C1A',

          // Backward compatibility aliases
          bronze: '#1E3A8A',
          bronzeHover: '#1D4ED8',
          bronzeLight: '#1E3A8A14',
          teal: '#047857',
          tealLight: '#04785714',
          border: '#E5E7EB',
          borderDark: '#1F2937',
          charcoal: '#111827',
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
