import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { useEffect } from 'react'
import { CITY_OPTIONS, STATE_OPTIONS } from '@/services/driverCapacityApi'
import type { DriverCapSetting } from '@/types/driverCapacity'
import type { CapacityRuleFormValues } from '@/types/driverCapacity'

interface CapacityRuleFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  rule: DriverCapSetting | null
  loading?: boolean
  onCancel: () => void
  onSubmit: (values: CapacityRuleFormValues) => Promise<void>
}

const defaultValues: CapacityRuleFormValues = {
  state: 'California',
  city: 'San Francisco',
  maxDrivers: 500,
  notes: '',
  status: 'active',
}

export function CapacityRuleFormModal({
  open,
  mode,
  rule,
  loading,
  onCancel,
  onSubmit,
}: CapacityRuleFormModalProps) {
  const [form] = Form.useForm<CapacityRuleFormValues>()

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && rule) {
      form.setFieldsValue({
        state: rule.state,
        city: rule.city,
        maxDrivers: rule.maxDrivers,
        notes: rule.notes,
        status: rule.status,
      })
    } else {
      form.setFieldsValue(defaultValues)
    }
  }, [open, mode, rule, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
  }

  return (
    <Modal
      title={mode === 'create' ? 'Add Capacity Rule' : 'Edit Capacity Rule'}
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        {mode === 'create' && (
          <>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Select options={STATE_OPTIONS} showSearch optionFilterProp="label" />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Select options={CITY_OPTIONS} showSearch optionFilterProp="label" />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="maxDrivers"
          label="Maximum Drivers Allowed"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={mode === 'edit' ? rule?.currentDrivers ?? 0 : 1}
            className="w-full"
          />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={2} placeholder="Optional admin notes" />
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
  )
}
