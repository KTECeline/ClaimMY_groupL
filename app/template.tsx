'use client'

import { motion } from 'motion/react'

/**
 * `template.tsx` remounts on every navigation, so this gives every route a
 * consistent entrance instead of a hard cut. (Exit animations aren't reachable
 * in the App Router — the outgoing tree unmounts before the new one paints —
 * so entrance-only is the honest ceiling here.)
 *
 * Reduce Motion is handled globally by `MotionConfig` in providers.tsx.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
