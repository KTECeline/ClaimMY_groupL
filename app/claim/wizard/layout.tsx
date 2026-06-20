'use client'

import { usePathname } from 'next/navigation'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { WizardProgress } from '@/components/wizard/wizard-progress'
import { useLanguage } from '@/context/language-context'

const TOTAL = 4

function stepFromPath(path: string): number {
  const m = path.match(/step-(\d)/)
  if (m) return Number(m[1])
  if (path.includes('success')) return TOTAL
  return 1
}

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const isSuccess = pathname.includes('success')
  const step = stepFromPath(pathname)

  if (isSuccess) {
    // Success screen owns the full canvas
    return <>{children}</>
  }

  return (
    <MobileContainer>
      <TopBar
        title={t('wiz.step', { n: step, total: TOTAL })}
        right={null}
      />
      <WizardProgress step={step} total={TOTAL} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        {children}
      </div>
    </MobileContainer>
  )
}
