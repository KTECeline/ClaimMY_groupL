'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { useLanguage } from '@/context/language-context'
import { TOTAL_STEPS } from '@/context/claim-context'

const TITLE_KEYS = [
  'wiz.s1.title',
  'wiz.s2.title',
  'wiz.s3.title',
  'wiz.s4.title',
  'wiz.s5.title',
  'wiz.s6.title',
]

function stepFromPath(path: string): number {
  const m = path.match(/step-(\d)/)
  return m ? Number(m[1]) : 1
}

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const step = stepFromPath(pathname)
  const pct = (step / TOTAL_STEPS) * 100

  return (
    <MobileContainer>
      <TopBar
        title={t(TITLE_KEYS[step - 1])}
        onBack={() =>
          step === 1 ? router.back() : router.push(`/claim/wizard/step-${step - 1}`)
        }
        right={
          <Link
            href="/notifications"
            aria-label={t('alerts.title')}
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
          >
            <Bell className="size-5" />
          </Link>
        }
      />

      {/* Thin progress bar + explicit "Step N of 6" — the deck's own pattern.
          74.1% started a claim but only 20.4% finished; knowing how much is
          left is the cheapest thing that helps. */}
      <div className="px-5 pb-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-pine"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
          {t('wiz.step.of', { step, total: TOTAL_STEPS })}
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        {children}
      </div>

      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}
