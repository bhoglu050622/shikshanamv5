import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'sacred' | 'outline'
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error = false, type, ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-lg border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    
    const variants = {
      default: 'border-border-primary focus:border-accent-primary focus:ring-accent-primary',
      sacred: 'border-accent-primary/30 focus:border-accent-primary focus:ring-accent-primary shadow-sm',
      outline: 'border-border-primary focus:border-accent-primary focus:ring-accent-primary bg-transparent'
    }
    
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
    
    const classes = cn(
      baseClasses,
      variants[variant],
      errorClasses,
      className
    )
    
    return (
      <input
        type={type}
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
