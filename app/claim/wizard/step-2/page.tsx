'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Users, HeartCrack, Check } from 'lucide-react'
import { StepWrapper, WizardFooter } from '@/components/wizard/step-wrapper'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim, type ClaimMode } from '@/context/claim-context'
import { cn } from '@/lib/utils'

const OPTIONS: { mode: ClaimMode; icon: typeof User; key: string }[] = [
  { mode: 'self', icon: User, key: 'self' },
  { mode: 'family', icon: Users, key: 'family' },
  { mode: 'deceased', icon: HeartCrack, key: 'deceased' },
]

export default function Step2() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, wizard, updateWizard } = useClaim()

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  return (
    <StepWrapper title={t('wiz.s2.title')} subtitle={t('wiz.s2.sub')}>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ mode, icon: Icon, key }) => {
          const selected = wizard.mode === mode
          return (
            <button
              key={mode}
              onClick={() => updateWizard({ mode })}
              className={cn(
                'flex items-center gap-4 rounded-2xl p-4 text-left transition-all',
                selected
                  ? 'bg-pine-soft ring-2 ring-pine'
                  : 'bg-card ring-1 ring-border hover:ring-pine/40',
              )}
            >
              <span
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                  selected ? 'bg-pine text-pine-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-6" strokeWidth={2} />
              </span>
              <span className="flex-1">
                <span className="block text-[0.95rem] font-semibold text-foreground">
                  {t(`wiz.s2.${key}`)}
                </span>
                <span className="block text-sm leading-relaxed text-muted-foreground">
                  {t(`wiz.s2.${key}.d`)}
                </span>
              </span>
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  selected ? 'border-pine bg-pine text-pine-foreground' : 'border-border',
                )}
              >
                {selected && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <WizardFooter>
        <AppButton variant="outline" size="md" onClick={() => router.back()}>
          {t('wiz.back')}
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          className="flex-1"
          onClick={() => router.push('/claim/wizard/step-3')}
        >
          {t('wiz.next')}
        </AppButton>
      </WizardFooter>
    </StepWrapper>
  )
}
