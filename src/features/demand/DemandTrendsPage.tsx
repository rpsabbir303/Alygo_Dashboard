import { Table, Tag } from 'antd'
import { BarTrendChart, ChartCard, LineTrendChart } from '@/components/charts/AnalyticsCharts'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getReportActionItems,
  handleReportAction,
  openReportDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetDemandTrendQuery } from '@/services/api'

export function DemandTrendsPage() {
  useDocumentTitle('Demand Trends')
  const { data = [] } = useGetDemandTrendQuery()

  return (
    <PageShell title="Demand Trends" description="Analyze ride demand patterns across markets and time periods.">
      <ChartCard title="Hourly Demand">
        <LineTrendChart data={data} color="#22d3ee" />
      </ChartCard>
    </PageShell>
  )
}

export function DemandForecastingPage() {
  useDocumentTitle('Demand Forecasting')
  const forecast = [
    { label: 'Today', value: 4200 },
    { label: '+1 Day', value: 4450 },
    { label: '+2 Days', value: 4680 },
    { label: '+3 Days', value: 4100 },
    { label: '+4 Days', value: 3900 },
    { label: '+5 Days', value: 5200 },
    { label: '+6 Days', value: 6100 },
  ]

  return (
    <PageShell title="Demand Forecasting" description="ML-powered demand predictions for operational planning.">
      <ChartCard title="7-Day Demand Forecast">
        <BarTrendChart data={forecast} />
      </ChartCard>
    </PageShell>
  )
}

export function HeatMapsPage() {
  useDocumentTitle('Heat Maps')
  return (
    <PageShell title="Demand Heat Maps" description="Visualize high and low demand areas with Google Maps.">
      <div className="glass-card flex min-h-[420px] items-center justify-center p-8 text-alygo-text-muted">
        Heat map visualization — configure Google Maps API key
      </div>
    </PageShell>
  )
}

export function EarningsForecastsPage() {
  useDocumentTitle('Earnings Forecasts')
  const data = [
    { label: 'Mon', value: 180 },
    { label: 'Tue', value: 195 },
    { label: 'Wed', value: 188 },
    { label: 'Thu', value: 210 },
    { label: 'Fri', value: 265 },
    { label: 'Sat', value: 290 },
    { label: 'Sun', value: 220 },
  ]

  return (
    <PageShell title="Driver Earnings Forecasts" description="Predict driver earnings by market and time window.">
      <ChartCard title="Average Hourly Earnings Forecast ($)">
        <LineTrendChart data={data} color="#10b981" />
      </ChartCard>
    </PageShell>
  )
}

export function EventIntelligencePage() {
  useDocumentTitle('Event Intelligence')
  const adminActions = useAdminActions()
  const events = [
    { event: 'SF Tech Conference', size: '12,000', demand: 'High', surge: '2.8x', revenue: '$48,000' },
    { event: 'Lakers Game', size: '18,500', demand: 'Very High', surge: '3.2x', revenue: '$62,000' },
    { event: 'Music Festival', size: '45,000', demand: 'Critical', surge: '4.1x', revenue: '$128,000' },
  ]

  return (
    <PageShell title="Event Intelligence" description="Public event analysis with demand and surge recommendations.">
      <div className="glass-card p-4">
        <Table
          rowKey="event"
          dataSource={events}
          {...createTableRowProps<{ event: string; size: string; demand: string; surge: string; revenue: string }>((record) => openReportDetails(record as Record<string, unknown>, adminActions))}
          columns={[
            { title: 'Event', dataIndex: 'event' },
            { title: 'Expected Size', dataIndex: 'size' },
            { title: 'Predicted Demand', dataIndex: 'demand', render: (d: string) => <Tag color="orange">{d}</Tag> },
            { title: 'Surge Opportunity', dataIndex: 'surge' },
            { title: 'Expected Revenue', dataIndex: 'revenue' },
            createActionsColumn<{ event: string; size: string; demand: string; surge: string; revenue: string }>(
              () => getReportActionItems(),
              (key, record) => handleReportAction(key, record as Record<string, unknown>, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export default DemandTrendsPage
