'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'

const PIN_LENGTH = 6

/**
 * Vault lock screen keypad (S-31). Any 6 digits unlock — it's a prototype, so
 * the interaction is what matters, not the secret.
 */
export function PinPad({
  onComplete,
  backspaceLabel,
}: {
  onComplete: () => void
  backspaceLabel: string
}) {
  const [pin, setPin] = useState('')

  useEffect(() => {
    if (pin.length < PIN_LENGTH) return
    const timer = setTimeout(onComplete, 260)
    return () => clearTimeout(timer)
  }, [pin, onComplete])

  const press = (digit: string) =>
    setPin((p) => (p.length >= PIN_LENGTH ? p : p + digit))

  return (
    <div className="flex flex-col items-center">
      {/* 6-dot indicator */}
      <div className="flex gap-3" role="status" aria-label={`${pin.length} of ${PIN_LENGTH} digits entered`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < pin.length
          return (
            <motion.span
              key={i}
              animate={{ scale: filled ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.24 }}
              className={cn(
                'size-3.5 rounded-full transition-colors',
                filled ? 'bg-pine' : 'border-2 border-border',
              )}
            />
          )
        })}
      </div>

      <div className="mt-8 grid w-full max-w-[16rem] grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <KeypadButton key={d} onClick={() => press(d)}>
            {d}
          </KeypadButton>
        ))}
        <span />
        <KeypadButton onClick={() => press('0')}>0</KeypadButton>
        <KeypadButton
          onClick={() => setPin((p) => p.slice(0, -1))}
          ariaLabel={backspaceLabel}
        >
          <Delete className="size-5" />
        </KeypadButton>
      </div>
    </div>
  )
}

function KeypadButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  ariaLabel?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-14 items-center justify-center rounded-2xl bg-card font-display text-xl font-bold text-foreground shadow-sm transition-all active:scale-95 hover:bg-pine-soft/50 focus-visible:ring-4 focus-visible:ring-ring/30"
    >
      {children}
    </button>
  )
}
