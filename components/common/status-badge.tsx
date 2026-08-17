import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.04em] whitespace-nowrap',
  {
    variants: {
      tone: {
        claimable: 'bg-gold-soft text-accent-foreground',
        progress: 'bg-pine-soft text-pine',
        done: 'bg-pine text-pine-foreground',
        rejected: 'bg-clay-soft text-clay',
        neutral: 'bg-secondary text-muted-foreground',
        outline: 'border border-border text-muted-foreground',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export function StatusBadge({
  children,
  tone,
  className,
  dot = false,
}: {
  children: React.ReactNode
  className?: string
  /** Small leading dot — used in lists where the badge sits next to a title. */
  dot?: boolean
} & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ tone }), className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
