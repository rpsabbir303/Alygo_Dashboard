import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { useEffect } from 'react'
import { useGetLevelBenefitsQuery } from '@/services/driverRewardsApi'
import { getTierBenefitIds } from '@/services/mock/driverRewardsData'
import type { DriverLevel } from '@/types/driverRewards'
import { TIER_ICON_OPTIONS, type TierFormModalValues } from '@/types/tierManagement'

interface TierFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  tier: DriverLevel | null
  loading?: boolean
  onCancel: () => void
  onSubmit: (values: TierFormModalValues) => Promise<void>
}

const defaultValues: TierFormModalValues = {
  label: '',
  requiredPoints: 0,
  requiredTrips: 0,
  requiredRating: 4.5,
  requiredAcceptanceRate: 85,
  requiredCompletionRate: 92,
  tierColor: '#6366f1',
  tierIcon: 'award',
  tierBadge: 'T',
  status: 'active',
  benefitIds: [],
  notes: '',
}

export function TierFormModal({
  open,
  mode,
  tier,
  loading,
  onCancel,
  onSubmit,
}: TierFormModalProps) {
  const [form] = Form.useForm<TierFormModalValues>()
  const { data: benefits = [] } = useGetLevelBenefitsQuery()

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && tier) {
      form.setFieldsValue({
        label: tier.label,
        requiredPoints: tier.requiredPoints,
        requiredTrips: tier.requiredTrips,
        requiredRating: tier.requiredRating,
        requiredAcceptanceRate: tier.requiredAcceptanceRate,
        requiredCompletionRate: tier.requiredCompletionRate,
        tierColor: tier.tierColor,
        tierIcon: tier.icon,
        tierBadge: tier.tierBadge,
        status: tier.status,
        benefitIds: getTierBenefitIds(tier.name),
        notes: tier.description,
      })
    } else {
      form.setFieldsValue(defaultValues)
    }
  }, [open, mode, tier, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
  }

  const benefitOptions = benefits.map((benefit) => ({
    label: benefit.name,
    value: benefit.id,
  }))

  return (
    <Modal
      title={mode === 'create' ? 'Create Tier' : 'Edit Tier'}
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={handleOk}
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="label" label="Tier Name" rules={[{ required: true }]}>
          <Input placeholder="e.g. Elite" />
        </Form.Item>
        <div className="grid gap-0 sm:grid-cols-2 sm:gap-4">
          <Form.Item name="requiredPoints" label="Minimum Points" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="requiredTrips" label="Minimum Completed Trips" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 sm:gap-4">
          <Form.Item name="requiredRating" label="Minimum Rating" rules={[{ required: true }]}>
            <InputNumber min={0} max={5} step={0.1} className="w-full" />
          </Form.Item>
          <Form.Item name="requiredAcceptanceRate" label="Minimum Acceptance Rate" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} addonAfter="%" className="w-full" />
          </Form.Item>
        </div>
        <Form.Item name="requiredCompletionRate" label="Minimum Completion Rate" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} addonAfter="%" className="w-full" />
        </Form.Item>
        <div className="grid gap-0 sm:grid-cols-3 sm:gap-4">
          <Form.Item name="tierColor" label="Tier Color" rules={[{ required: true }]}>
            <Input type="color" className="h-10 w-full" />
          </Form.Item>
          <Form.Item name="tierIcon" label="Tier Icon" rules={[{ required: true }]}>
            <Select options={TIER_ICON_OPTIONS} />
          </Form.Item>
          <Form.Item name="tierBadge" label="Badge" rules={[{ required: true }]}>
            <Input maxLength={3} />
          </Form.Item>
        </div>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </Form.Item>
        <Form.Item name="benefitIds" label="Benefits">
          <Select mode="multiple" allowClear options={benefitOptions} placeholder="Select benefits" />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={2} placeholder="Optional admin notes" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
