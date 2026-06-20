'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { CloudOff, RefreshCw } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'

export default function ErrorDemoPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <MobileContainer>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="flex size-24 items-center justify-center rounded-full bg-clay-soft text-clay"
        >
          <CloudOff className="size-11" />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-balance text-foreground">
          {t('error.title')}
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
          {t('error.body')}
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <AppButton variant="primary" size="block" onClick={() => router.push('/home')}>
            <RefreshCw className="size-5" />
            {t('error.retry')}
          </AppButton>
          <AppButton variant="ghost" size="block" onClick={() => router.push('/home')}>
            {t('error.home')}
          </AppButton>
        </div>
      </div>
    </MobileContainer>
  )
}
