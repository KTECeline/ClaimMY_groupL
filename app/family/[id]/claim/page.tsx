'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, Info, ScrollText } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Stepper } from '@/components/common/stepper'
import { DocTile } from '@/components/common/doc-tile'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'
import { useClaim, type DocState } from '@/context/claim-context'

/**
 * S-20 · Claim on Behalf.
 *
 * A short, self-contained gate before the main wizard: prove you may act for
 * this person. Keeping it separate means the six-step wizard stays identical
 * for everyone, rather than growing conditional branches nobody can follow.
 */
export default function ClaimOnBehalfPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const { family } = useSettings()
  const { activeClaim, updateWizard } = useClaim()
  const [poaState, setPoaState] = useState<DocState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const member = family.find((m) => m.id === id)

  useEffect(() => {
    if (!member) router.replace('/family')
  }, [member, router])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  if (!member) return null

  const firstName = member.name.split(' ')[0]

  function upload() {
    setPoaState('uploading')
    timer.current = setTimeout(() => setPoaState('done'), 1400)
  }

  function proceed() {
    if (!member) return
    updateWizard({
      mode: 'family',
      familyTargetId: member.id,
      docs: { poa: 'done' },
      furthestStep: 1,
    })
    router.push('/claim/wizard/step-1')
  }

  return (
    <AppShell title={t('poa.title')}>
      <p className="text-sm font-bold">
        {t('poa.claiming.for', { name: firstName })}
      </p>

      <div className="mt-5">
        <Stepper
          steps={[t('poa.step.1'), t('poa.step.2'), t('poa.step.3'), t('poa.step.4')]}
          current={3}
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <ScrollText className="size-5 text-pine" />
          {t('poa.upload.title')}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          {t('poa.upload.body')}
        </p>

        <div className="mt-4">
          <DocTile
            label={t('doc.poa')}
            hint={t('doc.poa.hint')}
            state={poaState}
            onScan={upload}
            onUpload={upload}
            onRetake={() => setPoaState('idle')}
            scanLabel={t('wiz.s4.scan.btn')}
            uploadLabel={t('wiz.s4.upload.btn')}
            retakeLabel={t('wiz.s4.retake')}
            uploadingLabel={t('wiz.s4.uploading')}
            doneLabel={t('wiz.s4.uploaded')}
          />
        </div>

        {/* The practical "how do I even get one" answer, in the place where
            the question actually occurs. */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-pine" />
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {t('poa.note')}
          </p>
        </div>
      </motion.section>

      <div className="mt-8 flex gap-3">
        <AppButton
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => router.back()}
        >
          {t('common.back')}
        </AppButton>
        <AppButton
          size="lg"
          className="flex-[1.4]"
          onClick={proceed}
          disabled={poaState !== 'done'}
        >
          {t('poa.continue')}
          <ArrowRight className="size-4" />
        </AppButton>
      </div>

      {activeClaim && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {activeClaim.typeLabel} · {activeClaim.institution}
        </p>
      )}
    </AppShell>
  )
}
