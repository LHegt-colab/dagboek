import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-body font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default: 'bg-amber text-noir-950 hover:bg-amber-light active:bg-amber-dark',
        destructive: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
        outline: 'border border-cream-200/15 bg-transparent text-cream-200/70 hover:bg-cream-200/5 hover:text-cream-200',
        secondary: 'bg-noir-800 text-cream-200/80 hover:bg-noir-700 hover:text-cream-200',
        ghost: 'text-cream-200/60 hover:bg-cream-200/5 hover:text-cream-200',
        link: 'text-amber underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button }
