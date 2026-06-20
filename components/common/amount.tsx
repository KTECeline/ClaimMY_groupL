import { formatRM } from '@/lib/utils'
import { cn } from '@/lib/utils'

/** Signature money treatment: mono tabular figures with a small RM tag. */
export function Amount({
  value,
  size = 'md',
  className,
  tone = 'ink',
}: {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  tone?: 'ink' | 'pine' | 'gold' | 'paper'
}) {
  const sizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  }[size]
  const tones = {
    ink: 'text-foreground',
    pine: 'text-pine',
    gold: 'text-gold',
    paper: 'text-pine-foreground',
  }[tone]
  const tagSizes = {
    sm: 'text-[0.6rem]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }[size]

  return (
    <span className={cn('inline-flex items-baseline gap-1.5 font-display font-extrabold tracking-tight tabular', tones, sizes, className)}>
      <span className={cn('font-sans font-bold opacity-60', tagSizes)}>RM</span>
      {formatRM(value, false)}
    </span>
  )
}
