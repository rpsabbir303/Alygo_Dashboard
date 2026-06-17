import { AlertTriangle, Car, CheckCircle, Shield, Users } from 'lucide-react'
import { useGetSafetyOverviewQuery } from '@/services/safetyIncidentApi'
import { formatNumber } from '@/utils/format'

const overviewConfig: Array<{
  key: keyof import('@/types/safetyIncident').SafetyOverview
  label: string
  icon: typeof Shield
}> = [
  { key: 'openIncidents', label: 'Open Incidents', icon: AlertTriangle },
  { key: 'resolvedCases', label: 'Resolved Cases', icon: CheckCircle },
  { key: 'sosAlerts', label: 'SOS Alerts', icon: Shield },
  { key: 'driverReports', label: 'Driver Reports', icon: Car },
  { key: 'passengerReports', label: 'Passenger Reports', icon: Users },
]

export function SafetyOverviewCards() {
  const { data, isLoading } = useGetSafetyOverviewQuery()

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card h-28 animate-pulse p-5" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
