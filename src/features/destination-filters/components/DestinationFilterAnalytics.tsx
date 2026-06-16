import {
  BarTrendChart,
  ChartCard,
  LineTrendChart,
} from '@/components/charts/AnalyticsCharts'
import { useGetDestinationFilterAnalyticsQuery } from '@/services/destinationFilterApi'

export function DestinationFilterAnalytics() {
  const { data, isLoading } = useGetDestinationFilterAnalyticsQuery()

  if (isLoading || !data) {
    return <div className="glass-card p-8 text-center text-alygo-text-muted">Loading analytics...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Filter Usage" subtitle="Daily filter activations">
        <LineTrendChart data={data.filterUsage} />
      </ChartCard>
      <ChartCard title="Acceptance Rate" subtitle="By driver tier (%)">
        <BarTrendChart data={data.acceptanceRate} />
      </ChartCard>
      <ChartCard title="Driver Productivity" subtitle="Trips per hour by tier">
        <BarTrendChart data={data.driverProductivity} />
      </ChartCard>
      <ChartCard title="Usage by Tier" subtitle="Total filter usage">
        <BarTrendChart data={data.usageByTier} />
      </ChartCard>
    </div>
  )
}
