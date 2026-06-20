'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BrandMark } from '@/components/common/brand-mark'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { cn } from '@/lib/utils'

const sources = ['eGUMIS', 'KWSP (EPF)', 'Bank Negara', 'Insurance & Takaful', 'Court Settlements']

export default function SearchingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { searchedIC, results } = useClaim()
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (!searchedIC) {
      router.replace('/home')
      return
    }
    const timers = sources.map((_, i) =>
      setTimeout(() => setDone(i + 1), 350 + i * 320),
    )
    const finish = setTimeout(() => {
      router.replace(results.length > 0 ? '/results' : '/results')
    }, 350 + sources.length * 320 + 400)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finish)
    }
  }, [searchedIC, results.length, router])

  return (
    <MobileContainer className="bg-pine text-pine-foreground">
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <BrandMark tone="paper" className="size-16" />
        </motion.div>

        <h1 className="mt-8 text-center font-display text-xl font-extrabold text-balance">
          {t('home.searching')}
        </h1>

        <div className="mt-8 w-full max-w-xs space-y-2.5">
          {sources.map((s, i) => {
            const complete = done > i
            const active = done === i
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
                  complete
                    ? 'border-gold/40 bg-white/10'
                    : 'border-white/10 bg-white/[0.04]',
                )}
              >
                <span className="flex size-7 items-center justify-center rounded-full">
                  <AnimatePresence mode="wait">
                    {complete ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex size-7 items-center justify-center rounded-full bg-gold text-gold-foreground"
                      >
                        <Check className="size-4" strokeWidth={3} />
                      </motion.span>
                    ) : active ? (
                      <Loader2 className="size-5 animate-spin text-pine-foreground/70" />
                    ) : (
                      <span className="size-2.5 rounded-full bg-white/25" />
                    )}
                  </AnimatePresence>
                </span>
                <span className="text-sm font-semibold">{s}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </MobileContainer>
  )
}
