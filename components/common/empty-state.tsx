'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Group 8 · Learnability — "guided empty states everywhere a list can be
 * blank". Never a bare "nothing here": always names the next action.
 */
export function EmptyState({
  icon,
  title,
  body,
  action,
  secondaryAction,
  className,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
  secondaryAction?: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-1 flex-col items-center justify-center px-4 py-12 text-center',
        className,
      )}
    >
      <span className="flex size-20 items-center justify-center rounded-[1.75rem] bg-pine-soft text-pine">
        {icon}
      </span>
      <h2 className="mt-6 font-display text-xl font-bold text-balance">
        {title}
      </h2>
      <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground text-pretty">
        {body}
      </p>
      {action && <div className="mt-6 w-full">{action}</div>}
      {secondaryAction && <div className="mt-3 w-full">{secondaryAction}</div>}
    </motion.div>
  )
}
