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
          // Indian Modern Monolith Design Palette
          paper: '#F8FAFC',             // Cool crisp chalk base (light)
          surface: '#FFFFFF',           // Clean crisp card surface
          surfaceHighlight: '#F1F5F9',  // Slate tint hover elevation
          border: '#E2E8F0',            // Subtle slate divider
          borderDark: '#CBD5E1',        // Stronger divider contrast
          charcoal: '#0F172A',          // Deep obsidian slate text (light mode)
          text: '#F8FAFC',              // Soft off-white chalk text (dark mode)
          muted: '#64748B',             // Slate muted secondary copy
          mutedDark: '#94A3B8',         // Muted copy for dark slate background
          subtle: '#94A3B8',            // Auxiliary micro copy
          
          // Saffron Bronze Primary Accent (Replaces generic terracotta)
          bronze: '#D97706',            // Warm Saffron Bronze
          bronzeHover: '#B45309',
          bronzeLight: '#D9770614',     // Tinted background
          
          // Deep Mineral Teal Supporting Accent (Replaces generic green/sage)
          teal: '#0F766E',              // Mineral Emerald Teal
          tealLight: '#0F766E18',
          
          // Dark Mode Specific Slate Surface Values
          darkBase: '#0D1117',          // Obsidian slate base
          darkSurface: '#161B22',       // Elevated dark tile surface
          darkSurfaceHighlight: '#1F242D',

          // Warning & Status Accents
          amber: '#D97706',
          amberLight: '#D977061A',
          rose: '#BE123C',
          roseLight: '#BE123C1A'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace']
      }
    },
  },
  plugins: [],
}
