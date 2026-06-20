'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Search, Layers, Wand2, Check, ArrowRight } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BrandMark } from '@/components/common/brand-mark'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { LANGUAGES, type Lang } from '@/lib/i18n/dictionary'
import { cn } from '@/lib/utils'

const slides = [
  { icon: Layers, key: 1 },
  { icon: Search, key: 2 },
  { icon: Wand2, key: 3 },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { t, lang, setLang } = useLanguage()
  const [stage, setStage] = useState<'lang' | 'slides'>('lang')
  const [index, setIndex] = useState(0)

  function next() {
    if (index < slides.length - 1) setIndex((i) => i + 1)
    else router.push('/home')
  }

  return (
    <MobileContainer className="bg-pine text-pine-foreground">
      {/* Decorative top band */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(201,138,31,0.22),transparent_60%)]" />

      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-12">
        <AnimatePresence mode="wait">
          {stage === 'lang' ? (
            <motion.div
              key="lang"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              <BrandMark tone="paper" className="size-14" />
              <h1 className="mt-8 font-display text-3xl font-extrabold leading-tight text-balance">
                {t('onb.choose.lang')}
              </h1>
              <p className="mt-2 text-pine-foreground/70 leading-relaxed">
                {t('onb.choose.lang.sub')}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {LANGUAGES.map((l) => {
                  const active = l.code === lang
                  return (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code as Lang)}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all',
                        active
                          ? 'border-gold bg-white/10'
                          : 'border-white/15 hover:border-white/30',
                      )}
                    >
                      <span>
                        <span className="block text-lg font-bold">{l.native}</span>
                        <span className="block text-sm text-pine-foreground/60">
                          {l.label}
                        </span>
                      </span>
                      <span
                        className={cn(
                          'flex size-6 items-center justify-center rounded-full border-2 transition-colors',
                          active ? 'border-gold bg-gold' : 'border-white/30',
                        )}
                      >
                        {active && <Check className="size-4 text-gold-foreground" />}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-auto pt-8">
                <AppButton
                  variant="gold"
                  size="block"
                  onClick={() => setStage('slides')}
                >
                  {t('onb.continue')}
                  <ArrowRight className="size-5" />
                </AppButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slides"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col"
            >
              <div className="flex items-center justify-between">
                <BrandMark tone="paper" className="size-9" />
                <button
                  onClick={() => router.push('/home')}
                  className="text-sm font-semibold text-pine-foreground/70 hover:text-pine-foreground"
                >
                  {t('onb.skip')}
                </button>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center"
                  >
                    <span className="flex size-24 items-center justify-center rounded-[2rem] bg-white/10 ring-1 ring-white/15">
                      {(() => {
                        const Icon = slides[index].icon
                        return <Icon className="size-11 text-gold" strokeWidth={2} />
                      })()}
                    </span>
                    <h2 className="mt-8 font-display text-3xl font-extrabold leading-tight text-balance">
                      {t(`onb.${slides[index].key}.title`)}
                    </h2>
                    <p className="mt-3 max-w-xs text-pine-foreground/75 leading-relaxed text-pretty">
                      {t(`onb.${slides[index].key}.body`)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots */}
              <div className="mb-6 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      i === index ? 'w-7 bg-gold' : 'w-2 bg-white/25',
                    )}
                  />
                ))}
              </div>

              <AppButton variant="gold" size="block" onClick={next}>
                {index === slides.length - 1 ? t('onb.start') : t('onb.next')}
                <ArrowRight className="size-5" />
              </AppButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  )
}
