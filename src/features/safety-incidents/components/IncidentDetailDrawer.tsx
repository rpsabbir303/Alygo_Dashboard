import { Drawer, Table, Tag, Timeline } from 'antd'
import { FileText, MapPin, Paperclip } from 'lucide-react'
import type { SafetyIncident } from '@/types/safetyIncident'
import {
  priorityColor,
  priorityLabel,
  statusColor,
  statusLabel,
  typeLabel,
} from '@/features/safety-incidents/safetyIncidentHelpers'

interface IncidentDetailDrawerProps {
  open: boolean
  incident: SafetyIncident | null
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-alygo-text-muted">{title}</h4>
      {children}
    </div>
  )
}

export function IncidentDetailDrawer({ open, incident, onClose }: IncidentDetailDrawerProps) {
  if (!incident) return null

  return (
    <Drawer
      title={`Case ${incident.caseId}`}
      open={open}
      onClose={onClose}
      width={680}
      destroyOnClose
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Tag>{typeLabel(incident.type)}</Tag>
        <Tag color={statusColor(incident.status)}>{statusLabel(incident.status)}</Tag>
        <Tag color={priorityColor(incident.priority)}>{priorityLabel(incident.priority)}</Tag>
      </div>

      <p className="mb-6 text-sm text-white">{incident.description}</p>

      <Section title="Driver Information">
        <div className="space-y-2 text-sm">
          <p><span className="text-alygo-text-muted">Name:</span> {incident.driverName}</p>
          <p><span className="text-alygo-text-muted">Driver ID:</span> {incident.driverId}</p>
          <p><span className="text-alygo-text-muted">Phone:</span> {incident.driverPhone}</p>
        </div>
      </Section>

      <Section title="Passenger Information">
        <div className="space-y-2 text-sm">
          <p><span className="text-alygo-text-muted">Name:</span> {incident.passengerName}</p>
          <p><span className="text-alygo-text-muted">Passenger ID:</span> {incident.passengerId}</p>
          <p><span className="text-alygo-text-muted">Phone:</span> {incident.passengerPhone}</p>
          <p><span className="text-alygo-text-muted">Trip ID:</span> {incident.tripId}</p>
        </div>
      </Section>

      <Section title="GPS Timeline">
        <Timeline
          items={incident.gpsTimeline.map((point) => ({
            dot: <MapPin className="h-3 w-3 text-indigo-400" />,
            children: (
              <div>
                <p className="font-medium text-white">{point.label}</p>
                <p className="text-xs text-alygo-text-muted">
                  {new Date(point.timestamp).toLocaleString()} — {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                </p>
              </div>
            ),
          }))}
        />
      </Section>

      <Section title="Trip History">
        <Timeline
          items={incident.tripHistory.map((entry) => ({
            children: (
              <div>
                <p className="text-white">{entry.event}</p>
                <p className="text-xs text-alygo-text-muted">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            ),
          }))}
        />
      </Section>

      <Section title="Notes">
        {incident.notes.length === 0 ? (
          <p className="text-sm text-alygo-text-muted">No notes yet.</p>
        ) : (
          <Table
            size="small"
            pagination={false}
            rowKey="id"
            dataSource={incident.notes}
            columns={[
              { title: 'Author', dataIndex: 'author', width: 120 },
              { title: 'Note', dataIndex: 'content', ellipsis: true },
              { title: 'Time', dataIndex: 'timestamp', render: (d: string) => new Date(d).toLocaleString() },
            ]}
          />
        )}
      </Section>

      <Section title="Attachments">
        {incident.attachments.length === 0 ? (
          <p className="text-sm text-alygo-text-muted">No attachments.</p>
        ) : (
          <div className="space-y-2">
            {incident.attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-2 rounded-lg border border-white/5 p-3 text-sm">
                <Paperclip className="h-4 w-4 text-alygo-text-muted" />
                <FileText className="h-4 w-4 text-indigo-400" />
                <span className="text-white">{att.name}</span>
                <span className="ml-auto text-xs text-alygo-text-muted">{att.type}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {incident.assignedTo && (
        <Section title="Assignment">
          <p className="text-sm text-white">Assigned to: {incident.assignedTo}</p>
        </Section>
      )}
    </Drawer>
  )
}
