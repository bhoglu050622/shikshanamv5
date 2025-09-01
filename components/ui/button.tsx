import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'sacred' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading = false, asChild = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      default: 'bg-accent-primary text-bg-primary hover:bg-accent-secondary focus:ring-accent-primary shadow-theme-light dark:shadow-theme-dark',
      sacred: 'bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-primary hover:from-accent-secondary hover:to-accent-tertiary focus:ring-accent-primary shadow-lg hover:shadow-xl glow-border-theme',
      outline: 'border border-border-primary text-text-primary hover:bg-bg-tertiary hover:border-accent-primary focus:ring-accent-primary',
      ghost: 'text-text-primary hover:bg-bg-tertiary hover:text-accent-primary focus:ring-accent-primary',
      link: 'text-accent-primary hover:text-accent-secondary underline-offset-4 hover:underline focus:ring-accent-primary'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    }
    
    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    )
    
    // If asChild is true, we need to handle this differently
    if (asChild) {
      // For asChild, we expect children to be a single element that we'll clone
      const child = children as React.ReactElement
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        ref,
        ...props
      })
    }
    
    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={{ scale: variant === 'sacred' ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {isLoading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
