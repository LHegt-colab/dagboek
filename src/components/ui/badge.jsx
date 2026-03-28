import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-body font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-amber/15 text-amber border border-amber/30',
        secondary: 'bg-noir-700 text-cream-200/70 border border-cream-200/10',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        destructive: 'bg-danger/10 text-danger border border-danger/20',
        info: 'bg-info/10 text-info border border-info/20',
        outline: 'border border-cream-200/20 text-cream-200/70',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
))
Badge.displayName = 'Badge'

export { Badge }
