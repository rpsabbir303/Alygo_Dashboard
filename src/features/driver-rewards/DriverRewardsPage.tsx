import { Tabs } from 'antd'
import { Navigate, useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import {
  BonusProgramsTab,
  PenaltyRulesTab,
  PerformanceRewardsTab,
  RewardRulesTab,
} from '@/features/driver-rewards/components/DriverRewardsTabPanels'
import { RewardsOverviewCards } from '@/features/driver-rewards/components/RewardsOverviewCards'
import {
  isLegacyTierRewardsTab,
  REWARDS_TAB_LABELS,
  resolveRewardsTab,
} from '@/features/driver-rewards/rewardsNavigation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const REWARDS_TABS = [
  { key: 'overview', label: REWARDS_TAB_LABELS.overview, children: <RewardsOverviewCards /> },
  { key: 'reward-rules', label: REWARDS_TAB_LABELS['reward-rules'], children: <RewardRulesTab /> },
  {
    key: 'performance-rewards',
    label: REWARDS_TAB_LABELS['performance-rewards'],
    children: <PerformanceRewardsTab />,
  },
  { key: 'bonus-programs', label: REWARDS_TAB_LABELS['bonus-programs'], children: <BonusProgramsTab /> },
  { key: 'penalty-rules', label: REWARDS_TAB_LABELS['penalty-rules'], children: <PenaltyRulesTab /> },
] as const

export default function DriverRewardsPage() {
  useDocumentTitle('Driver Rewards & Performance')
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  if (isLegacyTierRewardsTab(tabParam)) {
    return <Navigate to="/drivers/tiers" replace />
  }

  const validTab = resolveRewardsTab(tabParam)

  return (
    <PageShell
      title="Driver Rewards & Performance"
      description="Configure ride rewards, performance incentives, bonus programs, and penalty deductions for driver tier progression."
    >
      <div className="glass-card p-4">
        <Tabs
          activeKey={validTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={[...REWARDS_TABS]}
        />
      </div>
    </PageShell>
  )
}
