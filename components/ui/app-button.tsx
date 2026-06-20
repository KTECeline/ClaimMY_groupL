'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const appButton = cva(
  'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-pine text-pine-foreground hover:bg-pine/90 shadow-[0_6px_20px_-8px_rgba(12,107,82,0.7)]',
        gold: 'bg-gold text-gold-foreground hover:bg-gold/90 shadow-[0_6px_20px_-8px_rgba(201,138,31,0.7)]',
        outline: 'border-2 border-pine/25 text-pine bg-transparent hover:bg-pine/5',
        soft: 'bg-pine-soft text-pine hover:bg-pine-soft/70',
        ghost: 'text-foreground hover:bg-foreground/5',
        danger: 'bg-clay text-pine-foreground hover:bg-clay/90',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-xl',
        md: 'h-12 px-5 text-[0.95rem] rounded-2xl',
        lg: 'h-14 px-6 text-base rounded-2xl',
        icon: 'size-11 rounded-2xl',
        block: 'h-14 w-full px-6 text-base rounded-2xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof appButton> {}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(appButton({ variant, size, className }))} {...props} />
  ),
)
AppButton.displayName = 'AppButton'
