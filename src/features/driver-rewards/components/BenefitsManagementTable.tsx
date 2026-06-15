import { useState } from 'react'
import { Button, Form, Input, Modal, Select, Table, Tag } from 'antd'
import { Plus } from 'lucide-react'
import {
  AdminActionHost,
  ConfirmationModal,
  createActionsColumn,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  LEVEL_OPTIONS,
  useCreateLevelBenefitMutation,
  useDeleteLevelBenefitMutation,
  useGetLevelBenefitsQuery,
  useUpdateLevelBenefitMutation,
} from '@/services/driverRewardsApi'
import type { DriverLevelName, LevelBenefit } from '@/types/driverRewards'
import { getBenefitActionItems, levelLabel } from '@/features/driver-rewards/driverRewardsHelpers'
import { useDriverRewardsPermissions } from '@/features/driver-rewards/hooks/useDriverRewardsPermissions'

export function BenefitsManagementTable() {
  const adminActions = useAdminActions()
  const { canManage } = useDriverRewardsPermissions()
  const { data = [], isLoading } = useGetLevelBenefitsQuery()
  const [createOpen, setCreateOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<LevelBenefit | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<LevelBenefit | null>(null)

  const [createBenefit, { isLoading: creating }] = useCreateLevelBenefitMutation()
  const [updateBenefit, { isLoading: updating }] = useUpdateLevelBenefitMutation()
  const [deleteBenefit, { isLoading: deleting }] = useDeleteLevelBenefitMutation()

  const handleAction = (key: string, record: LevelBenefit) => {
    if (!canManage) return
    switch (key) {
      case 'edit':
        setEditRecord(record)
        break
      case 'delete':
        setDeleteRecord(record)
        break
      case 'activate':
        updateBenefit({ id: record.id, status: 'active' }).unwrap()
          .then(() => adminActions.notify('Benefit activated'))
        break
      case 'deactivate':
        updateBenefit({ id: record.id, status: 'inactive' }).unwrap()
          .then(() => adminActions.notify('Benefit deactivated'))
        break
    }
  }

  const BenefitForm = ({
    id,
    initialValues,
    onFinish,
  }: {
    id: string
    initialValues?: Partial<LevelBenefit>
    onFinish: (values: Omit<LevelBenefit, 'id'>) => void
  }) => (
    <Form
      id={id}
      layout="vertical"
      className="mt-4"
      initialValues={{ status: 'active', ...initialValues }}
      onFinish={onFinish}
    >
      <Form.Item name="name" label="Benefit Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="level" label="Level" rules={[{ required: true }]}>
        <Select options={LEVEL_OPTIONS} />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
      </Form.Item>
      <button type="submit" className="hidden" />
    </Form>
  )

  return (
    <>
      <div className="mb-4 flex justify-end">
        {canManage && (
          <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            Add Benefit
          </Button>
        )}
      </div>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        columns={[
          {
            title: 'Tier',
            dataIndex: 'level',
            render: (l: DriverLevelName) => <Tag>{levelLabel(l)}</Tag>,
          },
          { title: 'Benefit', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description', ellipsis: true },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          ...(canManage
            ? [
                createActionsColumn<LevelBenefit>(
                  (record) => getBenefitActionItems(record),
                  (key, record) => handleAction(key, record),
                ),
              ]
            : []),
        ]}
      />

      <Modal
        title="Add Benefit"
        open={createOpen}
        confirmLoading={creating}
        onCancel={() => setCreateOpen(false)}
        onOk={() => {
          document.getElementById('benefit-create-form')?.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true }),
          )
        }}
        destroyOnClose
      >
        <BenefitForm
          id="benefit-create-form"
          onFinish={async (values) => {
            await createBenefit(values).unwrap()
            adminActions.notify('Benefit created')
            setCreateOpen(false)
          }}
        />
      </Modal>

      {editRecord && (
        <Modal
          title={`Edit Benefit — ${editRecord.name}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('benefit-edit-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <BenefitForm
            id="benefit-edit-form"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateBenefit({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('Benefit updated')
              setEditRecord(null)
            }}
          />
        </Modal>
      )}

      <ConfirmationModal
        open={Boolean(deleteRecord)}
        title="Delete Benefit"
        description={`Delete benefit "${deleteRecord?.name}"?`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={async () => {
          if (!deleteRecord) return
          await deleteBenefit(deleteRecord.id).unwrap()
          adminActions.notify('Benefit deleted')
          setDeleteRecord(null)
        }}
      />

      <AdminActionHost actions={adminActions} />
    </>
  )
}
