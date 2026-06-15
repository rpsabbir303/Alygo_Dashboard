import { Tag } from 'antd'
import { MapPin } from 'lucide-react'
import { ActionMenu, AdminActionHost, getTripActionItems, handleTripAction, openTripDetails } from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { GOOGLE_MAPS_API_KEY } from '@/constants'
import { useGetTripsQuery } from '@/services/api'

export default function RideMonitoringPage() {
  useDocumentTitle('Ride Monitoring')
  const adminActions = useAdminActions()
  const { data: trips = [] } = useGetTripsQuery({ status: 'in_progress' })

  return (
    <PageShell title="Ride Monitoring" description="Live map view of in-progress trips across all markets.">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="glass-card min-h-[480px] p-5 xl:col-span-2">
          {GOOGLE_MAPS_API_KEY ? (
            <div className="flex h-full items-center justify-center text-alygo-text-muted">
              Google Maps integration ready — set VITE_GOOGLE_MAPS_API_KEY
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <MapPin className="h-12 w-12 text-indigo-400" />
              <p className="text-white">Map visualization</p>
              <p className="max-w-md text-sm text-alygo-text-muted">
                Configure VITE_GOOGLE_MAPS_API_KEY to enable live trip monitoring with React Google Maps.
              </p>
              <div className="mt-4 grid w-full grid-cols-3 gap-2">
                {[
                  { city: 'SF', trips: 68 },
                  { city: 'LA', trips: 94 },
                  { city: 'NYC', trips: 112 },
                ].map(({ city, trips: count }) => (
                  <div key={city} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                    <p className="text-2xl font-semibold text-white">{count}</p>
                    <p className="text-xs text-alygo-text-muted">{city} active trips</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-4 font-semibold text-white">In Progress ({trips.length})</h3>
          <div className="space-y-3">
            {trips.slice(0, 8).map((trip) => (
              <div
                key={trip.id}
                className="cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] p-3"
                onClick={() => openTripDetails(trip, adminActions)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{trip.id}</span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Tag>{trip.category}</Tag>
                    <ActionMenu
                      items={getTripActionItems()}
                      onAction={(key) => handleTripAction(key, trip, adminActions)}
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-alygo-text-muted">{trip.driverName} → {trip.passengerName}</p>
                <p className="mt-1 text-xs text-slate-500">{trip.city}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
