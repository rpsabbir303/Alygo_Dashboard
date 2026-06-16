import { Filter, Percent, Target, TrendingUp } from 'lucide-react'
import { useGetDestinationFilterOverviewQuery } from '@/services/destinationFilterApi'
import { formatNumber } from '@/utils/format'

const overviewConfig = [
  { key: 'totalActiveFilters', label: 'Total Active Filters', icon: Filter, format: 'number' as const },
  { key: 'filtersUsedToday', label: 'Filters Used Today', icon: Target, format: 'number' as const },
  { key: 'averageAcceptanceRate', label: 'Avg Acceptance Rate', icon: Percent, format: 'percent' as const },
  { key: 'averageProductivity', label: 'Avg Productivity', icon: TrendingUp, format: 'decimal' as const },
] as const

export function DestinationFilterOverviewCards() {
  const { data, isLoading } = useGetDestinationFilterOverviewQuery()

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card h-28 animate-pulse p-5" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewConfig.map(({ key, label, icon: Icon, format }) => {
        const raw = data[key]
        const display =
          format === 'percent' ? `${raw}%` : format === 'decimal' ? raw.toFixed(1) : formatNumber(raw)
        return (
          <div key={key} className="glass-card p-5">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 w-fit">
              <Icon className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-alygo-text-muted">{label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{display}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
