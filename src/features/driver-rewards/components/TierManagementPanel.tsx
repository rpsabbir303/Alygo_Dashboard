import { TierManagementOverviewCards } from '@/features/driver-rewards/components/TierManagementOverviewCards'
import { LevelManagementTable } from '@/features/driver-rewards/components/LevelManagementTable'
import { PromotionDemotionEngine } from '@/features/driver-rewards/components/PromotionDemotionEngine'

export function TierManagementPanel() {
  return (
    <div className="space-y-6">
      <TierManagementOverviewCards />
      <LevelManagementTable />
      <PromotionDemotionEngine />
    </div>
  )
}
