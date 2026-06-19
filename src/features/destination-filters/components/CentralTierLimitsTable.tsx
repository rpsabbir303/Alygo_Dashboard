import { Button, Table, Tag } from 'antd'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useGetDriverLevelsQuery } from '@/services/driverRewardsApi'
import { deriveTierFilterSettingsFromLevels } from '@/features/driver-rewards/utils/tierConfigHelpers'
import { TIER_MANAGEMENT_PATH } from '@/features/driver-rewards/utils/tierDefaults'

export function CentralTierLimitsTable() {
  const { data: levels = [], isLoading } = useGetDriverLevelsQuery()
  const data = deriveTierFilterSettingsFromLevels(levels)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-alygo-text-muted">
          Destination filter limits are read from Tier Management. This module displays analytics and usage only — edit tier limits in the centralized tier configuration.
        </p>
        <Link to={TIER_MANAGEMENT_PATH}>
          <Button type="primary" icon={<ExternalLink className="h-4 w-4" />}>
            Open Tier Management
          </Button>
        </Link>
      </div>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1100 }}
        pagination={false}
        columns={[
          {
            title: 'Tier',
            dataIndex: 'tierLabel',
            render: (label: string) => <Tag>{label}</Tag>,
          },
          { title: 'Destination Filters', dataIndex: 'numberOfFilters' },
          { title: 'Daily Limit', dataIndex: 'dailyLimit' },
          { title: 'Weekly Limit', dataIndex: 'weeklyLimit' },
          { title: 'Expiration Hours', dataIndex: 'expirationHours' },
          { title: 'Cooldown Rules', dataIndex: 'expirationRule', ellipsis: true },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
        ]}
      />
    </>
  )
}
