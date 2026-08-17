'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ToastViewport } from '@/components/common/toast'

export type ToastTone = 'success' | 'info' | 'danger'

export type Toast = {
  id: number
  message: string
  tone: ToastTone
  /** When present the toast renders an "Undo" action instead of confirm-only. */
  undo?: () => void
}

type ShowOptions = {
  message: string
  tone?: ToastTone
  undo?: () => void
  duration?: number
}

type ToastContextValue = {
  toasts: Toast[]
  show: (opts: ShowOptions) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const show = useCallback(
    ({ message, tone = 'success', undo, duration }: ShowOptions) => {
      const id = nextId.current++
      // Undo bars stay longer — the user has to read, decide, then reach.
      const ms = duration ?? (undo ? 6000 : 3200)
      setToasts((t) => [...t.slice(-2), { id, message, tone, undo }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), ms),
      )
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({ toasts, show, dismiss }),
    [toasts, show, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
