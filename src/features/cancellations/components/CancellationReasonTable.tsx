import { useState } from 'react'
import { Button, Table } from 'antd'
import { Plus } from 'lucide-react'
import {
  AdminActionHost,
  ConfirmationModal,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useCreateCancellationReasonMutation,
  useDeleteCancellationReasonMutation,
  useGetDriverCancellationReasonsQuery,
  useGetPassengerCancellationReasonsQuery,
  useToggleCancellationReasonStatusMutation,
  useUpdateCancellationReasonMutation,
} from '@/services/cancellationApi'
import type { CancellationReason, CancellationReasonType } from '@/types/cancellation'
import {
  buildReasonDetailFields,
  getReasonActionItems,
  openPolicyDrawer,
} from '@/features/cancellations/cancellationHelpers'
import { CreateReasonModal, EditReasonModal } from '@/features/cancellations/components/ReasonFormModal'

interface CancellationReasonTableProps {
  type: CancellationReasonType
  typeLabel: string
}

export function CancellationReasonTable({ type, typeLabel }: CancellationReasonTableProps) {
  const adminActions = useAdminActions()
  const passengerQuery = useGetPassengerCancellationReasonsQuery(undefined, { skip: type !== 'passenger' })
  const driverQuery = useGetDriverCancellationReasonsQuery(undefined, { skip: type !== 'driver' })
  const { data = [], isLoading } = type === 'passenger' ? passengerQuery : driverQuery

  const [createOpen, setCreateOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<CancellationReason | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<CancellationReason | null>(null)

  const [createReason, { isLoading: creating }] = useCreateCancellationReasonMutation()
  const [updateReason, { isLoading: updating }] = useUpdateCancellationReasonMutation()
  const [toggleStatus] = useToggleCancellationReasonStatusMutation()
  const [deleteReason, { isLoading: deleting }] = useDeleteCancellationReasonMutation()

  const handleAction = (key: string, record: CancellationReason) => {
    switch (key) {
      case 'view':
        openPolicyDrawer(
          `${typeLabel} Cancellation Reason`,
          buildReasonDetailFields(record, typeLabel),
          adminActions,
        )
        break
      case 'edit':
        setEditRecord(record)
        break
      case 'activate':
        toggleStatus({ type, id: record.id, status: 'active' }).unwrap()
          .then(() => adminActions.notify('Reason activated'))
        break
      case 'deactivate':
        toggleStatus({ type, id: record.id, status: 'inactive' }).unwrap()
          .then(() => adminActions.notify('Reason deactivated'))
        break
      case 'delete':
        setDeleteRecord(record)
        break
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Add New Reason
        </Button>
      </div>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        {...createTableRowProps<CancellationReason>((record) =>
          openPolicyDrawer(
            `${typeLabel} Cancellation Reason`,
            buildReasonDetailFields(record, typeLabel),
            adminActions,
          ),
        )}
        columns={[
          { title: 'Reason Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description', ellipsis: true },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          ...(type === 'passenger'
            ? [{ title: 'Created Date', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString() }]
            : []),
          createActionsColumn<CancellationReason>(
            (record) => getReasonActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      <CreateReasonModal
        open={createOpen}
        typeLabel={typeLabel}
        confirmLoading={creating}
        onCancel={() => setCreateOpen(false)}
        onSubmit={async (values) => {
          await createReason({ type, ...values }).unwrap()
          adminActions.notify('Cancellation reason created')
          setCreateOpen(false)
        }}
      />

      {editRecord && (
        <EditReasonModal
          open={Boolean(editRecord)}
          typeLabel={typeLabel}
          initialValues={{ name: editRecord.name, description: editRecord.description }}
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onSubmit={async (values) => {
            await updateReason({ type, id: editRecord.id, ...values }).unwrap()
            adminActions.notify('Cancellation reason updated')
            setEditRecord(null)
          }}
        />
      )}

      <ConfirmationModal
        open={Boolean(deleteRecord)}
        title="Delete Cancellation Reason"
        description={`Are you sure you want to delete "${deleteRecord?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={async () => {
          if (!deleteRecord) return
          await deleteReason({ type, id: deleteRecord.id }).unwrap()
          adminActions.notify('Cancellation reason deleted')
          setDeleteRecord(null)
        }}
      />

      <AdminActionHost actions={adminActions} />
    </>
  )
}
