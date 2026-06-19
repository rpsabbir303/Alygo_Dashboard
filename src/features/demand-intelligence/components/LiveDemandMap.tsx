import { useState } from 'react'
import { Tag } from 'antd'
import {
  Car,
  MapPin,
  Plane,
  Radio,
  Ticket,
  Users,
  Zap,
} from 'lucide-react'
import { GOOGLE_MAPS_API_KEY } from '@/constants'
import {
  MAP_FILTER_OPTIONS,
  type MapFilter,
} from '@/features/demand-intelligence/demandIntelligenceData'

const FILTER_ICONS: Record<MapFilter, typeof Car> = {
  Drivers: Car,
  Passengers: Users,
  Heatmap: Radio,
  Surge: Zap,
  Events: Ticket,
  Reservations: MapPin,
  Airports: Plane,
}

export function LiveDemandMap() {
  const [filters, setFilters] = useState<MapFilter[]>(['Drivers', 'Heatmap', 'Surge'])

  const toggleFilter = (filter: MapFilter) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Live Demand Map</h3>
          <p className="text-xs text-alygo-text-muted">
            Real-time operational view — drivers, requests, surge, events, and demand heatmap
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {MAP_FILTER_OPTIONS.map((filter) => {
            const Icon = FILTER_ICONS[filter]
            const active = filters.includes(filter)
            return (
              <Tag
                key={filter}
                className={`cursor-pointer select-none ${active ? '!border-indigo-500 !bg-indigo-500/20 !text-indigo-300' : ''}`}
                onClick={() => toggleFilter(filter)}
              >
                <Icon className="mr-1 inline h-3 w-3" />
                {filter}
              </Tag>
            )
          })}
        </div>
      </div>

      <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-white/5 bg-[#0a0c10]">
        {GOOGLE_MAPS_API_KEY ? (
          <div className="flex h-[420px] items-center justify-center text-alygo-text-muted">
            Google Maps operational layer — configure VITE_GOOGLE_MAPS_API_KEY
          </div>
        ) : (
          <div className="relative h-[420px] p-6">
            <div className="absolute inset-0 opacity-30">
              <div className="grid h-full grid-cols-6 grid-rows-4 gap-1 p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{
                      backgroundColor: `rgba(99, 102, 241, ${0.05 + (i % 5) * 0.08})`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-alygo-text-muted">
                  Active layers: {filters.join(', ') || 'None'}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {filters.includes('Drivers') && (
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                    <Car className="mb-1 h-4 w-4 text-blue-400" />
                    <p className="text-lg font-semibold text-white">3,982</p>
                    <p className="text-xs text-alygo-text-muted">Available drivers</p>
                  </div>
                )}
                {filters.includes('Passengers') && (
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
                    <Users className="mb-1 h-4 w-4 text-cyan-400" />
                    <p className="text-lg font-semibold text-white">4,892</p>
                    <p className="text-xs text-alygo-text-muted">Active requests</p>
                  </div>
                )}
                {filters.includes('Surge') && (
                  <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
                    <Zap className="mb-1 h-4 w-4 text-orange-400" />
                    <p className="text-lg font-semibold text-white">5</p>
                    <p className="text-xs text-alygo-text-muted">Active surge zones</p>
                  </div>
                )}
                {filters.includes('Airports') && (
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
                    <Plane className="mb-1 h-4 w-4 text-purple-400" />
                    <p className="text-lg font-semibold text-white">311</p>
                    <p className="text-xs text-alygo-text-muted">Airport queue</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.includes('Heatmap') && (
                  <Tag color="processing">Heatmap: High demand SF, LAX, NYC cores</Tag>
                )}
                {filters.includes('Events') && (
                  <Tag color="orange">Events: Tech Conference, NBA Finals prep</Tag>
                )}
                {filters.includes('Reservations') && (
                  <Tag color="blue">Reservations: 156 scheduled in next 2h</Tag>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
