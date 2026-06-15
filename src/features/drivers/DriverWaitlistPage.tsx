import { Table, Tag } from 'antd'
import { BarTrendChart, ChartCard } from '@/components/charts/AnalyticsCharts'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getActiveDriverActionItems,
  handleDriverAction,
  openGenericDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { Driver } from '@/types'

const waitlistData = [
  { label: 'CA', value: 420 },
  { label: 'NY', value: 380 },
  { label: 'TX', value: 290 },
  { label: 'FL', value: 210 },
  { label: 'WA', value: 180 },
]

const queueData = [
  { state: 'California', city: 'San Francisco', airport: 'SFO', count: 142, forecast: '+12%' },
  { state: 'New York', city: 'New York', airport: 'JFK', count: 198, forecast: '+8%' },
  { state: 'Texas', city: 'Austin', airport: '-', count: 86, forecast: '+15%' },
]

export default function DriverWaitlistPage() {
  useDocumentTitle('Driver Waitlist')
  const adminActions = useAdminActions()

  return (
    <PageShell
      title="Driver Waitlist System"
      description="Manage supply and demand with waitlist analytics, approval queues, and supply forecasting."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass-card p-5">
          <p className="text-sm text-alygo-text-muted">Total Waitlist</p>
          <p className="mt-2 text-3xl font-semibold text-white">1,842</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-alygo-text-muted">Approval Queue</p>
          <p className="mt-2 text-3xl font-semibold text-white">47</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-alygo-text-muted">Supply Forecast (30d)</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">+18%</p>
        </div>
      </div>

      <ChartCard title="Waitlist by State">
        <BarTrendChart data={waitlistData} />
      </ChartCard>

      <div className="glass-card p-4">
        <h3 className="mb-4 text-base font-semibold text-white">Waitlist by City & Airport</h3>
        <Table
          rowKey="city"
          dataSource={queueData}
          {...createTableRowProps<{ state: string; city: string; airport: string; count: number; forecast: string }>((record) => openGenericDetails(record as Record<string, unknown>, adminActions, record.city))}
          columns={[
            { title: 'State', dataIndex: 'state' },
            { title: 'City', dataIndex: 'city' },
            { title: 'Airport', dataIndex: 'airport' },
            { title: 'Waitlist Count', dataIndex: 'count' },
            { title: 'Supply Forecast', dataIndex: 'forecast', render: (v: string) => <Tag color="green">{v}</Tag> },
            createActionsColumn<{ state: string; city: string; airport: string; count: number; forecast: string }>(
              () => getActiveDriverActionItems(),
              (key, record) => handleDriverAction(key, record as unknown as Driver, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
