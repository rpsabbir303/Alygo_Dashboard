import { Car, Clock, Users, UserPlus } from 'lucide-react'
import { useGetCapacityOverviewQuery } from '@/services/driverCapacityApi'
import { formatNumber } from '@/utils/format'

const overviewConfig = [
  { key: 'activeDrivers', label: 'Active Drivers', icon: Car },
  { key: 'availableCapacity', label: 'Available Capacity', icon: UserPlus },
  { key: 'waitlistedDrivers', label: 'Waitlisted Drivers', icon: Users },
  { key: 'pendingApprovals', label: 'Pending Approvals', icon: Clock },
] as const

export function CapacityOverviewCards() {
  const { data, isLoading } = useGetCapacityOverviewQuery()

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
      {overviewConfig.map(({ key, label, icon: Icon }) => (
        <div key={key} className="glass-card p-5">
          <div className="rounded-xl bg-indigo-500/10 p-2.5 w-fit">
            <Icon className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-alygo-text-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {formatNumber(data[key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
