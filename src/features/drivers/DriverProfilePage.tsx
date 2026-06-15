import { Button, Descriptions, Tabs, Table, Tag } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { AdminActionHost } from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetDriverByIdQuery } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/format'

export default function DriverProfilePage() {
  const { id = '' } = useParams()
  const adminActions = useAdminActions()
  const { data: driver, isLoading } = useGetDriverByIdQuery(id)
  useDocumentTitle(driver ? `${driver.name} - Driver Profile` : 'Driver Profile')

  if (isLoading) return null
  if (!driver) {
    return (
      <PageShell title="Driver Not Found">
        <Link to="/drivers"><Button icon={<ArrowLeft className="h-4 w-4" />}>Back to Drivers</Button></Link>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={driver.name}
      description={`Driver ID: ${driver.id}`}
      actions={
        <SpaceActions driver={driver} adminActions={adminActions} />
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-1">
          <Descriptions column={1} size="small" title="Personal Information">
            <Descriptions.Item label="Email">{driver.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{driver.phone}</Descriptions.Item>
            <Descriptions.Item label="City">{driver.city}, {driver.state}</Descriptions.Item>
            <Descriptions.Item label="Joined">{formatDate(driver.joinedAt)}</Descriptions.Item>
            <Descriptions.Item label="Rating">{driver.rating} ★</Descriptions.Item>
            <Descriptions.Item label="Status"><StatusBadge status={driver.status} /></Descriptions.Item>
          </Descriptions>
        </div>
        <div className="glass-card p-5 lg:col-span-2">
          <Tabs
            items={[
              {
                key: 'vehicle',
                label: 'Vehicle Information',
                children: (
                  <Descriptions column={2}>
                    <Descriptions.Item label="Vehicle">{driver.vehicle}</Descriptions.Item>
                    <Descriptions.Item label="Year">{driver.vehicleYear}</Descriptions.Item>
                    <Descriptions.Item label="Categories">
                      {driver.categories.map((c) => <Tag key={c}>{RIDE_CATEGORY_LABELS[c]}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Earnings">{formatCurrency(driver.earnings)}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'documents',
                label: 'Documents',
                children: <Table size="small" pagination={false} dataSource={[]} locale={{ emptyText: 'Document records loaded from compliance module' }} />,
              },
              {
                key: 'trips',
                label: 'Trip History',
                children: <Table size="small" pagination={false} dataSource={[]} locale={{ emptyText: 'Trip history available via operations module' }} />,
              },
              {
                key: 'compliance',
                label: 'Compliance History',
                children: (
                  <Descriptions column={1}>
                    <Descriptions.Item label="Compliance"><StatusBadge status={driver.complianceStatus} /></Descriptions.Item>
                    <Descriptions.Item label="Background Check"><StatusBadge status={driver.backgroundCheckStatus} /></Descriptions.Item>
                  </Descriptions>
                ),
              },
            ]}
          />
        </div>
      </div>
      <Link to="/drivers"><Button icon={<ArrowLeft className="h-4 w-4" />}>Back to Drivers</Button></Link>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

function SpaceActions({
  driver,
  adminActions,
}: {
  driver: NonNullable<ReturnType<typeof useGetDriverByIdQuery>['data']>
  adminActions: ReturnType<typeof useAdminActions>
}) {
  return (
    <div className="flex gap-2">
      <Button onClick={() => adminActions.openApproval({
        title: 'Approve Driver',
        entityLabel: driver.name,
        onApprove: async () => adminActions.notify('Driver approved', driver.name),
      })}>Approve</Button>
      <Button danger onClick={() => adminActions.openSuspension({
        title: 'Suspend Driver',
        entityLabel: `Suspend ${driver.name}`,
        onConfirm: async () => adminActions.notify('Driver suspended', driver.name),
      })}>Suspend</Button>
      <Button type="primary" onClick={() => adminActions.openConfirm({
        title: 'Reactivate Driver',
        description: `Restore access for ${driver.name}?`,
        confirmLabel: 'Reactivate',
        onConfirm: async () => adminActions.notify('Driver reactivated', driver.name),
      })}>Reactivate</Button>
    </div>
  )
}
