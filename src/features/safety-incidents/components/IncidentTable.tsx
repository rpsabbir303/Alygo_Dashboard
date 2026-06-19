import { useState } from 'react'
import { Form, Input, Modal, Select, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  ASSIGN_OPTIONS,
  useAddIncidentNoteMutation,
  useAssignIncidentMutation,
  useCloseIncidentMutation,
  useGetIncidentsQuery,
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
  const [selected, setSelected] = useState<SafetyIncident | null>(null)
  const [assignRecord, setAssignRecord] = useState<SafetyIncident | null>(null)
  const [resolveRecord, setResolveRecord] = useState<SafetyIncident | null>(null)
  const [closeRecord, setCloseRecord] = useState<SafetyIncident | null>(null)
  const [noteRecord, setNoteRecord] = useState<SafetyIncident | null>(null)
  const [assignTo, setAssignTo] = useState('')
  const [resolveNote, setResolveNote] = useState('')
  const [closeNote, setCloseNote] = useState('')
  const [internalNote, setInternalNote] = useState('')

  const [assignIncident, { isLoading: assigning }] = useAssignIncidentMutation()
  const [resolveIncident, { isLoading: resolving }] = useResolveIncidentMutation()
  const [closeIncident, { isLoading: closing }] = useCloseIncidentMutation()
  const [addIncidentNote, { isLoading: addingNote }] = useAddIncidentNoteMutation()

  const handleAction = (key: string, record: SafetyIncident) => {
    switch (key) {
      case 'view':
        setSelected(record)
        break
      case 'assign':
        setAssignRecord(record)
        setAssignTo(record.assignedTo ?? ASSIGN_OPTIONS[0].value)
        break
      case 'note':
        setNoteRecord(record)
        setInternalNote('')
        break
      case 'resolve':
        setResolveRecord(record)
        setResolveNote('')
        break
      case 'close':
        setCloseRecord(record)
        setCloseNote('')
        break
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1300 }}
        {...createTableRowProps<SafetyIncident>((record) => setSelected(record))}
        columns={[
          { title: 'Case ID', dataIndex: 'caseId', width: 140 },
          { title: 'Case Type', dataIndex: 'type', render: (t: string) => <Tag>{typeLabel(t)}</Tag> },
          { title: 'Driver', dataIndex: 'driverName' },
          { title: 'Passenger', dataIndex: 'passengerName' },
          { title: 'Priority', dataIndex: 'priority', render: (p: string) => <Tag color={priorityColor(p)}>{priorityLabel(p)}</Tag> },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColor(s)}>{statusLabel(s)}</Tag> },
          { title: 'Created Date', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
          { title: 'Assigned To', dataIndex: 'assignedTo', render: (v: string | undefined) => v ?? '—' },
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
          <Form.Item label="Assign To">
            <Select value={assignTo} onChange={setAssignTo} options={ASSIGN_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Add Internal Note — ${noteRecord?.caseId}`}
        open={Boolean(noteRecord)}
        confirmLoading={addingNote}
        onCancel={() => setNoteRecord(null)}
        onOk={async () => {
          if (!noteRecord || !internalNote.trim()) return
          await addIncidentNote({ id: noteRecord.id, content: internalNote.trim() }).unwrap()
          adminActions.notify('Internal note added')
          setNoteRecord(null)
        }}
        destroyOnClose
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Note">
            <Input.TextArea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Add internal note for the safety team..."
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
            <Input.TextArea
              rows={3}
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="Describe resolution..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Close Case — ${closeRecord?.caseId}`}
        open={Boolean(closeRecord)}
        confirmLoading={closing}
        onCancel={() => setCloseRecord(null)}
        onOk={async () => {
          if (!closeRecord) return
          await closeIncident({ id: closeRecord.id, note: closeNote }).unwrap()
          adminActions.notify(`Case ${closeRecord.caseId} closed`)
          setCloseRecord(null)
        }}
        destroyOnClose
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Closing Notes (optional)">
            <Input.TextArea
              rows={3}
              value={closeNote}
              onChange={(e) => setCloseNote(e.target.value)}
              placeholder="Add any final notes before closing..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <AdminActionHost actions={adminActions} />
    </>
  )
}
