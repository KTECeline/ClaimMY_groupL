'use client'

import { motion } from 'motion/react'
import { useMemo } from 'react'

const COLORS = ['var(--gold)', 'var(--pine)', 'var(--clay)', 'var(--teal)']

export function ConfettiBurst({ count = 28 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        y: -(Math.random() * 280 + 120),
        rotate: Math.random() * 540,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.15,
        size: Math.random() * 6 + 6,
        round: Math.random() > 0.5,
      })),
    [count],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-0 w-0"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate, scale: 0.6 }}
          transition={{ duration: 1.5, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '9999px' : '2px',
          }}
        />
      ))}
    </div>
  )
}
