import { Button, Drawer, Form, Input, InputNumber, Select } from 'antd'
import type { DriverLevel } from '@/types/driverRewards'

export type TierFormValues = Omit<DriverLevel, 'id' | 'benefitsCount'>

interface TierFormDrawerProps {
  open: boolean
  title: string
  initialValues?: Partial<TierFormValues>
  confirmLoading?: boolean
  onClose: () => void
  onSubmit: (values: TierFormValues) => void
}

const defaultValues: TierFormValues = {
  name: 'custom_tier',
  label: '',
  description: '',
  requiredPoints: 0,
  requiredRating: 4.5,
  requiredTrips: 0,
  requiredOnlineHours: 0,
  requiredAcceptanceRate: 85,
  requiredCompletionRate: 92,
  tierColor: '#6366f1',
  tierBadge: 'T',
  status: 'active',
}

export function TierFormDrawer({
  open,
  title,
  initialValues,
  confirmLoading,
  onClose,
  onSubmit,
}: TierFormDrawerProps) {
  const [form] = Form.useForm<TierFormValues>()

  return (
    <Drawer
      title={title}
      open={open}
      width={520}
      onClose={onClose}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible) form.setFieldsValue({ ...defaultValues, ...initialValues })
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={confirmLoading} onClick={() => form.submit()}>
            Save Tier
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="label" label="Tier Name" rules={[{ required: true }]}>
          <Input placeholder="e.g. Elite" />
        </Form.Item>
        <Form.Item name="name" label="Tier Key" rules={[{ required: true }]}>
          <Input placeholder="e.g. elite" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="requiredPoints" label="Required Points" rules={[{ required: true }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item name="requiredRating" label="Required Rating" rules={[{ required: true }]}>
          <InputNumber min={0} max={5} step={0.01} className="w-full" />
        </Form.Item>
        <Form.Item name="requiredTrips" label="Required Trips" rules={[{ required: true }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item name="requiredOnlineHours" label="Required Online Hours" rules={[{ required: true }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item name="requiredAcceptanceRate" label="Required Acceptance Rate (%)" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} className="w-full" />
        </Form.Item>
        <Form.Item name="requiredCompletionRate" label="Required Completion Rate (%)" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} className="w-full" />
        </Form.Item>
        <Form.Item name="tierColor" label="Tier Color" rules={[{ required: true }]}>
          <Input type="color" className="h-10 w-full" />
        </Form.Item>
        <Form.Item name="tierBadge" label="Tier Badge" rules={[{ required: true }]}>
          <Input maxLength={4} placeholder="e.g. E" />
        </Form.Item>
        <Form.Item name="status" label="Tier Status" rules={[{ required: true }]}>
          <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
