/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        navy: {
          DEFAULT: '#0B192C',
          command: '#123524',
          accent: '#4E7D2E',
        },
        ink: {
          DEFAULT: '#081712',
          800: '#0C2019',
        },
        forest: {
          DEFAULT: '#0E2A1C',
          deep: '#0A1F14',
          800: '#123524',
        },
        brand: {
          DEFAULT: '#7CB342',
          dark: '#5B9130',
          light: '#A5D66F',
          foreground: '#081712',
        },
        safe: { DEFAULT: '#10B981', text: '#047857', bg: '#ECFDF5', border: '#A7F3D0' },
        caution: { DEFAULT: '#F59E0B', text: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
        hazard: { DEFAULT: '#EF4444', text: '#B91C1C', bg: '#FEF2F2', border: '#FECACA' },
        highrisk: { DEFAULT: '#F97316', text: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
        ai: { DEFAULT: '#06B6D4', text: '#0E7490', bg: '#ECFEFF', border: '#A5F3FC' },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
