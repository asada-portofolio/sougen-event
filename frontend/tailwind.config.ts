import type { Config } from 'tailwindcss'
import formsPlugin from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Public Theme - Sougen Brand
        'sougen-blue': '#0094DE',
        'sougen-blue-dark': '#0070AC', // High contrast WCAG 2.1 AA (4.85:1) for text & buttons on light surfaces
        'sougen-green-dark': '#004D2C',
        'sougen-green-mint': '#3ECC8B',
        'sougen-gray': '#9CA3A7',

        // Public Theme - Neutral & Surfaces
        'rpo-black': '#121212',
        'rpo-surface': '#1A1A1A',
        'rpo-mid-dark': '#242424',
        'rpo-gray': '#333333', // Border Gray
        'rpo-light-border': '#4d4d4d',
        'rpo-separator': '#2A2A2A',
        
        // Text Colors
        'rpo-white': '#ffffff',
        'rpo-silver': '#b3b3b3',
        'rpo-near-white': '#cbcbcb',
        
        // Semantics
        'rpo-negative': '#EF4444',
        'rpo-warning': '#F59E0B',
        'rpo-success': '#10B981',

        // Admin Theme
        'admin-base': '#F8F9FA',
        'admin-surface': '#FFFFFF',
        'admin-dark': '#1A1A2E',
        'admin-secondary': '#6B7280',
        'admin-border': '#E5E7EB',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        'elevated': 'rgba(0,0,0,0.4) 0px 4px 12px',
        'dialog': 'rgba(0,0,0,0.6) 0px 8px 24px',
        'admin': '0 1px 2px rgba(0,0,0,0.05)',
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" }
        }
      },
      animation: {
        "spin-slow": "spin-slow 10s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee-right": "marquee-right 15s linear infinite",
      }
    },
  },
  plugins: [
    formsPlugin,
  ],
} satisfies Config