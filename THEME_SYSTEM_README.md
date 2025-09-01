# Shikshanam Theme System

A comprehensive, culturally relevant theme system for the Shikshanam platform that provides consistent light and dark themes across all pages and components.

## 🌟 Features

### Cultural Design Philosophy
- **Light Theme**: Soft sandalwood, ivory, deep saffron, and earthy browns
- **Dark Theme**: Deep indigo, muted black, earthy browns with gold/copper accents
- **Indian/Sanskrit Elements**: Mandalas, lotus motifs, manuscript patterns
- **Accessibility**: WCAG compliant contrast ratios and keyboard navigation

### Technical Implementation
- CSS Custom Properties for consistent theming
- Tailwind CSS integration with custom color tokens
- Next.js 13+ App Router compatibility
- localStorage persistence for theme preferences
- Smooth transitions and animations

## 🎨 Color Palette

### Light Theme Colors
```css
--bg-primary: #FEF7F0;      /* Soft sandalwood */
--bg-secondary: #F5F1E8;    /* Ivory */
--bg-tertiary: #EDE4D3;     /* Warm cream */
--bg-accent: #FFF8F0;       /* Light sandalwood */
--text-primary: #2D1810;    /* Deep brown */
--text-secondary: #5D4037;  /* Rich brown */
--text-accent: #8B4513;     /* Saddle brown */
--border-primary: #D4A574;  /* Sandalwood border */
--border-secondary: #E6D3B3; /* Light sandalwood */
--accent-primary: #D97706;  /* Deep saffron */
--accent-secondary: #B45309; /* Darker saffron */
--accent-tertiary: #92400E; /* Rich brown */
```

### Dark Theme Colors
```css
--bg-primary: #0F1419;      /* Deep indigo-black */
--bg-secondary: #1A1F2E;    /* Muted indigo */
--bg-tertiary: #2A3142;     /* Lighter indigo */
--bg-accent: #1E2532;       /* Dark indigo */
--text-primary: #F5F5DC;    /* Beige white */
--text-secondary: #D2B48C;  /* Tan */
--text-accent: #CD853F;     /* Peru (copper) */
--border-primary: #4A5568;  /* Gray border */
--border-secondary: #2D3748; /* Darker gray */
--accent-primary: #DAA520;  /* Goldenrod */
--accent-secondary: #B8860B; /* Dark goldenrod */
--accent-tertiary: #CD853F; /* Peru (copper) */
```

## 🧩 Components

### ThemeSwitcher
A beautiful, accessible theme toggle component with cultural icons.

```tsx
import ThemeSwitcher from '@/components/ThemeSwitcher'

<ThemeSwitcher />
```

### Button Component
Theme-aware button with multiple variants and cultural styling.

```tsx
import { Button } from '@/components/ui/button'

<Button variant="sacred" size="lg">
  Sacred Button
</Button>
```

**Variants:**
- `default` - Standard button with theme colors
- `sacred` - Gradient button with glow effects
- `outline` - Bordered button
- `ghost` - Transparent button
- `link` - Link-style button

### Card Component
Flexible card component with theme-aware styling.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card variant="sacred" interactive>
  <CardHeader>
    <CardTitle>Sacred Card</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Variants:**
- `default` - Standard card
- `sacred` - Special styling with glow effects
- `elevated` - Higher shadow and hover effects

### Input Component
Form inputs that adapt to the current theme.

```tsx
import { Input } from '@/components/ui/input'

<Input variant="sacred" placeholder="Enter text..." />
```

## 🎯 Usage

### Basic Theme Classes
```css
/* Background colors */
.bg-bg-primary
.bg-bg-secondary
.bg-bg-tertiary
.bg-bg-accent

/* Text colors */
.text-text-primary
.text-text-secondary
.text-text-accent

/* Border colors */
.border-border-primary
.border-border-secondary

/* Accent colors */
.bg-accent-primary
.bg-accent-secondary
.bg-accent-tertiary
```

### Utility Classes
```css
/* Theme transitions */
.theme-transition

/* Cultural patterns */
.theme-bg-pattern
.indian-gradient
.sacred-pattern

/* Glow effects */
.glow-theme
.glow-border-theme

/* Text gradients */
.text-gradient-theme
```

