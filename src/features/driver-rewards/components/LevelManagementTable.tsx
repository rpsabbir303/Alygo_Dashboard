import { useState } from 'react'
import { Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useDuplicateDriverLevelMutation,
  useGetDriverLevelsQuery,
  useUpdateDriverLevelMutation,
} from '@/services/driverRewardsApi'
import type { DriverLevel } from '@/types/driverRewards'
import {
  buildLevelDetailFields,
  getTierActionItems,
  openRewardsDrawer,
} from '@/features/driver-rewards/driverRewardsHelpers'
import { TierFormDrawer } from '@/features/driver-rewards/components/TierFormDrawer'
import { useDriverRewardsPermissions } from '@/features/driver-rewards/hooks/useDriverRewardsPermissions'

export function TierManagementTable() {
  const adminActions = useAdminActions()
  const { canManage } = useDriverRewardsPermissions()
  const { data = [], isLoading } = useGetDriverLevelsQuery()
  const [editRecord, setEditRecord] = useState<DriverLevel | null>(null)
  const [updateLevel, { isLoading: updating }] = useUpdateDriverLevelMutation()
  const [duplicateLevel] = useDuplicateDriverLevelMutation()

  const handleAction = (key: string, record: DriverLevel) => {
    if (!canManage) return
    switch (key) {
      case 'view':
        openRewardsDrawer('Driver Tier', buildLevelDetailFields(record), adminActions)
        break
      case 'edit':
        setEditRecord(record)
        break
      case 'duplicate':
        duplicateLevel(record.id).unwrap().then(() => adminActions.notify('Tier duplicated'))
        break
      case 'activate':
        updateLevel({ id: record.id, status: 'active' }).unwrap()
          .then(() => adminActions.notify('Tier activated'))
        break
      case 'deactivate':
        updateLevel({ id: record.id, status: 'inactive' }).unwrap()
          .then(() => adminActions.notify('Tier deactivated'))
        break
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1400 }}
        {...createTableRowProps<DriverLevel>((record) =>
          openRewardsDrawer('Driver Tier', buildLevelDetailFields(record), adminActions),
        )}
        columns={[
          {
            title: 'Tier Name',
            dataIndex: 'label',
            render: (label: string, record: DriverLevel) => (
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold text-white"
                  style={{ backgroundColor: record.tierColor }}
                >
                  {record.tierBadge}
                </span>
                {label}
              </span>
            ),
          },
          { title: 'Required Points', dataIndex: 'requiredPoints' },
          { title: 'Required Rating', dataIndex: 'requiredRating' },
          { title: 'Required Trips', dataIndex: 'requiredTrips' },
          { title: 'Required Online Hours', dataIndex: 'requiredOnlineHours' },
          { title: 'Acceptance Rate', dataIndex: 'requiredAcceptanceRate', render: (v: number) => `${v}%` },
          { title: 'Completion Rate', dataIndex: 'requiredCompletionRate', render: (v: number) => `${v}%` },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          ...(canManage
            ? [
                createActionsColumn<DriverLevel>(
                  (record) => getTierActionItems(record),
                  (key, record) => handleAction(key, record),
                ),
              ]
            : []),
        ]}
      />

      {editRecord && (
        <TierFormDrawer
          open
          title={`Edit Tier — ${editRecord.label}`}
          initialValues={editRecord}
          confirmLoading={updating}
          onClose={() => setEditRecord(null)}
          onSubmit={async (values) => {
            await updateLevel({ id: editRecord.id, ...values }).unwrap()
            adminActions.notify('Tier updated')
            setEditRecord(null)
          }}
        />
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}

export const LevelManagementTable = TierManagementTable
