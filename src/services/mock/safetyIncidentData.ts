import type {
  EscalationRule,
  IncidentCategory,
  ResponseSlaSettings,
  SafetyIncident,
  SafetyOverview,
  SafetyTeamMember,
} from '@/types/safetyIncident'

const baseTimeline = [
  { timestamp: '2026-06-12T14:00:00Z', lat: 37.7749, lng: -122.4194, label: 'Trip Start' },
  { timestamp: '2026-06-12T14:08:00Z', lat: 37.781, lng: -122.415, label: 'En Route' },
  { timestamp: '2026-06-12T14:16:00Z', lat: 37.785, lng: -122.408, label: 'Incident Reported' },
]

export let mockSafetyIncidents: SafetyIncident[] = [
  {
    id: 'si-1',
    caseId: 'INC-2026-0412',
    type: 'sos_alert',
    driverName: 'Marcus Johnson',
    driverId: 'd-204',
    driverPhone: '+1 (415) 555-0142',
    passengerName: 'Sarah Chen',
    passengerId: 'p-4412',
    passengerPhone: '+1 (415) 555-0198',
    tripId: 'trip-88241',
    status: 'open',
    priority: 'critical',
    createdAt: '2026-06-12T14:16:00Z',
    description: 'Passenger activated SOS button during active trip. Driver reported feeling unsafe.',
    gpsTimeline: baseTimeline,
    tripHistory: [
      { event: 'Trip Started', timestamp: '2026-06-12T14:00:00Z' },
      { event: 'SOS Alert Triggered', timestamp: '2026-06-12T14:16:00Z' },
    ],
    notes: [],
    attachments: [{ id: 'att-1', name: 'sos_audio_recording.mp3', type: 'audio', uploadedAt: '2026-06-12T14:17:00Z' }],
  },
  {
    id: 'si-2',
    caseId: 'INC-2026-0411',
    type: 'passenger_report',
    driverName: 'David Kim',
    driverId: 'd-118',
    driverPhone: '+1 (310) 555-0234',
    passengerName: 'James Wilson',
    passengerId: 'p-3891',
    passengerPhone: '+1 (310) 555-0456',
    tripId: 'trip-88190',
    status: 'assigned',
    priority: 'high',
    createdAt: '2026-06-11T22:30:00Z',
    assignedTo: 'Safety Team Alpha',
    description: 'Passenger reported aggressive driving and route deviation.',
    gpsTimeline: [
      { timestamp: '2026-06-11T22:00:00Z', lat: 34.0522, lng: -118.2437, label: 'Pickup' },
      { timestamp: '2026-06-11T22:20:00Z', lat: 34.06, lng: -118.25, label: 'Route Deviation' },
      { timestamp: '2026-06-11T22:30:00Z', lat: 34.065, lng: -118.24, label: 'Report Filed' },
    ],
    tripHistory: [
      { event: 'Trip Started', timestamp: '2026-06-11T22:00:00Z' },
      { event: 'Passenger Report Submitted', timestamp: '2026-06-11T22:30:00Z' },
    ],
    notes: [{ id: 'n-1', author: 'Safety Admin', content: 'Contacted passenger for statement.', timestamp: '2026-06-11T23:00:00Z' }],
    attachments: [],
  },
  {
    id: 'si-3',
    caseId: 'INC-2026-0410',
    type: 'driver_report',
    driverName: 'Lisa Martinez',
    driverId: 'd-089',
    driverPhone: '+1 (415) 555-0312',
    passengerName: 'Elena Rodriguez',
    passengerId: 'p-2201',
    passengerPhone: '+1 (415) 555-0789',
    tripId: 'trip-88102',
    status: 'escalated',
    priority: 'high',
    createdAt: '2026-06-10T19:45:00Z',
    assignedTo: 'Safety Team Beta',
    description: 'Driver reported passenger harassment and verbal abuse.',
    gpsTimeline: baseTimeline,
    tripHistory: [
      { event: 'Trip Started', timestamp: '2026-06-10T19:30:00Z' },
      { event: 'Driver Report Filed', timestamp: '2026-06-10T19:45:00Z' },
      { event: 'Case Escalated', timestamp: '2026-06-10T20:15:00Z' },
    ],
    notes: [
      { id: 'n-2', author: 'Compliance Admin', content: 'Escalated to legal review.', timestamp: '2026-06-10T20:15:00Z' },
    ],
    attachments: [{ id: 'att-2', name: 'driver_statement.pdf', type: 'document', uploadedAt: '2026-06-10T19:46:00Z' }],
  },
  {
    id: 'si-4',
    caseId: 'INC-2026-0409',
    type: 'emergency',
    driverName: 'Jennifer Park',
    driverId: 'd-512',
    driverPhone: '+1 (212) 555-0421',
    passengerName: 'Michael Brown',
    passengerId: 'p-5510',
    passengerPhone: '+1 (212) 555-0654',
    tripId: 'trip-88055',
    status: 'resolved',
    priority: 'critical',
    createdAt: '2026-06-09T08:20:00Z',
    assignedTo: 'Safety Team Alpha',
    description: 'Vehicle accident reported. Emergency services dispatched.',
    gpsTimeline: [
      { timestamp: '2026-06-09T08:00:00Z', lat: 40.7128, lng: -74.006, label: 'Trip Start' },
      { timestamp: '2026-06-09T08:18:00Z', lat: 40.72, lng: -74.01, label: 'Accident Location' },
    ],
    tripHistory: [
      { event: 'Trip Started', timestamp: '2026-06-09T08:00:00Z' },
      { event: 'Emergency Reported', timestamp: '2026-06-09T08:20:00Z' },
      { event: 'Case Resolved', timestamp: '2026-06-09T12:00:00Z' },
    ],
    notes: [{ id: 'n-3', author: 'Safety Admin', content: 'All parties safe. Insurance claim initiated.', timestamp: '2026-06-09T12:00:00Z' }],
    attachments: [{ id: 'att-3', name: 'accident_photos.zip', type: 'archive', uploadedAt: '2026-06-09T08:25:00Z' }],
  },
  {
    id: 'si-5',
    caseId: 'INC-2026-0408',
    type: 'safety_case',
    driverName: 'Robert Chen',
    driverId: 'd-620',
    driverPhone: '+1 (305) 555-0333',
    passengerName: 'Emily Davis',
    passengerId: 'p-3302',
    passengerPhone: '+1 (305) 555-0444',
    tripId: 'trip-87998',
    status: 'open',
    priority: 'medium',
    createdAt: '2026-06-08T16:10:00Z',
    description: 'Routine safety review flagged unusual trip pattern.',
    gpsTimeline: baseTimeline,
    tripHistory: [{ event: 'Flagged by System', timestamp: '2026-06-08T16:10:00Z' }],
    notes: [],
    attachments: [],
  },
]

