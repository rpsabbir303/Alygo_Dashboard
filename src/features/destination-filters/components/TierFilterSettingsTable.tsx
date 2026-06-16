import { useState } from 'react'
import { Form, Input, InputNumber, Modal, Select, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetTierFilterSettingsQuery,
  useUpdateTierFilterSettingsMutation,
} from '@/services/destinationFilterApi'
import type { TierFilterSettings } from '@/types/destinationFilter'
import { getTierFilterActionItems } from '@/features/destination-filters/destinationFilterHelpers'

export function TierFilterSettingsTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetTierFilterSettingsQuery()
  const [editRecord, setEditRecord] = useState<TierFilterSettings | null>(null)
  const [updateSettings, { isLoading: updating }] = useUpdateTierFilterSettingsMutation()

  return (
    <>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Configure destination filter limits per driver tier. All settings are editable without code changes.
      </p>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1100 }}
        {...createTableRowProps<TierFilterSettings>((record) =>
          adminActions.openDrawer(record.tierLabel, [
            { label: 'Number of Filters', value: record.numberOfFilters },
            { label: 'Daily Limit', value: record.dailyLimit },
            { label: 'Weekly Limit', value: record.weeklyLimit },
            { label: 'Expiration Hours', value: record.expirationHours },
            { label: 'Expiration Rule', value: record.expirationRule },
            { label: 'Status', value: record.status },
          ]),
        )}
        columns={[
          {
            title: 'Tier',
            dataIndex: 'tierLabel',
            render: (label: string) => <Tag>{label}</Tag>,
          },
          { title: 'Number Of Filters', dataIndex: 'numberOfFilters' },
          { title: 'Daily Limits', dataIndex: 'dailyLimit' },
          { title: 'Weekly Limits', dataIndex: 'weeklyLimit' },
          { title: 'Expiration Hours', dataIndex: 'expirationHours' },
          { title: 'Expiration Rules', dataIndex: 'expirationRule', ellipsis: true },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<TierFilterSettings>(
            () => getTierFilterActionItems(),
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit Filter Settings — ${editRecord.tierLabel}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('tier-filter-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="tier-filter-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateSettings({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify(`${editRecord.tierLabel} filter settings updated`)
              setEditRecord(null)
            }}
          >
            <Form.Item name="numberOfFilters" label="Number Of Filters" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="dailyLimit" label="Daily Limits" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="weeklyLimit" label="Weekly Limits" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="expirationHours" label="Expiration Hours" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="expirationRule" label="Expiration Rules" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
            </Form.Item>
            <button type="submit" className="hidden" />
          </Form>
        </Modal>
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}
