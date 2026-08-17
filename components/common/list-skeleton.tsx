import { cn } from '@/lib/utils'

/**
 * Group 8 · Fidelity — "skeleton loading extended to every list screen, not
 * just Home search". The lo-fi fades successive rows (1.0 → .8 → .55) so the
 * list reads as loading rather than broken.
 */
export function ListSkeleton({
  rows = 3,
  avatar = true,
  className,
}: {
  rows?: number
  avatar?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
          style={{ opacity: 1 - i * 0.22 }}
        >
          {avatar && <span className="skeleton size-10 shrink-0 rounded-full" />}
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="skeleton h-3 w-[70%] rounded-full" />
            <span className="skeleton h-3 w-[45%] rounded-full" />
          </span>
        </div>
      ))}
    </div>
  )
}

/** Inline bar for single values still resolving (totals, amounts). */
export function SkeletonBar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('skeleton block h-4 w-24 rounded-full', className)}
    />
  )
}
