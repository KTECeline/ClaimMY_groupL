'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, FileUp, Check, Loader2, FileText, RotateCcw } from 'lucide-react'
import { StepWrapper, WizardFooter } from '@/components/wizard/step-wrapper'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { cn } from '@/lib/utils'

type DocState = 'idle' | 'uploading' | 'done'

const DOC_KEYS = ['mykad', 'bank'] as const

export default function Step3() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, wizard, updateWizard, editFromReview, setEditFromReview } = useClaim()
  const [states, setStates] = useState<Record<string, DocState>>({})

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  const docLabels: Record<string, string> = {
    mykad: t('wiz.s3.doc.mykad'),
    bank: t('wiz.s3.doc.bank'),
  }

  function upload(key: string) {
    if (states[key] === 'uploading') return
    setStates((s) => ({ ...s, [key]: 'uploading' }))
    setTimeout(() => {
      setStates((s) => ({ ...s, [key]: 'done' }))
      if (!wizard.docsUploaded.includes(key)) {
        updateWizard({ docsUploaded: [...wizard.docsUploaded, key] })
      }
    }, 1400)
  }

  const allDone = DOC_KEYS.every((k) => states[k] === 'done')

  return (
    <StepWrapper title={t('wiz.s3.title')} subtitle={t('wiz.s3.sub')}>
      <div className="flex flex-col gap-4">
        {DOC_KEYS.map((key) => {
          const state = states[key] ?? 'idle'
          return (
            <div
              key={key}
              className={cn(
                'rounded-2xl p-4 ring-1 transition-all',
                state === 'done' ? 'bg-pine-soft ring-pine/40' : 'bg-card ring-border',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-xl',
                    state === 'done' ? 'bg-pine text-pine-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {state === 'done' ? (
                    <Check className="size-5" strokeWidth={3} />
                  ) : state === 'uploading' ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-[0.95rem] font-semibold text-foreground">{docLabels[key]}</p>
                  <p className="text-sm text-muted-foreground">
                    {state === 'done'
                      ? t('wiz.s3.uploaded')
                      : state === 'uploading'
                        ? `${t('wiz.s3.uploaded')}…`
                        : 'PDF, JPG or PNG'}
                  </p>
                </div>
                {state === 'done' && (
                  <button
                    onClick={() => upload(key)}
                    className="flex items-center gap-1 text-xs font-semibold text-pine"
                  >
                    <RotateCcw className="size-3.5" />
                    {t('wiz.s3.retake')}
                  </button>
                )}
              </div>

              {state === 'idle' && (
                <div className="mt-3 flex gap-2">
                  <AppButton variant="soft" size="sm" className="flex-1" onClick={() => upload(key)}>
                    <Camera className="size-4" />
                    {t('wiz.s3.scan')}
                  </AppButton>
                  <AppButton variant="soft" size="sm" className="flex-1" onClick={() => upload(key)}>
                    <FileUp className="size-4" />
                    {t('wiz.s3.upload')}
                  </AppButton>
                </div>
              )}
            </div>
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
          disabled={!allDone}
          onClick={() => {
            if (editFromReview) setEditFromReview(false)
            router.push('/claim/wizard/step-4')
          }}
        >
          {editFromReview ? 'Save & return' : t('wiz.next')}
        </AppButton>
      </WizardFooter>
    </StepWrapper>
  )
}
