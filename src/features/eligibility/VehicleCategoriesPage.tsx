import { Tag } from 'antd'
import { ActionMenu, AdminActionHost, getRideCategoryActionItems, handleGenericAction, openGenericDetails } from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { RideCategory } from '@/types'

const categories: RideCategory[] = ['standard', 'comfort', 'xl', 'pet', 'priority', 'black', 'black_suv']

export default function VehicleCategoriesPage() {
  useDocumentTitle('Vehicle Categories')
  const adminActions = useAdminActions()

  return (
    <PageShell title="Vehicle Categories" description="Manage ride category definitions and base requirements.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat}
            className="glass-card glass-card-hover cursor-pointer p-5"
            onClick={() => openGenericDetails({ category: RIDE_CATEGORY_LABELS[cat], status: 'Active' }, adminActions, `${RIDE_CATEGORY_LABELS[cat]} Category`)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{RIDE_CATEGORY_LABELS[cat]}</h3>
              <Tag color="blue">Active</Tag>
            </div>
            <p className="mt-2 text-sm text-alygo-text-muted">
              Configure eligibility, pricing, and availability rules for {RIDE_CATEGORY_LABELS[cat]} rides.
            </p>
            <div className="mt-4 flex justify-end" onClick={(e) => e.stopPropagation()}>
              <ActionMenu
                items={getRideCategoryActionItems()}
                onAction={(key) => handleGenericAction(key, { category: RIDE_CATEGORY_LABELS[cat] }, adminActions, RIDE_CATEGORY_LABELS[cat])}
              />
            </div>
          </div>
        ))}
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