export let mockIncidentCategories: IncidentCategory[] = [
  { id: 'cat-1', name: 'SOS Alert', description: 'Emergency SOS button activation', defaultPriority: 'critical', status: 'active' },
  { id: 'cat-2', name: 'Harassment', description: 'Verbal or physical harassment reports', defaultPriority: 'high', status: 'active' },
  { id: 'cat-3', name: 'Accident', description: 'Vehicle accident or collision', defaultPriority: 'critical', status: 'active' },
  { id: 'cat-4', name: 'Unsafe Driving', description: 'Reckless or unsafe driving behavior', defaultPriority: 'high', status: 'active' },
  { id: 'cat-5', name: 'Route Deviation', description: 'Unusual route or destination issues', defaultPriority: 'medium', status: 'active' },
  { id: 'cat-6', name: 'Medical Emergency', description: 'Passenger or driver medical emergency', defaultPriority: 'critical', status: 'active' },
]

export let mockEscalationRules: EscalationRule[] = [
  { id: 'er-1', name: 'Critical SOS Escalation', triggerCondition: 'SOS alert unresolved after 5 minutes', escalateAfterMinutes: 5, escalateTo: 'Safety Team Lead', status: 'active' },
  { id: 'er-2', name: 'High Priority Timeout', triggerCondition: 'High priority case unassigned after 15 minutes', escalateAfterMinutes: 15, escalateTo: 'Operations Manager', status: 'active' },
  { id: 'er-3', name: 'Emergency Auto-Escalate', triggerCondition: 'Emergency type incident created', escalateAfterMinutes: 0, escalateTo: 'Safety Team Alpha', status: 'active' },
]

export let mockResponseSla: ResponseSlaSettings = {
  criticalResponseMinutes: 5,
  highResponseMinutes: 15,
  mediumResponseMinutes: 30,
  lowResponseMinutes: 60,
  autoEscalateEnabled: true,
}

export let mockSafetyTeam: SafetyTeamMember[] = [
  { id: 'st-1', name: 'Safety Team Alpha', role: 'Primary Response', email: 'alpha@safety.alygo.com', shift: '24/7', status: 'active' },
  { id: 'st-2', name: 'Safety Team Beta', role: 'Secondary Response', email: 'beta@safety.alygo.com', shift: 'Mon-Fri 8am-8pm', status: 'active' },
  { id: 'st-3', name: 'Maria Santos', role: 'Safety Lead', email: 'm.santos@alygo.com', shift: '24/7 On-Call', status: 'active' },
  { id: 'st-4', name: 'James Okonkwo', role: 'Compliance Reviewer', email: 'j.okonkwo@alygo.com', shift: 'Mon-Fri 9am-5pm', status: 'active' },
]

export function computeSafetyOverview(): SafetyOverview {
  return {
    openIncidents: mockSafetyIncidents.filter((i) => i.status === 'open' || i.status === 'assigned' || i.status === 'escalated').length,
    resolvedCases: mockSafetyIncidents.filter((i) => i.status === 'resolved').length,
    sosAlerts: mockSafetyIncidents.filter((i) => i.type === 'sos_alert').length,
    driverReports: mockSafetyIncidents.filter((i) => i.type === 'driver_report').length,
    passengerReports: mockSafetyIncidents.filter((i) => i.type === 'passenger_report').length,
  }
}

export const TYPE_LABELS: Record<string, string> = {
  sos_alert: 'SOS Alert',
  driver_report: 'Driver Report',
  passenger_report: 'Passenger Report',
  emergency: 'Emergency',
  safety_case: 'Safety Case',
}

export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  assigned: 'Assigned',
  escalated: 'Escalated',
  resolved: 'Resolved',
}

export const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}
