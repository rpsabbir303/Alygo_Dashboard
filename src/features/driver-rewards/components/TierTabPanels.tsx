import { useState } from 'react'
import { Button, Form, Input, Modal, Select, Table } from 'antd'
import { Plus } from 'lucide-react'
import {
  AdminActionHost,
  ConfirmationModal,
  createActionsColumn,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TierFormModal } from '@/features/driver-rewards/components/TierFormModal'
import { TierOverviewPanel } from '@/features/driver-rewards/components/TierOverviewPanel'
import {
  buildTierDetailFields,
  formatAssignedTiers,
  getTierBenefitActionItems,
  getTierManagementActionItems,
} from '@/features/driver-rewards/tierManagementHelpers'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  LEVEL_OPTIONS,
  useCreateDriverLevelMutation,
  useCreateLevelBenefitMutation,
  useDeleteDriverLevelMutation,
  useDeleteLevelBenefitMutation,
  useGetDriverLevelsQuery,
  useGetLevelBenefitsQuery,
  useSyncTierBenefitAssignmentsMutation,
  useUpdateDriverLevelMutation,
  useUpdateLevelBenefitMutation,
} from '@/services/driverRewardsApi'
import { createDefaultLevel, createTierRequirements } from '@/features/driver-rewards/utils/tierDefaults'
import type { DriverLevel, DriverLevelName, LevelBenefit } from '@/types/driverRewards'
import type { TierFormModalValues } from '@/types/tierManagement'

export function TierOverviewTab() {
  return <TierOverviewPanel />
}

function buildTierPayload(
  values: TierFormModalValues,
  existing?: DriverLevel,
  sortOrder = 1,
): Omit<DriverLevel, 'id' | 'benefitsCount' | 'driverCount'> {
  const slug = values.label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const name = existing?.name ?? slug.replace(/-/g, '_')
  const template = createDefaultLevel('tmp', name, values.label, values.notes ?? '', sortOrder, sortOrder, {
    completedTrips: values.requiredTrips,
    driverRating: values.requiredRating,
    acceptanceRate: values.requiredAcceptanceRate,
  })

  return {
    name,
    slug,
    label: values.label.trim(),
    description: values.notes?.trim() ?? '',
    level: sortOrder,
    icon: values.tierIcon,
    requiredPoints: values.requiredPoints,
    requiredRating: values.requiredRating,
    requiredTrips: values.requiredTrips,
    requiredOnlineHours: existing?.requiredOnlineHours ?? 0,
    requiredAcceptanceRate: values.requiredAcceptanceRate,
    requiredCompletionRate: values.requiredCompletionRate,
    requirements: createTierRequirements({
      completedTrips: values.requiredTrips,
      driverRating: values.requiredRating,
      acceptanceRate: values.requiredAcceptanceRate,
    }),
    benefits: existing?.benefits ?? template.benefits,
    tierColor: values.tierColor,
    tierBadge: values.tierBadge,
    status: values.status,
    sortOrder,
  }
}

