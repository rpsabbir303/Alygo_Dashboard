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

  const timelineEvents = [
    ...incident.tripHistory.map((entry) => ({
      key: `trip-${entry.timestamp}-${entry.event}`,
      label: entry.event,
      timestamp: entry.timestamp,
      type: 'trip' as const,
    })),
    ...incident.notes.map((note) => ({
      key: note.id,
      label: note.content,
      timestamp: note.timestamp,
      type: 'note' as const,
      author: note.author,
    })),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

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

      <Section title="Full Incident Information">
        <p className="text-sm text-white">{incident.description}</p>
        <p className="mt-2 text-xs text-alygo-text-muted">
          Reported {new Date(incident.createdAt).toLocaleString()}
        </p>
      </Section>

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

      <Section title="Uploaded Evidence">
        {incident.attachments.length === 0 ? (
          <p className="text-sm text-alygo-text-muted">No evidence uploaded.</p>
        ) : (
          <div className="space-y-2">
            {incident.attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-2 rounded-lg border border-white/5 p-3 text-sm">
                <Paperclip className="h-4 w-4 text-alygo-text-muted" />
                <FileText className="h-4 w-4 text-indigo-400" />
                <span className="text-white">{att.name}</span>
                <span className="ml-auto text-xs text-alygo-text-muted">
                  {att.type} · {new Date(att.uploadedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Internal Notes">
        {incident.notes.length === 0 ? (
          <p className="text-sm text-alygo-text-muted">No internal notes yet.</p>
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

      <Section title="Timeline History">
        {timelineEvents.length === 0 ? (
          <p className="text-sm text-alygo-text-muted">No timeline events.</p>
        ) : (
          <Timeline
            items={timelineEvents.map((event) => ({
              dot: event.type === 'trip' ? <MapPin className="h-3 w-3 text-indigo-400" /> : undefined,
              children: (
                <div>
                  <p className="text-white">{event.label}</p>
                  {'author' in event && event.author && (
                    <p className="text-xs text-alygo-text-muted">By {event.author}</p>
                  )}
                  <p className="text-xs text-alygo-text-muted">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
              ),
            }))}
          />
        )}
      </Section>

      {incident.gpsTimeline.length > 0 && (
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
      )}

      {incident.resolutionNotes && (
        <Section title="Resolution Notes">
          <p className="text-sm text-white">{incident.resolutionNotes}</p>
        </Section>
      )}

      {incident.assignedTo && (
        <Section title="Assignment">
          <p className="text-sm text-white">Assigned to: {incident.assignedTo}</p>
        </Section>
      )}
    </Drawer>
  )
}
