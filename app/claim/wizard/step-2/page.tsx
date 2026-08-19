'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Plus, Info, ArrowRight, User } from 'lucide-react'
import { StepWrapper } from '@/components/wizard/step-wrapper'
import { GlossaryTerm } from '@/components/common/glossary-term'
import { useClaim } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'

/** S-11 · Who Is Claiming — Step 2 of 6 */
export default function WizardStep2() {
  const router = useRouter()
  const { t } = useLanguage()
  const { wizard, updateWizard } = useClaim()
  const { family, profile } = useSettings()

  const isSelf = wizard.mode === 'self'
  const isEstate = wizard.mode === 'deceased'
  const needsTarget = !isSelf
  const canContinue = isSelf || wizard.familyTargetId !== null

  return (
    <StepWrapper
      title={isSelf ? t('review.group.you') : t('wiz.s2.title')}
      subtitle={isSelf ? t('wiz.s2.self.notice') : t('wiz.s2.sub')}
      disabled={!canContinue}
      disabledHint={t('wiz.s2.select')}
      onContinue={() => {
        updateWizard({ furthestStep: 3 })
        router.push('/claim/wizard/step-3')
      }}
    >
      {isSelf ? (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-pine bg-pine-soft/50 p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pine text-pine-foreground">
            <User className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block font-bold">{profile.name}</span>
            <span className="tabular block font-mono text-sm text-muted-foreground">
              {profile.ic}
            </span>
          </span>
        </div>
      ) : (
        <>
          <h3 className="mb-3 text-sm font-bold">{t('wiz.s2.select')}</h3>

          <div
            className="flex flex-col gap-2.5"
            role="radiogroup"
            aria-label={t('wiz.s2.select')}
          >
            {family.map((member) => {
              const active = wizard.familyTargetId === member.id
              return (
                <button
                  key={member.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => updateWizard({ familyTargetId: member.id })}
                  data-tap
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors',
                    active
                      ? 'border-pine bg-pine-soft/50'
                      : 'border-border bg-card hover:border-pine/40',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      active ? 'border-pine' : 'border-border',
                    )}
                  >
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                        className="size-3 rounded-full bg-pine"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold leading-snug">
                      {member.name}
                    </span>
                    <span className="tabular block truncate font-mono text-sm text-muted-foreground">
                      {member.ic} · {t(member.relationship)}
                    </span>
                  </span>
                </button>
              )
            })}

            <button
              onClick={() => router.push('/family/add')}
              data-tap
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 font-bold text-pine transition-colors hover:border-pine/50 hover:bg-pine-soft/30"
            >
              <Plus className="size-5" />
              {t('wiz.s2.add')}
            </button>
          </div>

          {/* Contextual guidance — different paperwork per route, said up front */}
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-pine" />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">
                {isEstate ? (
                  t('wiz.s2.estate.notice')
                ) : (
                  <>
                    {t('wiz.s2.poa.prefix')}
                    <GlossaryTerm definition={t('glossary.poa')}>
                      {t('doc.poa')}
                    </GlossaryTerm>
                    {t('wiz.s2.poa.suffix')}
                  </>
                )}
              </p>
              {isEstate ? (
                <button
                  onClick={() => router.push('/family/deceased')}
                  className="mt-1.5 inline-flex items-center gap-1 text-sm font-bold text-pine underline underline-offset-2"
                >
                  {t('wiz.s2.estate.cta')}
                  <ArrowRight className="size-3.5" />
                </button>
              ) : (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t('wiz.s2.poa.hint')}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {needsTarget && family.length === 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground text-pretty">
          {t('family.empty.body')}
        </p>
      )}
    </StepWrapper>
  )
}
