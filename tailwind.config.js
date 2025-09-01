/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        // CSS Custom Properties for Theme System
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-accent': 'var(--bg-accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-accent': 'var(--text-accent)',
        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-tertiary': 'var(--accent-tertiary)',
        
        // Light Theme Colors (Sandalwood, Ivory, Deep Saffron, Earthy Browns)
        'light': {
          'bg-primary': '#FEF7F0', // Soft sandalwood
          'bg-secondary': '#F5F1E8', // Ivory
          'bg-tertiary': '#EDE4D3', // Warm cream
          'bg-accent': '#FFF8F0', // Light sandalwood
          'text-primary': '#2D1810', // Deep brown
          'text-secondary': '#5D4037', // Rich brown
          'text-accent': '#8B4513', // Saddle brown
          'border-primary': '#D4A574', // Sandalwood border
          'border-secondary': '#E6D3B3', // Light sandalwood
          'accent-primary': '#D97706', // Deep saffron
          'accent-secondary': '#B45309', // Darker saffron
          'accent-tertiary': '#92400E', // Rich brown
        },
        
        // Dark Theme Colors (Deep Indigo, Muted Black, Earthy Browns with Gold/Copper)
        'dark': {
          'bg-primary': '#0F1419', // Deep indigo-black
          'bg-secondary': '#1A1F2E', // Muted indigo
          'bg-tertiary': '#2A3142', // Lighter indigo
          'bg-accent': '#1E2532', // Dark indigo
          'text-primary': '#F5F5DC', // Beige white
          'text-secondary': '#D2B48C', // Tan
          'text-accent': '#CD853F', // Peru (copper)
          'border-primary': '#4A5568', // Gray border
          'border-secondary': '#2D3748', // Darker gray
          'accent-primary': '#DAA520', // Goldenrod
          'accent-secondary': '#B8860B', // Dark goldenrod
          'accent-tertiary': '#CD853F', // Peru (copper)
        },
        
        // Premium color palette with improved contrast
        gold: '#E65100',
        saffron: '#B71C1C',
        indigo: '#4F46E5',
        purple: '#7C3AED',
        emerald: '#10B981',
        rose: '#F43F5E',
        cream: '#FEF3C7',
        charcoal: '#1F2937',
        midnight: '#0F172A',
        
        // Enhanced theme colors with much better contrast
        primary: {
          light: '#B71C1C', // Much darker red-orange for excellent contrast
          dark: '#FF9770', // Lighter Orange for dark mode
        },
        secondary: {
          light: '#8D2F0A', // Darker rust for better contrast
          dark: '#B04C28', // Darker Rust Red for dark mode
        },
        accent: {
          light: '#E65100', // Darker amber for better contrast
          dark: '#FFB800', // Brighter Amber for dark mode
        },
        background: {
          light: '#FFFFFF', // White
          dark: '#1A1A1A', // Dark Gray for dark mode
        },
        'background-alt': {
          light: '#F8F9FA', // Slightly darker for better definition
          dark: '#2A2A2A', // Slightly lighter dark gray
        },
        text: {
          light: '#0D1117', // Much darker text for excellent readability
          dark: '#E0E0E0', // Light Gray for dark mode
        },
        'text-secondary': {
          light: '#21262D', // Darker secondary text for better contrast
          dark: '#A0A0A0', // Medium light Gray for dark mode
        },
        // Legacy colors for compatibility
        'saffron-400': '#B71C1C',
        'saffron-500': '#B71C1C',
        'saffron-600': '#8D2F0A',
        'saffron-900': '#8B4513',
        'indigo-400': '#4F46E5',
        'indigo-500': '#4F46E5',
        'indigo-600': '#4338CA',
        'indigo-800': '#3730A3',
        'indigo-900': '#312E81',
        'cream-50': '#FEF3C7',
        'cream-200': '#FEF3C7',
        'cream-300': '#FDE68A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sanskrit: ['var(--font-sanskrit)', 'Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'mandala-spin': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'cosmic-drift': 'cosmic-drift 20s linear infinite',
        'premium-spin': 'premium-spin 1s linear infinite',
        'premium-fade-in': 'premium-fade-in 1.5s ease-out forwards',
        'premium-slide-up': 'premium-slide-up 1.2s ease-out forwards',
        'premium-scale': 'premium-scale 0.8s ease-out forwards',
        'chakra-spin': 'chakra-spin 4s linear infinite',
        'quest-flow': 'quest-flow 3s ease-in-out infinite',
        'theme-transition': 'theme-transition 0.3s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'cosmic-drift': {
          '0%': { transform: 'translateX(0px)' },
          '100%': { transform: 'translateX(-200px)' },
        },
        'premium-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'premium-fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px) scale(0.95)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'premium-slide-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(50px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'premium-scale': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.8)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'chakra-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'quest-flow': {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'translateY(-50%) scaleX(0.8)',
          },
          '50%': { 
            opacity: '1',
            transform: 'translateY(-50%) scaleX(1.2)',
          },
        },
        'theme-transition': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mandala-pattern': "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='mandala' x='0' y='0' width='120' height='120' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='60' cy='60' r='2' fill='%23B71C1C' fill-opacity='0.12'/%3E%3Ccircle cx='60' cy='60' r='8' fill='none' stroke='%23B71C1C' stroke-opacity='0.08' stroke-width='1'/%3E%3Ccircle cx='60' cy='60' r='16' fill='none' stroke='%238D2F0A' stroke-opacity='0.06' stroke-width='1'/%3E%3Ccircle cx='60' cy='60' r='24' fill='none' stroke='%23E65100' stroke-opacity='0.04' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23mandala)'/%3E%3C/svg%3E\")",
        'lotus-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='lotus' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M50 20 Q60 30 70 40 Q80 50 70 60 Q60 70 50 80 Q40 70 30 60 Q20 50 30 40 Q40 30 50 20' fill='none' stroke='%23DAA520' stroke-opacity='0.1' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23lotus)'/%3E%3C/svg%3E\")",
        'manuscript-pattern': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='manuscript' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Crect x='10' y='10' width='60' height='60' fill='none' stroke='%23CD853F' stroke-opacity='0.08' stroke-width='0.5'/%3E%3Cline x1='20' y1='20' x2='60' y2='20' stroke='%23CD853F' stroke-opacity='0.06' stroke-width='0.5'/%3E%3Cline x1='20' y1='30' x2='60' y2='30' stroke='%23CD853F' stroke-opacity='0.06' stroke-width='0.5'/%3E%3Cline x1='20' y1='40' x2='60' y2='40' stroke='%23CD853F' stroke-opacity='0.06' stroke-width='0.5'/%3E%3Cline x1='20' y1='50' x2='60' y2='50' stroke='%23CD853F' stroke-opacity='0.06' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23manuscript)'/%3E%3C/svg%3E\")",
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'premium': '0 20px 40px rgba(183, 28, 28, 0.3)',
        'premium-glow': '0 0 30px rgba(183, 28, 28, 0.4)',
        'premium-saffron': '0 0 30px rgba(183, 28, 28, 0.4)',
        'theme-light': '0 4px 20px rgba(217, 119, 6, 0.15)',
        'theme-dark': '0 4px 20px rgba(218, 165, 32, 0.2)',
      },
      textShadow: {
        'premium': '0 0 20px rgba(183, 28, 28, 0.8)',
        'premium-saffron': '0 0 20px rgba(183, 28, 28, 0.8)',
        'theme-light': '0 2px 4px rgba(217, 119, 6, 0.3)',
        'theme-dark': '0 2px 4px rgba(218, 165, 32, 0.4)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-gradient-gold': {
          background: 'linear-gradient(135deg, #E65100, #B71C1C)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-cosmic': {
          background: 'linear-gradient(135deg, #E65100, #B71C1C, #4F46E5, #7C3AED)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-theme': {
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glow-gold': {
          'text-shadow': '0 0 20px rgba(230, 81, 0, 0.8)',
        },
        '.glow-saffron': {
          'text-shadow': '0 0 20px rgba(183, 28, 28, 0.8)',
        },
        '.glow-theme': {
          'text-shadow': '0 0 20px var(--accent-primary)',
        },
        '.glow-border-gold': {
          'box-shadow': '0 0 30px rgba(230, 81, 0, 0.4)',
        },
        '.glow-border-saffron': {
          'box-shadow': '0 0 30px rgba(183, 28, 28, 0.4)',
        },
        '.glow-border-theme': {
          'box-shadow': '0 0 30px var(--accent-primary)',
        },
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.15)',
          'backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(183, 28, 28, 0.2)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.15)',
        },
        '.glass-effect-theme': {
          background: 'var(--bg-accent)',
          'backdrop-filter': 'blur(20px)',
          border: '1px solid var(--border-primary)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.15)',
        },
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.theme-transition': {
          'transition': 'all 0.3s ease-in-out',
        },
        '.theme-bg-pattern': {
          'background-image': 'var(--bg-pattern)',
          'background-size': '200px 200px',
          'background-repeat': 'repeat',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
