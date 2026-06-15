import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AchievementManagement } from '@/features/driver-rewards/components/AchievementManagement'
import { BenefitsManagementTable } from '@/features/driver-rewards/components/BenefitsManagementTable'
import { DriverPerformanceTable } from '@/features/driver-rewards/components/DriverPerformanceTable'
import { EarningsAnalytics } from '@/features/driver-rewards/components/EarningsAnalytics'
import { LevelAnalytics } from '@/features/driver-rewards/components/LevelAnalytics'
import { LevelManagementTable } from '@/features/driver-rewards/components/LevelManagementTable'
import { NotificationSettings } from '@/features/driver-rewards/components/NotificationSettings'
import { PointsRulesTable } from '@/features/driver-rewards/components/PointsRulesTable'
import { ProgressionRulesTable } from '@/features/driver-rewards/components/ProgressionRulesTable'
import { PromotionsTable } from '@/features/driver-rewards/components/PromotionsTable'
import { RewardsActionBar } from '@/features/driver-rewards/components/RewardsActionBar'
import { RewardsOverviewSection } from '@/features/driver-rewards/components/RewardsOverviewSection'
import { useDriverRewardsRealtime } from '@/features/driver-rewards/hooks/useDriverRewardsRealtime'

export default function DriverRewardsPage() {
  useDocumentTitle('Driver Rewards & Performance')
  useDriverRewardsRealtime()

  return (
    <PageShell
      title="Driver Rewards & Performance"
      description="Manage driver tiers, points rules, benefits, promotions, performance monitoring, and analytics."
    >
      <RewardsOverviewSection />

      <div className="mt-6">
        <RewardsActionBar />
      </div>

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="tiers"
          items={[
            { key: 'tiers', label: 'Tier Management', children: <LevelManagementTable /> },
            { key: 'points', label: 'Points Rule Engine', children: <PointsRulesTable /> },
            { key: 'benefits', label: 'Level Benefits', children: <BenefitsManagementTable /> },
            { key: 'control', label: 'Driver Rewards Control Center', children: <DriverPerformanceTable /> },
            { key: 'promotions', label: 'Bonus & Promotion Engine', children: <PromotionsTable /> },
            { key: 'achievements', label: 'Achievements', children: <AchievementManagement /> },
            { key: 'level-analytics', label: 'Driver Level Analytics', children: <LevelAnalytics /> },
            { key: 'earnings', label: 'Earnings & Rewards Analytics', children: <EarningsAnalytics /> },
            { key: 'progression', label: 'Progression Rules', children: <ProgressionRulesTable /> },
            { key: 'notifications', label: 'Notification Rules', children: <NotificationSettings /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
