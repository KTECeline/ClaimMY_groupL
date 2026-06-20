import { cn } from '@/lib/utils'

/** ClaimMY mark — a coin with a subtle upward "found" tick. Geometric, not decorative. */
export function BrandMark({
  className,
  tone = 'pine',
}: {
  className?: string
  tone?: 'pine' | 'paper' | 'gold'
}) {
  const ring = tone === 'paper' ? 'var(--paper)' : tone === 'gold' ? 'var(--gold)' : 'var(--pine)'
  const fill = tone === 'paper' ? 'var(--pine)' : 'var(--paper)'
  return (
    <svg viewBox="0 0 40 40" className={cn('size-10', className)} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill={ring} />
      <circle cx="20" cy="20" r="13.5" fill="none" stroke={fill} strokeWidth="1.5" opacity="0.6" />
      <path
        d="M14 22.5l4.2 4.2L27 16.5"
        fill="none"
        stroke={fill}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <BrandMark className="size-7" />
      <span className="font-display text-xl font-extrabold tracking-tight">
        Claim<span className="text-gold">MY</span>
      </span>
    </span>
  )
}