export function TierConfigurationTab() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetDriverLevelsQuery()
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<DriverLevel | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<DriverLevel | null>(null)

  const [createLevel, { isLoading: creating }] = useCreateDriverLevelMutation()
  const [updateLevel, { isLoading: updating }] = useUpdateDriverLevelMutation()
  const [deleteLevel, { isLoading: deleting }] = useDeleteDriverLevelMutation()
  const [syncBenefits] = useSyncTierBenefitAssignmentsMutation()

  const handleAction = (key: string, record: DriverLevel) => {
    switch (key) {
      case 'view':
        adminActions.openDrawer(record.label, buildTierDetailFields(record))
        break
      case 'edit':
        setEditRecord(record)
        setFormOpen(true)
        break
      case 'delete':
        setDeleteRecord(record)
        break
    }
  }

  const handleSubmit = async (values: TierFormModalValues) => {
    try {
      if (editRecord) {
        const payload = buildTierPayload(values, editRecord, editRecord.sortOrder)
        await updateLevel({ id: editRecord.id, ...payload }).unwrap()
        await syncBenefits({ tierName: editRecord.name, benefitIds: values.benefitIds }).unwrap()
        adminActions.notify('Tier updated', editRecord.label)
      } else {
        const payload = buildTierPayload(values, undefined, data.length + 1)
        const created = await createLevel(payload).unwrap()
        await syncBenefits({ tierName: created.name, benefitIds: values.benefitIds }).unwrap()
        adminActions.notify('Tier created', values.label)
      }
      setFormOpen(false)
      setEditRecord(null)
    } catch (err) {
      adminActions.notify('Unable to save tier', String(err))
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          type="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditRecord(null)
            setFormOpen(true)
          }}
        >
          Create Tier
        </Button>
      </div>
      <Table
        loading={isLoading || creating || updating || deleting}
        rowKey="id"
        dataSource={[...data].sort((a, b) => a.sortOrder - b.sortOrder)}
        scroll={{ x: 1100 }}
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
          { title: 'Driver Count', dataIndex: 'driverCount' },
          { title: 'Minimum Points', dataIndex: 'requiredPoints' },
          { title: 'Minimum Rating', dataIndex: 'requiredRating' },
          {
            title: 'Minimum Acceptance Rate',
            dataIndex: 'requiredAcceptanceRate',
            render: (v: number) => `${v}%`,
          },
          { title: 'Benefits Count', dataIndex: 'benefitsCount' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<DriverLevel>(
            () => getTierManagementActionItems(),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />
      <TierFormModal
        open={formOpen}
        mode={editRecord ? 'edit' : 'create'}
        tier={editRecord}
        loading={creating || updating}
        onCancel={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onSubmit={handleSubmit}
      />
      <ConfirmationModal
        open={Boolean(deleteRecord)}
        title="Delete Tier"
        description={`Delete tier "${deleteRecord?.label}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={async () => {
          if (!deleteRecord) return
          try {
            await deleteLevel(deleteRecord.id).unwrap()
            adminActions.notify('Tier deleted', deleteRecord.label)
            setDeleteRecord(null)
          } catch (err) {
            adminActions.notify('Unable to delete tier', String(err))
          }
        }}
      />
      <AdminActionHost actions={adminActions} />
    </>
  )
}

interface BenefitFormValues {
  name: string
  description: string
  assignedTiers: DriverLevelName[]
  status: LevelBenefit['status']
}

export function TierBenefitsTab() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetLevelBenefitsQuery()
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<LevelBenefit | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<LevelBenefit | null>(null)
  const [form] = Form.useForm<BenefitFormValues>()

  const [createBenefit, { isLoading: creating }] = useCreateLevelBenefitMutation()
  const [updateBenefit, { isLoading: updating }] = useUpdateLevelBenefitMutation()
  const [deleteBenefit, { isLoading: deleting }] = useDeleteLevelBenefitMutation()

  const openCreate = () => {
    setEditRecord(null)
    form.resetFields()
    form.setFieldsValue({ status: 'active', assignedTiers: [] })
    setFormOpen(true)
  }

  const openEdit = (record: LevelBenefit) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setFormOpen(true)
  }

  const handleAction = (key: string, record: LevelBenefit) => {
    switch (key) {
      case 'edit':
        openEdit(record)
        break
      case 'delete':
        setDeleteRecord(record)
        break
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const payload: Omit<LevelBenefit, 'id'> = {
      ...values,
      category: editRecord?.category ?? 'general',
    }
    if (editRecord) {
      await updateBenefit({ id: editRecord.id, ...payload }).unwrap()
      adminActions.notify('Benefit updated', editRecord.name)
    } else {
      await createBenefit(payload).unwrap()
      adminActions.notify('Benefit created', values.name)
    }
    setFormOpen(false)
    setEditRecord(null)
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Benefit
        </Button>
      </div>
      <Table
        loading={isLoading || creating || updating || deleting}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        columns={[
          { title: 'Benefit Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description', ellipsis: true },
          {
            title: 'Assigned Tiers',
            dataIndex: 'assignedTiers',
            render: (tiers: string[]) => formatAssignedTiers(tiers),
            ellipsis: true,
          },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<LevelBenefit>(
            () => getTierBenefitActionItems(),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />
      <Modal
        title={editRecord ? 'Edit Benefit' : 'Add Benefit'}
        open={formOpen}
        confirmLoading={creating || updating}
        onCancel={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onOk={handleSave}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Benefit Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="assignedTiers"
            label="Assigned Tiers"
            rules={[{ required: true, message: 'Select at least one tier' }]}
          >
            <Select mode="multiple" options={LEVEL_OPTIONS} placeholder="Select tiers" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
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
          adminActions.notify('Benefit deleted', deleteRecord.name)
          setDeleteRecord(null)
        }}
      />
      <AdminActionHost actions={adminActions} />
    </>
  )
}
