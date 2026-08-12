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
          // Indian Passbook & UPI Ledger Design System
          paper: '#FAF9F6',             // Unbleached cream-white ledger paper
          surface: '#FFFFFF',           // Crisp white elevation
          surfaceHighlight: '#F3F4F6',  // Hairline highlight
          rule: '#E5E7EB',              // Passbook hairline divider
          ruleDark: '#1F2937',          // Dark mode hairline rule
          ink: '#111827',               // Deep reserve ink text
          text: '#F3F4F6',              // Chalk text for dark mode
          muted: '#6B7280',             // Secondary ledger copy
          mutedDark: '#9CA3AF',         // Dark mode muted copy
          subtle: '#9CA3AF',
          
          // Government Bond Blue & Verified Emerald Accents
          reserveBlue: '#1E3A8A',       // Institutional bond blue
          reserveBlueHover: '#1D4ED8',
          reserveBlueLight: '#1E3A8A14',
          
          emerald: '#047857',           // Verified UPI green
          emeraldLight: '#04785714',
          
          // Legacy aliases for full backward compatibility
          bronze: '#1E3A8A',
          bronzeHover: '#1D4ED8',
          bronzeLight: '#1E3A8A14',
          teal: '#047857',
          tealLight: '#04785714',
          border: '#E5E7EB',
          borderDark: '#1F2937',
          charcoal: '#111827',
          
          // Status Accents
          amber: '#D97706',
          amberLight: '#D977061A',
          rose: '#BE123C',
          roseLight: '#BE123C1A'
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
