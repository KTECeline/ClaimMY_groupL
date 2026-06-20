import {
  TrendingUp,
  PiggyBank,
  ShieldCheck,
  Landmark,
  Scale,
  type LucideIcon,
} from 'lucide-react'
import type { ClaimType } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const MAP: Record<ClaimType, LucideIcon> = {
  dividend: TrendingUp,
  dormant: PiggyBank,
  insurance: ShieldCheck,
  epf: Landmark,
  court: Scale,
}

export function ClaimTypeIcon({
  type,
  className,
}: {
  type: ClaimType
  className?: string
}) {
  const Icon = MAP[type] ?? Landmark
  return (
    <span
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-pine-soft text-pine',
        className,
      )}
    >
      <Icon className="size-6" strokeWidth={2.2} />
    </span>
  )
}
