'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, ScanFace, ShieldCheck } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BrandMark } from '@/components/common/brand-mark'
import { LanguageToggle } from '@/components/common/language-toggle'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { formatIC } from '@/lib/utils'

/**
 * S-01 Login. The lo-fi puts login before language selection, which would
 * strand a Bahasa- or Tamil-only user on an English screen — so the language
 * toggle sits in the header here, reachable before any decision is made.
 */
export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [ic, setIc] = useState('')
  const [password, setPassword] = useState('')

  return (
    <MobileContainer className="bg-pine text-pine-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(201,138,31,0.24),transparent_62%)]" />

      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-5">
        <div className="flex justify-end">
          <LanguageToggle light />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          <div className="mt-8 flex flex-col items-center text-center">
            <BrandMark tone="paper" className="size-16" />
            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
              {t('login.title')}
            </h1>
            <p className="mt-2 max-w-[17rem] leading-relaxed text-pine-foreground/70 text-pretty">
              {t('login.sub')}
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-pine-foreground/70">
                {t('login.ic')}
              </span>
              <input
                value={ic}
                onChange={(e) => setIc(formatIC(e.target.value))}
                inputMode="numeric"
                placeholder="000000-00-0000"
                autoComplete="username"
                className="tabular h-14 rounded-2xl border-2 border-white/15 bg-white/10 px-4 font-mono text-lg tracking-wide text-pine-foreground placeholder:text-pine-foreground/35 focus:border-gold focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-pine-foreground/70">
                {t('login.password')}
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-14 rounded-2xl border-2 border-white/15 bg-white/10 px-4 text-lg text-pine-foreground placeholder:text-pine-foreground/35 focus:border-gold focus:outline-none"
              />
            </label>

            <button className="self-end text-sm font-semibold text-pine-foreground/70 underline underline-offset-2 hover:text-pine-foreground">
              {t('login.forgot')}
            </button>

            <AppButton
              variant="gold"
              size="block"
              className="mt-2"
              onClick={() => router.push('/onboarding')}
            >
              {t('login.submit')}
              <ArrowRight className="size-5" />
            </AppButton>
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-xs font-semibold uppercase tracking-wide text-pine-foreground/50">
              {t('login.or')}
            </span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/auth/mydigital')}
              data-tap
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl border-2 border-white/20 font-semibold transition-colors hover:bg-white/10"
            >
              <ShieldCheck className="size-5 text-gold" />
              {t('login.mydigital')}
            </button>
            <button
              onClick={() => router.push('/onboarding')}
              data-tap
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl border-2 border-white/20 font-semibold transition-colors hover:bg-white/10"
            >
              <ScanFace className="size-5 text-gold" />
              {t('login.biometric')}
            </button>
          </div>

          <p className="mt-auto pt-8 text-center text-xs text-pine-foreground/50 text-pretty">
            {t('login.demo.hint')}
          </p>
        </motion.div>
      </div>
    </MobileContainer>
  )
}
