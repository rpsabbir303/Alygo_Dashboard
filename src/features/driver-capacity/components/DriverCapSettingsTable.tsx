import { useState } from 'react'
import { Form, InputNumber, Modal, Progress, Table } from 'antd'
import { Pencil } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetDriverCapSettingsQuery,
  useUpdateDriverCapSettingMutation,
} from '@/services/driverCapacityApi'
import type { DriverCapSetting } from '@/types/driverCapacity'
import { capacityUtilization } from '@/features/driver-capacity/driverCapacityHelpers'
import { formatNumber } from '@/utils/format'

export function DriverCapSettingsTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetDriverCapSettingsQuery()
  const [editRecord, setEditRecord] = useState<DriverCapSetting | null>(null)
  const [maxDrivers, setMaxDrivers] = useState(0)
  const [updateCap, { isLoading: updating }] = useUpdateDriverCapSettingMutation()

  return (
    <>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Set maximum driver capacity per city and state. Remaining slots update automatically as drivers are approved.
      </p>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        {...createTableRowProps<DriverCapSetting>((record) =>
          adminActions.openDrawer(`${record.city}, ${record.state}`, [
            { label: 'State', value: record.state },
            { label: 'City', value: record.city },
            { label: 'Max Drivers', value: formatNumber(record.maxDrivers) },
            { label: 'Current Drivers', value: formatNumber(record.currentDrivers) },
            { label: 'Remaining Slots', value: formatNumber(record.remainingSlots) },
            { label: 'Utilization', value: `${capacityUtilization(record.currentDrivers, record.maxDrivers)}%` },
          ]),
        )}
        columns={[
          { title: 'State', dataIndex: 'state' },
          { title: 'City', dataIndex: 'city' },
          { title: 'Max Drivers', dataIndex: 'maxDrivers', render: (n: number) => formatNumber(n) },
          { title: 'Current Drivers', dataIndex: 'currentDrivers', render: (n: number) => formatNumber(n) },
          {
            title: 'Remaining Slots',
            dataIndex: 'remainingSlots',
            render: (n: number) => (
              <span className={n === 0 ? 'text-red-400' : 'text-emerald-400'}>
                {formatNumber(n)}
              </span>
            ),
          },
          {
            title: 'Utilization',
            key: 'utilization',
            render: (_: unknown, record: DriverCapSetting) => {
              const pct = capacityUtilization(record.currentDrivers, record.maxDrivers)
              return (
                <Progress
                  percent={pct}
                  size="small"
                  strokeColor={pct >= 90 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#6366f1'}
                />
              )
            },
          },
          createActionsColumn<DriverCapSetting>(
            () => [{ key: 'edit', label: 'Edit Cap', icon: Pencil }],
            (key, record) => {
              if (key === 'edit') {
                setEditRecord(record)
                setMaxDrivers(record.maxDrivers)
              }
            },
          ),
        ]}
      />

      <Modal
        title={`Edit Driver Cap — ${editRecord?.city}, ${editRecord?.state}`}
        open={Boolean(editRecord)}
        confirmLoading={updating}
        onCancel={() => setEditRecord(null)}
        onOk={async () => {
          if (!editRecord) return
          await updateCap({ id: editRecord.id, maxDrivers }).unwrap()
          adminActions.notify(`Cap updated for ${editRecord.city}`)
          setEditRecord(null)
        }}
        destroyOnClose
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Max Drivers">
            <InputNumber
              min={editRecord?.currentDrivers ?? 0}
              className="w-full"
              value={maxDrivers}
              onChange={(v) => setMaxDrivers(v ?? 0)}
            />
          </Form.Item>
          <p className="text-xs text-alygo-text-muted">
            Current drivers: {editRecord?.currentDrivers}. Minimum cap cannot be below current count.
          </p>
        </Form>
      </Modal>

      <AdminActionHost actions={adminActions} />
    </>
  )
}
