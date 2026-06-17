import { useState } from 'react'
import { Form, Input, Modal, Select, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useAssignIncidentMutation,
  useEscalateIncidentMutation,
  useGetIncidentsQuery,
  useGetSafetyTeamQuery,
  useResolveIncidentMutation,
} from '@/services/safetyIncidentApi'
import type { SafetyIncident } from '@/types/safetyIncident'
import {
  getIncidentActionItems,
  priorityColor,
  priorityLabel,
  statusColor,
  statusLabel,
  typeLabel,
} from '@/features/safety-incidents/safetyIncidentHelpers'
import { IncidentDetailDrawer } from '@/features/safety-incidents/components/IncidentDetailDrawer'

export function IncidentTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetIncidentsQuery()
  const { data: team = [] } = useGetSafetyTeamQuery()
  const [selected, setSelected] = useState<SafetyIncident | null>(null)
  const [assignRecord, setAssignRecord] = useState<SafetyIncident | null>(null)
  const [resolveRecord, setResolveRecord] = useState<SafetyIncident | null>(null)
  const [assignTo, setAssignTo] = useState('')
  const [resolveNote, setResolveNote] = useState('')

  const [assignIncident, { isLoading: assigning }] = useAssignIncidentMutation()
  const [resolveIncident, { isLoading: resolving }] = useResolveIncidentMutation()
  const [escalateIncident] = useEscalateIncidentMutation()

  const handleAction = (key: string, record: SafetyIncident) => {
    switch (key) {
      case 'view':
        setSelected(record)
        break
      case 'assign':
        setAssignRecord(record)
        setAssignTo(team[0]?.name ?? 'Safety Team Alpha')
        break
      case 'resolve':
        setResolveRecord(record)
        break
      case 'escalate':
        adminActions.openConfirm({
          title: 'Escalate Incident',
          description: `Escalate case ${record.caseId} to senior safety team?`,
          confirmLabel: 'Escalate',
          danger: true,
          onConfirm: async () => {
            await escalateIncident(record.id).unwrap()
            adminActions.notify(`Case ${record.caseId} escalated`)
          },
        })
        break
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1200 }}
        {...createTableRowProps<SafetyIncident>((record) => setSelected(record))}
        columns={[
          { title: 'Case ID', dataIndex: 'caseId', width: 140 },
          { title: 'Type', dataIndex: 'type', render: (t: string) => <Tag>{typeLabel(t)}</Tag> },
          { title: 'Driver', dataIndex: 'driverName' },
          { title: 'Passenger', dataIndex: 'passengerName' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColor(s)}>{statusLabel(s)}</Tag> },
          { title: 'Priority', dataIndex: 'priority', render: (p: string) => <Tag color={priorityColor(p)}>{priorityLabel(p)}</Tag> },
          { title: 'Created At', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
          createActionsColumn<SafetyIncident>(
            (record) => getIncidentActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      <IncidentDetailDrawer
        open={Boolean(selected)}
        incident={selected}
        onClose={() => setSelected(null)}
      />

      <Modal
        title={`Assign Case — ${assignRecord?.caseId}`}
        open={Boolean(assignRecord)}
        confirmLoading={assigning}
        onCancel={() => setAssignRecord(null)}
        onOk={async () => {
          if (!assignRecord) return
          await assignIncident({ id: assignRecord.id, assignedTo: assignTo }).unwrap()
          adminActions.notify(`Case assigned to ${assignTo}`)
          setAssignRecord(null)
        }}
        destroyOnClose
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Safety Team">
            <Select
              value={assignTo}
              onChange={setAssignTo}
              options={team.filter((m) => m.status === 'active').map((m) => ({ value: m.name, label: `${m.name} (${m.role})` }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Resolve Case — ${resolveRecord?.caseId}`}
        open={Boolean(resolveRecord)}
        confirmLoading={resolving}
        onCancel={() => setResolveRecord(null)}
        onOk={async () => {
          if (!resolveRecord) return
          await resolveIncident({ id: resolveRecord.id, note: resolveNote }).unwrap()
          adminActions.notify(`Case ${resolveRecord.caseId} resolved`)
          setResolveRecord(null)
        }}
        destroyOnClose
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Resolution Notes">
            <Input.TextArea rows={3} value={resolveNote} onChange={(e) => setResolveNote(e.target.value)} placeholder="Describe resolution..." />
          </Form.Item>
        </Form>
      </Modal>

      <AdminActionHost actions={adminActions} />
    </>
  )
}
