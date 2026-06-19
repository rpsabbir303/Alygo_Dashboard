import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { TierManagementPanel } from '@/features/driver-rewards/components/TierManagementPanel'
import { useDriverRewardsRealtime } from '@/features/driver-rewards/hooks/useDriverRewardsRealtime'

export default function TierManagementPage() {
  useDocumentTitle('Tier Management')
  useDriverRewardsRealtime()

  return (
    <PageShell
      title="Tier Management"
      description="Single source of truth for driver tier progression, points thresholds, and all platform benefits including destination filters, reservations, dispatch, rewards, protection, and promotions."
    >
      <TierManagementPanel />
    </PageShell>
  )
}