### CSS Custom Properties
```css
/* Direct CSS variable usage */
background-color: var(--bg-primary);
color: var(--text-primary);
border-color: var(--border-primary);
```

## 🚀 Implementation

### 1. Theme Provider Setup
The theme system is already integrated into the app layout:

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="theme-bg-pattern">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Adding Theme Toggle
The ThemeSwitcher is already included in the Navigation component.

### 3. Using Theme-Aware Components
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function MyPage() {
  return (
    <div className="bg-bg-primary min-h-screen">
      <Card variant="sacred">
        <CardHeader>
          <CardTitle>My Content</CardTitle>
        </CardHeader>
        <Input placeholder="Enter data..." />
        <Button variant="sacred">Submit</Button>
      </Card>
    </div>
  )
}
```

## 🎨 Customization

### Adding New Theme Colors
1. Update CSS custom properties in `app/globals.css`
2. Add corresponding Tailwind classes in `tailwind.config.js`
3. Update component variants as needed

### Creating New Components
Follow the pattern established in existing components:

```tsx
import { cn } from '@/lib/utils'

const MyComponent = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-bg-secondary text-text-primary',
    sacred: 'bg-accent-primary text-bg-primary',
  }
  
  return (
    <div className={cn(variants[variant], className)} {...props}>
      {/* Component content */}
    </div>
  )
}
```

## 🔧 Configuration

### Tailwind Config
The theme system extends Tailwind with custom colors and utilities:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'text-primary': 'var(--text-primary)',
        // ... more color tokens
      }
    }
  }
}
```

### CSS Variables
All theme colors are defined as CSS custom properties for easy customization:

```css
/* app/globals.css */
:root {
  --bg-primary: #FEF7F0;
  --text-primary: #2D1810;
  /* ... light theme colors */
}

.dark {
  --bg-primary: #0F1419;
  --text-primary: #F5F5DC;
  /* ... dark theme colors */
}
```

## ♿ Accessibility

### WCAG Compliance
- All color combinations meet WCAG AA contrast requirements
- High contrast mode support
- Reduced motion preferences respected

### Keyboard Navigation
- Theme toggle accessible via keyboard
- Focus indicators on all interactive elements
- Screen reader friendly labels and descriptions

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🧪 Testing

### Theme Demo Page
Visit `/theme-demo` to see all components and color variations in both themes.

### Manual Testing
1. Toggle between light and dark themes
2. Verify all components adapt correctly
3. Test keyboard navigation
4. Check contrast ratios
5. Verify localStorage persistence

## 📱 Responsive Design

The theme system works seamlessly across all screen sizes:

```css
/* Mobile optimizations */
@media (max-width: 768px) {
  .sanskrit-heading {
    font-size: 2rem;
    letter-spacing: 0.05em;
  }
}
```

## 🔄 Migration Guide

### From Old Theme System
1. Replace hardcoded colors with theme variables
2. Update component classes to use new theme tokens
3. Test all pages in both light and dark modes
4. Verify accessibility compliance

### Example Migration
```tsx
// Old
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// New
<div className="bg-bg-primary text-text-primary">
```

## 🎯 Best Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Test in both themes** during development
3. **Maintain accessibility** with proper contrast ratios
4. **Use semantic color names** (bg-primary vs bg-white)
5. **Leverage existing components** before creating new ones
6. **Follow the cultural design** philosophy

## 🐛 Troubleshooting

### Common Issues

**Theme not persisting:**
- Check localStorage implementation
- Verify ThemeProvider setup

**Colors not updating:**
- Ensure CSS variables are properly defined
- Check Tailwind class usage

**Accessibility issues:**
- Verify contrast ratios
- Test keyboard navigation
- Check screen reader compatibility

### Debug Mode
Add this to see current theme values:

```tsx
const debugTheme = () => {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)
  console.log('Current theme colors:', {
    bgPrimary: computedStyle.getPropertyValue('--bg-primary'),
    textPrimary: computedStyle.getPropertyValue('--text-primary'),
  })
}
```

## 📚 Resources

- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Next.js App Router](https://nextjs.org/docs/app)

---

This theme system provides a solid foundation for consistent, culturally relevant design across the entire Shikshanam platform while maintaining excellent accessibility and user experience.
