import { Tabs } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import {
  TierBenefitsTab,
  TierConfigurationTab,
  TierOverviewTab,
} from '@/features/driver-rewards/components/TierTabPanels'
import {
  DEFAULT_TIER_TAB,
  TIER_TAB_KEYS,
  TIER_TAB_LABELS,
  type TierTabKey,
} from '@/features/driver-rewards/tierNavigation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const TIER_TABS = [
  { key: 'overview', label: TIER_TAB_LABELS.overview, children: <TierOverviewTab /> },
  { key: 'configuration', label: TIER_TAB_LABELS.configuration, children: <TierConfigurationTab /> },
  { key: 'benefits', label: TIER_TAB_LABELS.benefits, children: <TierBenefitsTab /> },
] as const

export default function TierManagementPage() {
  useDocumentTitle('Tier Management')
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const activeTab = (rawTab as TierTabKey | null) ?? DEFAULT_TIER_TAB
  const validTab = TIER_TAB_KEYS.includes(activeTab) ? activeTab : DEFAULT_TIER_TAB

  return (
    <PageShell
      title="Tier Management"
      description="Manage driver tier requirements, progression thresholds, and platform benefits."
    >
      <div className="glass-card p-4">
        <Tabs
          activeKey={validTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={[...TIER_TABS]}
        />
      </div>
    </PageShell>
  )
}
