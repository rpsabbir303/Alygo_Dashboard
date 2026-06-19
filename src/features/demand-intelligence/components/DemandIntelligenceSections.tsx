import { useMemo, useState } from 'react'
import { Segmented, Table, Tag } from 'antd'
import { Eye } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  openReportDetails,
} from '@/components/admin'
import { RevenueTrendChart, ChartCard } from '@/components/charts/AnalyticsCharts'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  DEMAND_EVENTS,
  DEMAND_OVERVIEW,
  DRIVER_EARNINGS_IMPACT,
  FORECAST_DATA,
  FORECAST_RANGE_LABELS,
  TOP_DEMAND_ZONES,
  type ForecastRange,
} from '@/features/demand-intelligence/demandIntelligenceData'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetDashboardKpisQuery,
  useGetReservationsQuery,
  useGetSurgeZonesQuery,
  useGetTripsQuery,
} from '@/services/api'
import { formatCurrency } from '@/utils/format'

export function DemandOverviewCards() {
  const metrics = [
    { label: 'Current Active Requests', value: DEMAND_OVERVIEW.currentActiveRequests.toLocaleString() },
    { label: 'Forecasted Requests (24h)', value: DEMAND_OVERVIEW.forecastedRequests24h.toLocaleString() },
    { label: 'High Demand Zones', value: DEMAND_OVERVIEW.highDemandZones.toString() },
    { label: 'Active Surge Zones', value: DEMAND_OVERVIEW.activeSurgeZones.toString() },
    { label: 'Upcoming Events', value: DEMAND_OVERVIEW.upcomingEvents.toString() },
    { label: 'Revenue Impact', value: DEMAND_OVERVIEW.revenueImpact },
    { label: 'Average ETA', value: DEMAND_OVERVIEW.averageEta },
    { label: 'Available Drivers', value: DEMAND_OVERVIEW.availableDrivers.toLocaleString() },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {metrics.map((m) => (
        <div key={m.label} className="glass-card p-4">
          <p className="text-xs text-alygo-text-muted">{m.label}</p>
          <p className="mt-2 text-xl font-semibold text-white">{m.value}</p>
        </div>
      ))}
    </div>
  )
}

export function DemandForecastSection() {
  const [range, setRange] = useState<ForecastRange>('24h')

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Demand Forecasting</h3>
          <p className="text-xs text-alygo-text-muted">
            Current vs predicted demand — prepare driver capacity ahead of spikes
          </p>
        </div>
        <Segmented
          value={range}
          onChange={(v) => setRange(v as ForecastRange)}
          options={Object.entries(FORECAST_RANGE_LABELS).map(([value, label]) => ({ value, label }))}
        />
      </div>
      <ChartCard title="Current Demand vs Predicted Demand" subtitle={`Range: ${FORECAST_RANGE_LABELS[range]}`} className="!border-none !bg-transparent !p-0">
        <RevenueTrendChart data={FORECAST_DATA[range]} />
      </ChartCard>
    </div>
  )
}

