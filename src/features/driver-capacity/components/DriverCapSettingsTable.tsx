import { useState } from 'react'
import { Button, Table, Tag } from 'antd'
import { Plus } from 'lucide-react'
import {
  AdminActionHost,
  ConfirmationModal,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { CapacityRuleFormModal } from '@/features/driver-capacity/components/CapacityRuleFormModal'
import {
  buildCapacityRuleDetailFields,
  capacityDisplayStatusColor,
  CAPACITY_DISPLAY_STATUS_LABELS,
  getCapacityDisplayStatus,
  getCapacityRuleActionItems,
} from '@/features/driver-capacity/driverCapacityHelpers'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useCreateDriverCapSettingMutation,
  useDeleteDriverCapSettingMutation,
  useGetDriverCapSettingsQuery,
  useUpdateDriverCapSettingMutation,
} from '@/services/driverCapacityApi'
import type { DriverCapSetting } from '@/types/driverCapacity'
import type { CapacityRuleFormValues } from '@/types/driverCapacity'
import { formatNumber } from '@/utils/format'

export function DriverCapSettingsTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetDriverCapSettingsQuery()
  const [createRule, { isLoading: creating }] = useCreateDriverCapSettingMutation()
  const [updateRule, { isLoading: updating }] = useUpdateDriverCapSettingMutation()
  const [deleteRule, { isLoading: deleting }] = useDeleteDriverCapSettingMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editRecord, setEditRecord] = useState<DriverCapSetting | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<DriverCapSetting | null>(null)

  const openCreate = () => {
    setFormMode('create')
    setEditRecord(null)
    setFormOpen(true)
  }

  const openEdit = (record: DriverCapSetting) => {
    setFormMode('edit')
    setEditRecord(record)
    setFormOpen(true)
  }

  const handleFormSubmit = async (values: CapacityRuleFormValues) => {
    try {
      if (formMode === 'create') {
        await createRule(values).unwrap()
        adminActions.notify(`Capacity rule added for ${values.city}, ${values.state}`)
      } else if (editRecord) {
        await updateRule({ id: editRecord.id, ...values }).unwrap()
        adminActions.notify(`Capacity rule updated for ${editRecord.city}`)
      }
      setFormOpen(false)
      setEditRecord(null)
    } catch (err) {
      adminActions.notify('Unable to save capacity rule', String(err))
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-alygo-text-muted">
          Set maximum driver limits by city and state. Admins control capacity manually.
        </p>
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Capacity Rule
        </Button>
      </div>

      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        {...createTableRowProps<DriverCapSetting>((record) =>
          adminActions.openDrawer(`${record.city}, ${record.state}`, buildCapacityRuleDetailFields(record)),
        )}
        columns={[
          { title: 'State', dataIndex: 'state' },
          { title: 'City', dataIndex: 'city' },
          { title: 'Max Drivers', dataIndex: 'maxDrivers', render: (n: number) => formatNumber(n) },
          { title: 'Current Drivers', dataIndex: 'currentDrivers', render: (n: number) => formatNumber(n) },
          {
            title: 'Available Slots',
            dataIndex: 'remainingSlots',
            render: (n: number, record: DriverCapSetting) => (
              <span className={record.status === 'inactive' ? 'text-alygo-text-muted' : n === 0 ? 'text-red-400' : 'text-emerald-400'}>
                {formatNumber(n)}
              </span>
            ),
          },
          {
            title: 'Status',
            key: 'status',
            render: (_: unknown, record: DriverCapSetting) => {
              const displayStatus = getCapacityDisplayStatus(record)
              return (
                <Tag color={capacityDisplayStatusColor(displayStatus)}>
                  {CAPACITY_DISPLAY_STATUS_LABELS[displayStatus]}
                </Tag>
              )
            },
          },
          createActionsColumn<DriverCapSetting>(
            () => getCapacityRuleActionItems(),
            (key, record) => {
              if (key === 'edit') openEdit(record)
              if (key === 'delete') setDeleteRecord(record)
            },
          ),
        ]}
      />

      <CapacityRuleFormModal
        open={formOpen}
        mode={formMode}
        rule={editRecord}
        loading={creating || updating}
        onCancel={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmationModal
        open={Boolean(deleteRecord)}
        title="Delete Capacity Rule"
        description={`Delete the capacity rule for ${deleteRecord?.city}, ${deleteRecord?.state}?`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={async () => {
          if (!deleteRecord) return
          try {
            await deleteRule(deleteRecord.id).unwrap()
            adminActions.notify(`Capacity rule deleted for ${deleteRecord.city}`)
            setDeleteRecord(null)
          } catch (err) {
            adminActions.notify('Unable to delete rule', String(err))
          }
        }}
      />

      <AdminActionHost actions={adminActions} />
    </>
  )
}
