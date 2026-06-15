import { Switch, Tag } from 'antd'
import { useParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { RideCategory } from '@/types'

export default function CategoryDetailPage() {
  const { category = 'standard' } = useParams()
  const rideCategory = category as RideCategory
  const label = RIDE_CATEGORY_LABELS[rideCategory] ?? category
  useDocumentTitle(`${label} Category`)

  return (
    <PageShell title={`${label} Ride Category`} description="Manage category requirements, pricing, availability, and location rules.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-white">Category Controls</h3>
          <div className="flex items-center justify-between"><span className="text-alygo-text-muted">Availability</span><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><span className="text-alygo-text-muted">State Rules</span><Tag color="green">12 states</Tag></div>
          <div className="flex items-center justify-between"><span className="text-alygo-text-muted">City Rules</span><Tag color="blue">48 cities</Tag></div>
          <div className="flex items-center justify-between"><span className="text-alygo-text-muted">Airport Rules</span><Tag color="purple">22 airports</Tag></div>
        </div>
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-semibold text-white">Pricing & Requirements</h3>
          <p className="text-sm text-alygo-text-muted">Base fare multiplier: {rideCategory === 'black' || rideCategory === 'black_suv' ? '2.5x' : '1.0x'}</p>
          <p className="text-sm text-alygo-text-muted">Minimum vehicle year: {rideCategory === 'black' ? '2019' : '2015'}</p>
          <p className="text-sm text-alygo-text-muted">Minimum driver rating: {rideCategory === 'black' ? '4.8' : '4.5'}</p>
          <p className="text-sm text-alygo-text-muted">Commercial insurance: {['black', 'black_suv'].includes(rideCategory) ? 'Required' : 'Optional'}</p>
        </div>
      </div>
    </PageShell>
  )
}
