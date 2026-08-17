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

/**
 * A bare glyph, not a colored chip. Wrapping every type icon in the same
 * soft-tint rounded square is what made every list row look identical —
 * callers that genuinely need a badge (a hero moment, an avatar) build one
 * explicitly; ordinary list rows just get the icon inline with the text.
 */
export function ClaimTypeIcon({
  type,
  className,
}: {
  type: ClaimType
  className?: string
}) {
  const Icon = MAP[type] ?? Landmark
  return <Icon className={cn('text-pine', className)} strokeWidth={2.2} />
}
