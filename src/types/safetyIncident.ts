export type IncidentType = 'sos_alert' | 'driver_report' | 'passenger_report' | 'emergency' | 'safety_case'

export type IncidentStatus = 'open' | 'assigned' | 'escalated' | 'resolved'

export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low'

export interface GpsTimelinePoint {
  timestamp: string
  lat: number
  lng: number
  label: string
}

export interface IncidentNote {
  id: string
  author: string
  content: string
  timestamp: string
}

export interface IncidentAttachment {
  id: string
  name: string
  type: string
  uploadedAt: string
}

export interface TripHistoryEntry {
  event: string
  timestamp: string
}

export interface SafetyIncident {
  id: string
  caseId: string
  type: IncidentType
  driverName: string
  driverId: string
  driverPhone: string
  passengerName: string
  passengerId: string
  passengerPhone: string
  tripId: string
  status: IncidentStatus
  priority: IncidentPriority
  createdAt: string
  assignedTo?: string
  description: string
  gpsTimeline: GpsTimelinePoint[]
  tripHistory: TripHistoryEntry[]
  notes: IncidentNote[]
  attachments: IncidentAttachment[]
}

export interface SafetyOverview {
  openIncidents: number
  resolvedCases: number
  sosAlerts: number
  driverReports: number
  passengerReports: number
}

export interface IncidentCategory {
  id: string
  name: string
  description: string
  defaultPriority: IncidentPriority
  status: 'active' | 'inactive'
}

export interface EscalationRule {
  id: string
  name: string
  triggerCondition: string
  escalateAfterMinutes: number
  escalateTo: string
  status: 'active' | 'inactive'
}

export interface ResponseSlaSettings {
  criticalResponseMinutes: number
  highResponseMinutes: number
  mediumResponseMinutes: number
  lowResponseMinutes: number
  autoEscalateEnabled: boolean
}

export interface SafetyTeamMember {
  id: string
  name: string
  role: string
  email: string
  shift: string
  status: 'active' | 'inactive'
}
