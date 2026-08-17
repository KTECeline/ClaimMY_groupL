'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  FileText,
  Lock,
  Plus,
  TriangleAlert,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { StatusBadge } from '@/components/common/status-badge'
import { Callout } from '@/components/common/callout'
import { AppButton } from '@/components/ui/app-button'
import { VaultLock } from '@/components/vault/vault-lock'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'
import { VAULT_DOCUMENTS, type VaultDocument } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

/**
 * S-30 · Document Vault, gated by S-31.
 *
 * This is the engine behind One-Click Claim and the auto-fill at wizard step 4.
 * "Difficult form-filling" was the second-biggest blocker at 16.7%, and
 * repetitive re-entry is what Aisyah Wira complained about — storing documents
 * once is the structural fix.
 */
export default function VaultPage() {
  const { t } = useLanguage()
  const { vaultUnlocked } = useSettings()
  const { show } = useToast()
  const [docs, setDocs] = useState<VaultDocument[]>(VAULT_DOCUMENTS)

  const stored = docs.filter((d) => d.status === 'stored')

  /** Undo bar rather than a confirm dialog — Group 8 · Visibility. */
  function deleteDoc(doc: VaultDocument) {
    const previous = docs
    setDocs((list) => list.filter((d) => d.id !== doc.id))
    show({
      message: t('vault.deleted', { name: doc.name }),
      tone: 'danger',
      undo: () => setDocs(previous),
    })
  }

  function deleteAll() {
    const previous = docs
    setDocs((list) => list.map((d) => ({ ...d, status: 'not-stored' as const })))
    show({
      message: t('vault.deleted.all'),
      tone: 'danger',
      undo: () => setDocs(previous),
    })
  }

  return (
    <AppShell title={t('vault.title')} fab={false}>
      {/* Why the vault is worth filling */}
      <div className="flex items-start gap-3 rounded-2xl bg-gold-soft p-4">
        <Zap className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
        <div className="min-w-0">
          <p className="font-semibold leading-snug text-accent-foreground">
            {t('vault.autofill')}
          </p>
          <p className="mt-0.5 text-sm leading-snug text-accent-foreground/80 text-pretty">
            {t('vault.autofill.hint')}
          </p>
        </div>
      </div>

      <h2 className="mb-2 mt-6 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {t('vault.group')}
      </h2>

      {/* One container, divided rows — five separate elevated cards for a
          document list was more weight than the content needed. A row that
          needs a warning gets a left accent stripe instead of its own box. */}
      <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
        <AnimatePresence initial={false}>
          {docs.map((doc, i) => {
            const isStored = doc.status === 'stored'
            return (
              <motion.li
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ delay: 0.04 * i }}
                className={cn(
                  'flex items-center gap-3 border-l-2 px-4 py-3.5',
                  doc.expiringSoon ? 'border-l-gold' : 'border-l-transparent',
                )}
              >
                <FileText
                  className={cn(
                    'size-5 shrink-0',
                    isStored ? 'text-pine' : 'text-muted-foreground',
                  )}
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold leading-snug">
                    {doc.name}
                  </span>
                  <span className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                    {doc.expiringSoon && (
                      <TriangleAlert className="size-3.5 shrink-0 text-gold" />
                    )}
                    {doc.detail}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <StatusBadge tone={isStored ? 'done' : 'outline'}>
                      {isStored ? t('vault.stored') : t('vault.not.stored')}
                    </StatusBadge>
                    {doc.expiringSoon && (
                      <StatusBadge tone="claimable">
                        {t('vault.expiring')}
                      </StatusBadge>
                    )}
                  </span>
                </span>

                {isStored && (
                  <button
                    onClick={() => deleteDoc(doc)}
                    aria-label={`${t('common.delete')} ${doc.name}`}
                    data-tap
                    className="shrink-0 rounded-full border-2 border-clay/30 px-3 py-1.5 text-xs font-bold text-clay transition-colors hover:bg-clay-soft"
                  >
                    {t('common.delete')}
                  </button>
                )}
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>

      <button
        onClick={() => show({ message: t('vault.added', { name: t('doc.policy') }) })}
        data-tap
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 font-bold text-pine transition-colors hover:border-pine/50 hover:bg-pine-soft/30"
      >
        <Plus className="size-5" />
        {t('vault.add')}
      </button>

      <Callout icon={<Lock className="size-4" />} className="mt-6">
        {t('vault.privacy')}
      </Callout>

      {stored.length > 0 && (
        <AppButton
          variant="danger"
          size="block"
          className="mt-6"
          onClick={deleteAll}
        >
          {t('vault.delete.all')}
        </AppButton>
      )}

      <AnimatePresence>{!vaultUnlocked && <VaultLock />}</AnimatePresence>
    </AppShell>
  )
}
