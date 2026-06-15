import { Button, Switch, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getSurgeActionItems,
  handleGenericAction,
  handleSurgeAction,
  openSurgeDetails,
  openGenericDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetSurgeZonesQuery } from '@/services/api'
import type { SurgeZone } from '@/types'
import { BarTrendChart, ChartCard } from '@/components/charts/AnalyticsCharts'

export function SurgeZonesPage() {
  useDocumentTitle('Surge Zones')
  const adminActions = useAdminActions()
  const { data: zones = [], isLoading } = useGetSurgeZonesQuery()

  return (
    <PageShell title="Surge Zones" description="Manage dynamic surge pricing zones and multipliers." actions={<Button type="primary">Create Zone</Button>}>
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          rowKey="id"
          dataSource={zones}
          {...createTableRowProps<SurgeZone>((record) => openSurgeDetails(record, adminActions))}
          columns={[
            { title: 'Zone', dataIndex: 'name' },
            { title: 'City', dataIndex: 'city' },
            { title: 'Multiplier', dataIndex: 'multiplier', render: (m: number) => <Tag color="orange">{m}x</Tag> },
            { title: 'Demand', dataIndex: 'demand' },
            { title: 'Supply', dataIndex: 'supply' },
            { title: 'Active', dataIndex: 'active', render: (v: boolean) => <Switch checked={v} size="small" /> },
            createActionsColumn<SurgeZone>(
              () => getSurgeActionItems(),
              (key, record) => handleSurgeAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function PricingRulesPage() {
  useDocumentTitle('Pricing Rules')
  const adminActions = useAdminActions()
  const rules = [
    { name: 'Default Surge', demandThreshold: '80%', supplyThreshold: '40%', min: '1.2x', max: '3.5x' },
    { name: 'Airport Premium', demandThreshold: '70%', supplyThreshold: '50%', min: '1.5x', max: '4.0x' },
    { name: 'Event Surge', demandThreshold: '90%', supplyThreshold: '30%', min: '2.0x', max: '5.0x' },
  ]

  return (
    <PageShell title="Pricing Rules" description="Configure demand/supply thresholds and multiplier bounds.">
      <div className="glass-card p-4">
        <Table
          rowKey="name"
          dataSource={rules}
          {...createTableRowProps<{ name: string; demandThreshold: string; supplyThreshold: string; min: string; max: string }>((record) => openGenericDetails(record as Record<string, unknown>, adminActions, record.name))}
          columns={[
            { title: 'Rule', dataIndex: 'name' },
            { title: 'Demand Threshold', dataIndex: 'demandThreshold' },
            { title: 'Supply Threshold', dataIndex: 'supplyThreshold' },
            { title: 'Min Multiplier', dataIndex: 'min' },
            { title: 'Max Multiplier', dataIndex: 'max' },
            createActionsColumn<{ name: string; demandThreshold: string; supplyThreshold: string; min: string; max: string }>(
              () => getSurgeActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.name),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function SurgeHistoryPage() {
  useDocumentTitle('Surge History')
  const history = [
    { label: 'Mon', value: 2.1 },
    { label: 'Tue', value: 1.8 },
    { label: 'Wed', value: 2.4 },
    { label: 'Thu', value: 2.9 },
    { label: 'Fri', value: 3.2 },
    { label: 'Sat', value: 3.8 },
    { label: 'Sun', value: 2.5 },
  ]

  return (
    <PageShell title="Surge History" description="Historical surge multipliers and revenue impact analytics.">
      <ChartCard title="Average Surge Multiplier (7 days)">
        <BarTrendChart data={history} />
      </ChartCard>
    </PageShell>
  )
}

export default SurgeZonesPage
