'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Plus, ChevronRight, Users, Scroll } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { TopBar } from '@/components/layout/top-bar'
import { AppButton } from '@/components/ui/app-button'
import { Amount } from '@/components/common/amount'
import { EmptyState } from '@/components/common/empty-state'
import { StatusBadge } from '@/components/common/status-badge'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'

/**
 * S-17 · Family Hub.
 *
 * Family Mode had the highest card-sorting agreement of any category, and the
 * Tan Lai Keong persona is the reason: the person who most needs this is least
 * able to do it alone. The hub is deliberately a list of people, not a list of
 * claims.
 */
export default function FamilyPage() {
  const { t } = useLanguage()
  const { family } = useSettings()

  const total = family.reduce((s, m) => s + m.claimable, 0)

  return (
    <MobileContainer>
      <TopBar title={t('family.hub.title')} back={false} />

      <main className="flex-1 px-5 pb-28">
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {t('family.hub.sub')}
        </p>

        {family.length === 0 ? (
          <EmptyState
            icon={<Users className="size-9" />}
            title={t('family.empty.title')}
            body={t('family.empty.body')}
            action={
              <Link href="/family/add">
                <AppButton size="block">
                  <Plus className="size-5" />
                  {t('family.add.cta')}
                </AppButton>
              </Link>
            }
          />
        ) : (
          <>
            {/* Total found across the family */}
            <div className="mt-4 overflow-hidden rounded-3xl bg-pine p-5 text-pine-foreground">
              <p className="text-xs font-semibold uppercase tracking-wide text-pine-foreground/60">
                {t('family.totalFound')}
              </p>
              <div className="mt-1">
                <Amount value={total} size="xl" tone="paper" />
              </div>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
              {family.map((member, i) => (
                <motion.li
                  key={member.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link
                    href={`/family/${member.id}/results`}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-pine-soft/30"
                  >
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-full font-display font-bold text-pine-foreground"
                      style={{ background: member.avatarColor }}
                    >
                      {member.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold leading-snug">
                        {member.name}
                      </span>
                      <span className="tabular block truncate font-mono text-sm text-muted-foreground">
                        {member.ic}
                      </span>
                      <span className="mt-1.5 block">
                        {member.claims > 0 ? (
                          <StatusBadge tone="claimable">
                            {t('family.claims.found', { n: member.claims })}
                          </StatusBadge>
                        ) : (
                          <StatusBadge tone="outline">
                            {t('family.claims.none')}
                          </StatusBadge>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/family/add"
              data-tap
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 font-bold text-pine transition-colors hover:border-pine/50 hover:bg-pine-soft/30"
            >
              <Plus className="size-5" />
              {t('family.add.cta')}
            </Link>
          </>
        )}

        {/* The estate route is a genuinely different journey — signposted
            rather than buried inside the normal claim flow. */}
        <Link
          href="/family/deceased"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-pine-soft/30"
        >
          <Scroll className="size-5 shrink-0 text-gold" />
          <span className="flex-1 text-sm font-semibold text-pretty">
            {t('family.deceased.link')}
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </main>

      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}
