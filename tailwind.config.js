/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand Colors — Deep Teal & Amber Gold Identity
        brand: {
          950: '#071f24', 900: '#0d3d45', 800: '#135c68',
          700: '#1a7b8a', 600: '#2196aa', 500: '#28b0c4',
          400: '#4dc9db', 300: '#7ddae8', 200: '#b3e9f2',
          100: '#e0f5f9', 50: '#f0fafb',
        },
        walnut: {
          950: '#1a1209', 900: '#3d2b1f', 800: '#5c3d2e',
          700: '#7a5240', 600: '#956850', 500: '#a87e65',
          400: '#b89880', 300: '#c4a78e', 200: '#d8c4b0',
          100: '#f0e8df', 50: '#faf6f2',
        },
        gold: {
          950: '#3d2e0a', 900: '#7a5c14', 800: '#a07a1e',
          700: '#c4913a', 600: '#d4a54a', 500: '#e0b85c',
          400: '#e8cb7d', 300: '#f0dda0', 200: '#f5ebc4',
          100: '#faf5e0', 50: '#fdfaf0',
        },
        cream: {
          50: '#faf8f5', 100: '#f5f0e8', 200: '#ede5d8',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
