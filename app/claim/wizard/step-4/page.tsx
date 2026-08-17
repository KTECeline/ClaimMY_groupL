'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Zap } from 'lucide-react'
import { StepWrapper } from '@/components/wizard/step-wrapper'
import { DocTile } from '@/components/common/doc-tile'
import { useClaim, type DocState } from '@/context/claim-context'
import { useLanguage } from '@/context/language-context'
import { useToast } from '@/context/toast-context'
import { getDocument, VAULT_DOC_IDS } from '@/lib/mock-data'
import { useRequiredDocs } from '@/lib/use-required-docs'

const UPLOAD_MS = 1400

/** S-12 · Document Upload — Step 4 of 6 */
export default function WizardStep4() {
  const router = useRouter()
  const { t } = useLanguage()
  const { show } = useToast()
  const { activeClaim, wizard, updateWizard } = useClaim()
  const requiredDocs = useRequiredDocs()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  // Auto-fill anything already in the vault. This is the whole reason the
  // vault exists — "difficult form-filling" was the #2 blocker at 16.7%.
  useEffect(() => {
    const prefill: Record<string, DocState> = {}
    requiredDocs.forEach((id) => {
      if (VAULT_DOC_IDS.includes(id) && !wizard.docs[id]) prefill[id] = 'done'
    })
    if (Object.keys(prefill).length > 0) {
      updateWizard({ docs: { ...wizard.docs, ...prefill } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredDocs.join(',')])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  if (!activeClaim) return null

  const setDoc = (id: string, state: DocState) =>
    updateWizard({ docs: { ...wizard.docs, [id]: state } })

  function startUpload(id: string, label: string) {
    setDoc(id, 'uploading')
    timers.current.push(
      setTimeout(() => {
        setDoc(id, 'done')
        show({ message: `${label} — ${t('wiz.s4.uploaded')}` })
      }, UPLOAD_MS),
    )
  }

  const allDone = requiredDocs.every((id) => wizard.docs[id] === 'done')
  const fromVault = requiredDocs.filter((id) => VAULT_DOC_IDS.includes(id))

  return (
    <StepWrapper
      title={t('wiz.s4.title')}
      subtitle={t('wiz.s4.sub')}
      disabled={!allDone}
      disabledHint={t('wiz.s4.gate')}
      onContinue={() => {
        updateWizard({ furthestStep: 5 })
        router.push('/claim/wizard/step-5')
      }}
    >
      {/* Scan-everything shortcut, as the deck's primary CTA */}
      <button
        onClick={() =>
          requiredDocs.forEach((id) => {
            if (wizard.docs[id] !== 'done') {
              startUpload(id, t(getDocument(id)?.labelKey ?? ''))
            }
          })
        }
        data-tap
        className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-pine font-bold text-pine-foreground shadow-[0_6px_20px_-8px_rgba(12,107,82,0.7)] transition-transform active:scale-[0.98]"
      >
        <Camera className="size-5" />
        {t('wiz.s4.scan')}
      </button>

      <p className="my-4 text-center text-sm text-muted-foreground">
        {t('wiz.s4.or')}
      </p>

      {fromVault.length > 0 && (
        <div className="mb-4 flex items-center gap-2.5 rounded-2xl bg-gold-soft px-4 py-3">
          <Zap className="size-4 shrink-0 text-accent-foreground" />
          <span className="text-sm font-semibold text-accent-foreground">
            {t('wiz.s4.vault')}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {requiredDocs.map((id) => {
          const doc = getDocument(id)
          if (!doc) return null
          const label = t(doc.labelKey)
          return (
            <DocTile
              key={id}
              label={label}
              hint={t(doc.hintKey)}
              state={wizard.docs[id] ?? 'idle'}
              onScan={() => startUpload(id, label)}
              onUpload={() => startUpload(id, label)}
              onRetake={() => setDoc(id, 'idle')}
              scanLabel={t('wiz.s4.scan.btn')}
              uploadLabel={t('wiz.s4.upload.btn')}
              retakeLabel={t('wiz.s4.retake')}
              uploadingLabel={t('wiz.s4.uploading')}
              doneLabel={t('wiz.s4.uploaded')}
            />
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {t('wiz.s4.formats')}
      </p>
    </StepWrapper>
  )
}
