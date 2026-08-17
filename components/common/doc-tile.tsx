'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Camera, Check, Loader2, Upload, RotateCcw, FileText } from 'lucide-react'
import type { DocState } from '@/context/claim-context'
import { cn } from '@/lib/utils'

/**
 * Dashed upload tile (S-12). Three states — idle / uploading / done — with the
 * fake 1.4s upload the prototype has always used. Both the scan and the upload
 * paths land here, because the journey map's "unlabelled upload fields" and
 * "wrong file format/size rejected" pain points are really about not knowing
 * what state you're in.
 */
export function DocTile({
  label,
  hint,
  state,
  onScan,
  onUpload,
  onRetake,
  scanLabel,
  uploadLabel,
  retakeLabel,
  uploadingLabel,
  doneLabel,
  compact = false,
}: {
  label: string
  hint?: string
  state: DocState
  onScan: () => void
  onUpload: () => void
  onRetake: () => void
  scanLabel: string
  uploadLabel: string
  retakeLabel: string
  uploadingLabel: string
  doneLabel: string
  compact?: boolean
}) {
  const done = state === 'done'

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-dashed p-4 transition-colors',
        done ? 'border-pine bg-pine-soft/40' : 'border-border bg-card',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors',
            done ? 'bg-pine text-pine-foreground' : 'bg-secondary text-muted-foreground',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state === 'uploading' ? (
              <motion.span
                key="load"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <Loader2 className="size-5 animate-spin" />
              </motion.span>
            ) : done ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
              >
                <Check className="size-5" strokeWidth={3} />
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <FileText className="size-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug">{label}</span>
          <span
            className={cn(
              'block text-sm leading-snug',
              done ? 'font-semibold text-pine' : 'text-muted-foreground',
            )}
          >
            {state === 'uploading' ? uploadingLabel : done ? doneLabel : hint}
          </span>
        </span>
      </div>

      {!compact && (
        <div className="mt-3 flex gap-2">
          {done ? (
            <button
              onClick={onRetake}
              data-tap
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-pine/25 px-3 py-2 text-sm font-bold text-pine transition-colors hover:bg-pine/5"
            >
              <RotateCcw className="size-4" />
              {retakeLabel}
            </button>
          ) : (
            <>
              <button
                onClick={onScan}
                disabled={state === 'uploading'}
                data-tap
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-pine px-3 py-2 text-sm font-bold text-pine-foreground transition-colors hover:bg-pine/90 disabled:opacity-50"
              >
                <Camera className="size-4" />
                {scanLabel}
              </button>
              <button
                onClick={onUpload}
                disabled={state === 'uploading'}
                data-tap
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-pine/25 px-3 py-2 text-sm font-bold text-pine transition-colors hover:bg-pine/5 disabled:opacity-50"
              >
                <Upload className="size-4" />
                {uploadLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
