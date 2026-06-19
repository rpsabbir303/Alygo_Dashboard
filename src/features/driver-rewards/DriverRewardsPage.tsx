import { Tabs } from 'antd'
import { Navigate, useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AchievementManagement } from '@/features/driver-rewards/components/AchievementManagement'
import { BonusCampaignsTable } from '@/features/driver-rewards/components/BonusCampaignsTable'
import { DriverRankingsPanel } from '@/features/driver-rewards/components/DriverRankingsPanel'
import { DriverRewardsWalletPanel } from '@/features/driver-rewards/components/DriverRewardsWalletPanel'
import { IncentiveProgramsTable } from '@/features/driver-rewards/components/IncentiveProgramsTable'
import { PenaltyRulesTable } from '@/features/driver-rewards/components/PenaltyRulesTable'
import { PerformanceRulesTable } from '@/features/driver-rewards/components/PerformanceRulesTable'
import { PointsRulesEnginePanel } from '@/features/driver-rewards/components/PointsRulesEnginePanel'
import { RewardsActionBar } from '@/features/driver-rewards/components/RewardsActionBar'
import { RulesEngineAnalyticsPanel } from '@/features/driver-rewards/components/RulesEngineAnalyticsPanel'
import { TierAnalyticsPanel } from '@/features/driver-rewards/components/TierAnalyticsPanel'
import { useDriverRewardsRealtime } from '@/features/driver-rewards/hooks/useDriverRewardsRealtime'
import {
  DEFAULT_REWARDS_TAB,
  isLegacyTierRewardsTab,
  REWARDS_TAB_KEYS,
  REWARDS_TAB_LABELS,
  type RewardsTabKey,
} from '@/features/driver-rewards/rewardsNavigation'

const REWARDS_TABS = [
  { key: 'points-rules', label: REWARDS_TAB_LABELS['points-rules'], children: <PointsRulesEnginePanel /> },
  { key: 'performance-rules', label: REWARDS_TAB_LABELS['performance-rules'], children: <PerformanceRulesTable /> },
  { key: 'penalty-rules', label: REWARDS_TAB_LABELS['penalty-rules'], children: <PenaltyRulesTable /> },
  { key: 'bonus-campaigns', label: REWARDS_TAB_LABELS['bonus-campaigns'], children: <BonusCampaignsTable /> },
  { key: 'rewards-wallet', label: REWARDS_TAB_LABELS['rewards-wallet'], children: <DriverRewardsWalletPanel /> },
  { key: 'driver-rankings', label: REWARDS_TAB_LABELS['driver-rankings'], children: <DriverRankingsPanel /> },
  { key: 'incentive-programs', label: REWARDS_TAB_LABELS['incentive-programs'], children: <IncentiveProgramsTable /> },
  { key: 'achievements', label: REWARDS_TAB_LABELS.achievements, children: <AchievementManagement /> },
  { key: 'rules-analytics', label: REWARDS_TAB_LABELS['rules-analytics'], children: <RulesEngineAnalyticsPanel /> },
  { key: 'tier-analytics', label: REWARDS_TAB_LABELS['tier-analytics'], children: <TierAnalyticsPanel /> },
] as const

export default function DriverRewardsPage() {
  useDocumentTitle('Driver Rewards & Performance')
  useDriverRewardsRealtime()

  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  if (isLegacyTierRewardsTab(tabParam)) {
    return <Navigate to="/drivers/tiers" replace />
  }

  const activeTab = (tabParam as RewardsTabKey | null) ?? DEFAULT_REWARDS_TAB
  const validTab = REWARDS_TAB_KEYS.includes(activeTab) ? activeTab : DEFAULT_REWARDS_TAB

  return (
    <PageShell
      title="Driver Rewards & Performance"
      description="Configurable rewards rules engine for points, performance bonuses, penalties, campaigns, wallets, and analytics. Tier benefits are managed in Tier Management."
    >
      <RewardsActionBar />

      <div className="glass-card mt-6 p-4">
        <Tabs
          activeKey={validTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={[...REWARDS_TABS]}
        />
      </div>
    </PageShell>
  )
}