export function EventImpactSection() {
  const adminActions = useAdminActions()

  return (
    <div className="glass-card p-5">
      <h3 className="mb-4 text-base font-semibold text-white">Event Impact Center</h3>
      <Table
        rowKey="id"
        dataSource={DEMAND_EVENTS}
        scroll={{ x: 1100 }}
        pagination={false}
        {...createTableRowProps<(typeof DEMAND_EVENTS)[0]>((record) =>
          openReportDetails(record as unknown as Record<string, unknown>, adminActions),
        )}
        columns={[
          { title: 'Event Name', dataIndex: 'eventName' },
          { title: 'Location', dataIndex: 'location' },
          { title: 'Date', dataIndex: 'date' },
          {
            title: 'Expected Attendance',
            dataIndex: 'expectedAttendance',
            render: (n: number) => n.toLocaleString(),
          },
          {
            title: 'Predicted Demand Impact',
            dataIndex: 'predictedDemandImpact',
            render: (d: string) => <Tag color="orange">{d}</Tag>,
          },
          { title: 'Recommended Surge', dataIndex: 'recommendedSurge' },
          {
            title: 'Est. Revenue Impact',
            dataIndex: 'estimatedRevenueImpact',
            render: (v: number) => formatCurrency(v),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          createActionsColumn<(typeof DEMAND_EVENTS)[0]>(
            () => [{ key: 'view', label: 'View Details', icon: Eye, group: 0 }],
            (key, record) => {
              if (key === 'view') {
                openReportDetails(
                  {
                    event: record.eventName,
                    location: record.location,
                    demand: record.predictedDemandImpact,
                    surge: record.recommendedSurge,
                    revenue: formatCurrency(record.estimatedRevenueImpact),
                  },
                  adminActions,
                )
              }
            },
          ),
        ]}
      />
      <AdminActionHost actions={adminActions} />
    </div>
  )
}

export function DriverEarningsSection() {
  const impact = DRIVER_EARNINGS_IMPACT
  const cards = [
    { label: 'Current Avg Earnings', value: `$${impact.currentAvgEarnings}/hr` },
    { label: 'Forecast Avg Earnings', value: `$${impact.forecastAvgEarnings}/hr` },
    { label: 'Revenue Increase', value: impact.revenueIncrease },
    { label: 'Best Performing Market', value: impact.bestPerformingMarket },
    { label: 'Highest Surge Zone', value: impact.highestSurgeZone },
  ]

  return (
    <div className="glass-card p-5">
      <h3 className="mb-4 text-base font-semibold text-white">Driver Earnings Impact</h3>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Operational earnings impact under current demand conditions — use for supply incentives and market focus.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs text-alygo-text-muted">{c.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TopDemandZonesSection() {
  return (
    <div className="glass-card p-5">
      <h3 className="mb-4 text-base font-semibold text-white">Top Demand Zones</h3>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Highest-demand zones right now — use for dispatch prioritization and supply allocation.
      </p>
      <Table
        rowKey="id"
        dataSource={TOP_DEMAND_ZONES}
        pagination={false}
        scroll={{ x: 800 }}
        columns={[
          { title: 'Zone', dataIndex: 'zone' },
          {
            title: 'Active Requests',
            dataIndex: 'activeRequests',
            render: (n: number) => n.toLocaleString(),
          },
          {
            title: 'Available Drivers',
            dataIndex: 'availableDrivers',
            render: (n: number) => n.toLocaleString(),
          },
          {
            title: 'Demand Ratio',
            dataIndex: 'demandRatio',
            render: (r: number) => (
              <Tag color={r >= 3 ? 'red' : r >= 2 ? 'orange' : 'default'}>{r.toFixed(2)}:1</Tag>
            ),
          },
          { title: 'Average ETA', dataIndex: 'averageEta' },
        ]}
      />
    </div>
  )
}

export function OperationalSnapshotSection() {
  const { data: kpis = [] } = useGetDashboardKpisQuery()
  const { data: activeTrips = [] } = useGetTripsQuery({ status: 'in_progress' })
  const { data: reservations = [] } = useGetReservationsQuery()
  const { data: surgeZones = [] } = useGetSurgeZonesQuery()

  const metrics = useMemo(() => {
    const activeTripsKpi = kpis.find((k) => k.key === 'activeTrips')?.value
    const airportQueueKpi = kpis.find((k) => k.key === 'airportQueue')?.value
    const pendingReservations = reservations.filter((r) => r.status === 'pending').length
    const activeSurgeCount = surgeZones.filter((z) => z.active).length

    return [
      {
        label: 'Online Drivers',
        value: DEMAND_OVERVIEW.availableDrivers.toLocaleString(),
      },
      {
        label: 'Active Trips',
        value: (activeTrips.length || activeTripsKpi || 0).toLocaleString(),
      },
      {
        label: 'Pending Reservations',
        value: pendingReservations.toLocaleString(),
      },
      {
        label: 'Average ETA',
        value: DEMAND_OVERVIEW.averageEta,
      },
      {
        label: 'Airport Queue Size',
        value: (airportQueueKpi ?? 0).toLocaleString(),
      },
      {
        label: 'Active Surge Zones',
        value: activeSurgeCount.toLocaleString(),
      },
    ]
  }, [activeTrips.length, kpis, reservations, surgeZones])

  return (
    <div className="glass-card p-5">
      <h3 className="mb-4 text-base font-semibold text-white">Operational Snapshot</h3>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Live platform status — driver supply, trip volume, reservations, and surge activity.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs text-alygo-text-muted">{m.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
