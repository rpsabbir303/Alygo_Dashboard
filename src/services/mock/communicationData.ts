import type {
  BroadcastRecord,
  ChatMessage,
  CommunicationAnalytics,
  CommunicationHistoryEntry,
  CommunicationOverview,
  Conversation,
  InternalNote,
  MessageTemplate,
  SafetyCommunication,
  SupportCase,
} from '@/types/communication'
import { mockTrips } from '@/services/mock/data'

export let mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userName: 'Marcus Johnson',
    userType: 'driver',
    userId: 'd-204',
    lastMessage: 'Passenger is not at pickup location',
    priority: 'high',
    assignedAgent: 'Sarah Kim',
    status: 'in_progress',
    lastActivity: '2026-06-13T14:22:00Z',
    category: 'active_trip',
    tripId: 'TR-5000',
    city: 'San Francisco',
    isOnline: true,
    unreadCount: 2,
    isTyping: true,
  },
  {
    id: 'conv-2',
    userName: 'Sarah Chen',
    userType: 'passenger',
    userId: 'p-4412',
    lastMessage: 'Driver is taking a different route',
    priority: 'medium',
    assignedAgent: 'Mike Torres',
    status: 'open',
    lastActivity: '2026-06-13T14:18:00Z',
    category: 'active_trip',
    tripId: 'TR-5000',
    city: 'San Francisco',
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    userName: 'David Kim',
    userType: 'driver',
    userId: 'd-118',
    lastMessage: 'SOS alert acknowledged — need assistance',
    priority: 'critical',
    assignedAgent: 'Safety Team Alpha',
    status: 'escalated',
    lastActivity: '2026-06-13T14:10:00Z',
    category: 'safety',
    tripId: 'TR-5001',
    city: 'Los Angeles',
    isOnline: true,
    unreadCount: 5,
  },
  {
    id: 'conv-4',
    userName: 'James Wilson',
    userType: 'passenger',
    userId: 'p-3891',
    lastMessage: 'Left my phone in the car',
    priority: 'medium',
    assignedAgent: 'Lisa Park',
    status: 'waiting_user',
    lastActivity: '2026-06-13T13:45:00Z',
    category: 'lost_found',
    tripId: 'TR-5002',
    city: 'Los Angeles',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: 'conv-5',
    userName: 'Lisa Martinez',
    userType: 'driver',
    userId: 'd-089',
    lastMessage: 'Refund request for background check fee',
    priority: 'low',
    assignedAgent: 'Compliance Admin',
    status: 'in_progress',
    lastActivity: '2026-06-13T12:30:00Z',
    category: 'general',
    city: 'San Francisco',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: 'conv-6',
    userName: 'Elena Rodriguez',
    userType: 'passenger',
    userId: 'p-2201',
    lastMessage: 'Payment was charged twice',
    priority: 'high',
    assignedAgent: 'Mike Torres',
    status: 'escalated',
    lastActivity: '2026-06-13T11:15:00Z',
    category: 'escalation',
    tripId: 'TR-5003',
    city: 'New York',
    isOnline: true,
    unreadCount: 3,
  },
  {
    id: 'conv-7',
    userName: 'Tom Bradley',
    userType: 'driver',
    userId: 'd-312',
    lastMessage: 'Document upload issue resolved, thanks',
    priority: 'low',
    assignedAgent: 'Sarah Kim',
    status: 'resolved',
    lastActivity: '2026-06-12T22:00:00Z',
    category: 'support',
    city: 'Chicago',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: 'conv-8',
    userName: 'Amy Foster',
    userType: 'passenger',
    userId: 'p-5501',
    lastMessage: 'Driver was very professional',
    priority: 'low',
    assignedAgent: 'Lisa Park',
    status: 'closed',
    lastActivity: '2026-06-12T18:30:00Z',
    category: 'support',
    city: 'Miami',
    isOnline: false,
    unreadCount: 0,
  },
]

const baseMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    { id: 'm-1', conversationId: 'conv-1', senderId: 'd-204', senderName: 'Marcus Johnson', senderRole: 'driver', type: 'text', content: 'I arrived at the pickup but passenger is not here.', timestamp: '2026-06-13T14:15:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-2', conversationId: 'conv-1', senderId: 'admin-1', senderName: 'Sarah Kim', senderRole: 'admin', type: 'text', content: 'Thank you Marcus. We are contacting the passenger now. Please wait 5 minutes.', timestamp: '2026-06-13T14:17:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-3', conversationId: 'conv-1', senderId: 'd-204', senderName: 'Marcus Johnson', senderRole: 'driver', type: 'gps', content: 'Current location shared', gpsLabel: 'Pickup — 123 Market St, SF', timestamp: '2026-06-13T14:20:00Z', deliveryStatus: 'delivered', isRead: false },
    { id: 'm-4', conversationId: 'conv-1', senderId: 'd-204', senderName: 'Marcus Johnson', senderRole: 'driver', type: 'text', content: 'Passenger is not at pickup location', timestamp: '2026-06-13T14:22:00Z', deliveryStatus: 'delivered', isRead: false },
  ],
  'conv-2': [
    { id: 'm-5', conversationId: 'conv-2', senderId: 'p-4412', senderName: 'Sarah Chen', senderRole: 'passenger', type: 'text', content: 'The driver seems to be going the wrong way.', timestamp: '2026-06-13T14:10:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-6', conversationId: 'conv-2', senderId: 'admin-2', senderName: 'Mike Torres', senderRole: 'admin', type: 'text', content: 'We are reviewing the route now. Your safety is our priority.', timestamp: '2026-06-13T14:12:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-7', conversationId: 'conv-2', senderId: 'p-4412', senderName: 'Sarah Chen', senderRole: 'passenger', type: 'text', content: 'Driver is taking a different route', timestamp: '2026-06-13T14:18:00Z', deliveryStatus: 'delivered', isRead: false },
  ],
  'conv-3': [
    { id: 'm-8', conversationId: 'conv-3', senderId: 'system', senderName: 'System', senderRole: 'system', type: 'system', content: 'SOS alert triggered on trip TRP-88190', timestamp: '2026-06-13T14:05:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-9', conversationId: 'conv-3', senderId: 'd-118', senderName: 'David Kim', senderRole: 'driver', type: 'voice', content: 'Voice note attached', attachmentName: 'sos_recording.mp3', timestamp: '2026-06-13T14:06:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-10', conversationId: 'conv-3', senderId: 'admin-safety', senderName: 'Safety Team Alpha', senderRole: 'admin', type: 'text', content: 'David, we have received your SOS. Are you safe? Please respond.', timestamp: '2026-06-13T14:08:00Z', deliveryStatus: 'read', isRead: true },
    { id: 'm-11', conversationId: 'conv-3', senderId: 'd-118', senderName: 'David Kim', senderRole: 'driver', type: 'text', content: 'SOS alert acknowledged — need assistance', timestamp: '2026-06-13T14:10:00Z', deliveryStatus: 'delivered', isRead: false },
  ],
}

export let mockChatMessages: Record<string, ChatMessage[]> = { ...baseMessages }

export let mockMessageTemplates: MessageTemplate[] = [
  { id: 'tpl-1', name: 'Driver En Route', category: 'trip_updates', content: 'Your driver is on the way and will arrive shortly.', status: 'active', usageCount: 1240, updatedAt: '2026-06-01T00:00:00Z' },
  { id: 'tpl-2', name: 'Passenger Not Found', category: 'trip_updates', content: 'We could not locate you at the pickup point. Please confirm your location or the driver may cancel after the wait time.', status: 'active', usageCount: 890, updatedAt: '2026-06-01T00:00:00Z' },
  { id: 'tpl-3', name: 'Ride Delayed', category: 'trip_updates', content: 'Your ride is experiencing a delay. We apologize for the inconvenience and are working to resolve this quickly.', status: 'active', usageCount: 650, updatedAt: '2026-06-02T00:00:00Z' },
  { id: 'tpl-4', name: 'Traffic Delay', category: 'trip_updates', content: 'Heavy traffic is affecting your trip. Your driver is taking the fastest available route.', status: 'active', usageCount: 2100, updatedAt: '2026-06-02T00:00:00Z' },
  { id: 'tpl-5', name: 'Safety Check', category: 'safety', content: 'This is a safety check from Alygo Support. Are you safe and is everything okay with your trip?', status: 'active', usageCount: 420, updatedAt: '2026-06-03T00:00:00Z' },
  { id: 'tpl-6', name: 'Lost & Found Follow-up', category: 'lost_found', content: 'We are following up on your lost item report. Our team is coordinating with the driver to locate your belongings.', status: 'active', usageCount: 310, updatedAt: '2026-06-03T00:00:00Z' },
  { id: 'tpl-7', name: 'Cancellation Review', category: 'cancellation', content: 'We are reviewing your cancellation request. You will receive an update within 24 hours.', status: 'active', usageCount: 780, updatedAt: '2026-06-04T00:00:00Z' },
  { id: 'tpl-8', name: 'Payment Issue', category: 'payment', content: 'We detected a payment issue on your account. Please update your payment method or contact support.', status: 'active', usageCount: 560, updatedAt: '2026-06-04T00:00:00Z' },
  { id: 'tpl-9', name: 'Refund Approved', category: 'payment', content: 'Your refund request has been approved. Funds will be returned within 3-5 business days.', status: 'active', usageCount: 340, updatedAt: '2026-06-05T00:00:00Z' },
  { id: 'tpl-10', name: 'Refund Denied', category: 'payment', content: 'After review, your refund request could not be approved. Please see the case notes for details.', status: 'active', usageCount: 120, updatedAt: '2026-06-05T00:00:00Z' },
  { id: 'tpl-11', name: 'Account Verification', category: 'compliance', content: 'Please complete your account verification to continue using Alygo. Upload required documents in the app.', status: 'active', usageCount: 980, updatedAt: '2026-06-06T00:00:00Z' },
  { id: 'tpl-12', name: 'Compliance Reminder', category: 'compliance', content: 'Your compliance documents are expiring soon. Please renew them to avoid account restrictions.', status: 'active', usageCount: 450, updatedAt: '2026-06-06T00:00:00Z' },
]

export let mockInternalNotes: InternalNote[] = [
  { id: 'note-1', userId: 'p-5501', userName: 'Amy Foster', userType: 'passenger', noteType: 'vip', content: 'VIP passenger — priority support required.', author: 'Sarah Kim', createdAt: '2026-06-10T10:00:00Z' },
  { id: 'note-2', userId: 'd-312', userName: 'Tom Bradley', userType: 'driver', noteType: 'compliance', content: 'Background check pending re-verification.', author: 'Compliance Admin', createdAt: '2026-06-11T14:00:00Z', tripId: 'TRP-87900' },
  { id: 'note-3', userId: 'd-118', userName: 'David Kim', userType: 'driver', noteType: 'safety', content: 'Previous harassment report filed — handle with care.', author: 'Safety Team Alpha', createdAt: '2026-06-12T09:00:00Z', tripId: 'TRP-88190' },
  { id: 'note-4', userId: 'p-2201', userName: 'Elena Rodriguez', userType: 'passenger', noteType: 'fraud', content: 'Multiple chargeback attempts flagged.', author: 'Finance Admin', createdAt: '2026-06-12T16:00:00Z' },
  { id: 'note-5', userId: 'p-3891', userName: 'James Wilson', userType: 'passenger', noteType: 'support', content: 'Repeat lost item reporter — verify claims.', author: 'Lisa Park', createdAt: '2026-06-13T08:00:00Z', tripId: 'TRP-88102' },
]

export let mockSupportCases: SupportCase[] = [
  { id: 'case-1', caseNumber: 'CASE-2026-0412', type: 'safety', status: 'escalated', subject: 'SOS alert during active trip', userName: 'David Kim', userType: 'driver', assignedAgent: 'Safety Team Alpha', priority: 'critical', tripId: 'TRP-88190', city: 'Los Angeles', createdAt: '2026-06-13T14:05:00Z', updatedAt: '2026-06-13T14:10:00Z' },
  { id: 'case-2', caseNumber: 'CASE-2026-0411', type: 'lost_found', status: 'investigating', subject: 'Phone left in vehicle', userName: 'James Wilson', userType: 'passenger', assignedAgent: 'Lisa Park', priority: 'medium', tripId: 'TRP-88102', city: 'Los Angeles', createdAt: '2026-06-13T13:40:00Z', updatedAt: '2026-06-13T13:45:00Z' },
  { id: 'case-3', caseNumber: 'CASE-2026-0410', type: 'fare_dispute', status: 'waiting_user', subject: 'Double charge on trip', userName: 'Elena Rodriguez', userType: 'passenger', assignedAgent: 'Mike Torres', priority: 'high', tripId: 'TRP-88055', city: 'New York', createdAt: '2026-06-13T10:00:00Z', updatedAt: '2026-06-13T11:15:00Z' },
  { id: 'case-4', caseNumber: 'CASE-2026-0409', type: 'refund', status: 'open', subject: 'Background check fee refund', userName: 'Lisa Martinez', userType: 'driver', assignedAgent: 'Compliance Admin', priority: 'low', city: 'San Francisco', createdAt: '2026-06-13T12:00:00Z', updatedAt: '2026-06-13T12:30:00Z' },
  { id: 'case-5', caseNumber: 'CASE-2026-0408', type: 'driver_complaint', status: 'resolved', subject: 'Passenger no-show dispute', userName: 'Marcus Johnson', userType: 'driver', assignedAgent: 'Sarah Kim', priority: 'medium', tripId: 'TRP-88241', city: 'San Francisco', createdAt: '2026-06-12T20:00:00Z', updatedAt: '2026-06-13T14:00:00Z' },
]

export let mockSafetyCommunications: SafetyCommunication[] = [
  { id: 'safe-1', reportType: 'sos', userName: 'David Kim', userType: 'driver', tripId: 'TRP-88190', city: 'Los Angeles', status: 'escalated', priority: 'critical', assignedAgent: 'Safety Team Alpha', lastActivity: '2026-06-13T14:10:00Z', description: 'Driver triggered SOS during active trip' },
  { id: 'safe-2', reportType: 'passenger_report', userName: 'Sarah Chen', userType: 'passenger', tripId: 'TRP-88241', city: 'San Francisco', status: 'in_progress', priority: 'high', assignedAgent: 'Mike Torres', lastActivity: '2026-06-13T14:18:00Z', description: 'Passenger reported route deviation concern' },
  { id: 'safe-3', reportType: 'harassment', userName: 'James Wilson', userType: 'passenger', tripId: 'TRP-87800', city: 'Chicago', status: 'open', priority: 'high', assignedAgent: 'Safety Team Beta', lastActivity: '2026-06-12T18:00:00Z', description: 'Harassment report filed post-trip' },
  { id: 'safe-4', reportType: 'accident', userName: 'Tom Bradley', userType: 'driver', tripId: 'TRP-87750', city: 'Miami', status: 'in_progress', priority: 'critical', assignedAgent: 'Safety Team Alpha', lastActivity: '2026-06-11T22:00:00Z', description: 'Minor accident reported — no injuries' },
]

export let mockBroadcasts: BroadcastRecord[] = [
  { id: 'bc-1', title: 'Platform Maintenance', message: 'Scheduled maintenance tonight 2-4 AM PST. Minimal service disruption expected.', broadcastType: 'maintenance', target: 'all_drivers', recipientCount: 12400, sentBy: 'Super Admin', sentAt: '2026-06-12T20:00:00Z', status: 'sent' },
  { id: 'bc-2', title: 'SF Surge Opportunity', message: 'High demand in downtown SF. Surge pricing active — great earning opportunity.', broadcastType: 'surge', target: 'city', targetValue: 'San Francisco', recipientCount: 3200, sentBy: 'Operations Manager', sentAt: '2026-06-13T08:00:00Z', status: 'sent' },
  { id: 'bc-3', title: 'Weather Alert — LA', message: 'Heavy rain expected. Drive safely and allow extra time for pickups.', broadcastType: 'weather', target: 'city', targetValue: 'Los Angeles', recipientCount: 8900, sentBy: 'Operations Manager', sentAt: '2026-06-13T06:00:00Z', status: 'sent' },
]

export let mockCommunicationHistory: CommunicationHistoryEntry[] = [
  { id: 'hist-1', eventType: 'message', description: 'Admin sent safety check message', userName: 'David Kim', userType: 'driver', agent: 'Safety Team Alpha', tripId: 'TRP-88190', city: 'Los Angeles', timestamp: '2026-06-13T14:08:00Z' },
  { id: 'hist-2', eventType: 'escalation', description: 'Case escalated to senior safety team', userName: 'David Kim', userType: 'driver', agent: 'Safety Team Alpha', tripId: 'TRP-88190', city: 'Los Angeles', timestamp: '2026-06-13T14:09:00Z' },
  { id: 'hist-3', eventType: 'status_change', description: 'Conversation status changed to In Progress', userName: 'Marcus Johnson', userType: 'driver', agent: 'Sarah Kim', tripId: 'TRP-88241', city: 'San Francisco', timestamp: '2026-06-13T14:17:00Z' },
  { id: 'hist-4', eventType: 'note', description: 'Internal fraud note added', userName: 'Elena Rodriguez', userType: 'passenger', agent: 'Finance Admin', city: 'New York', timestamp: '2026-06-12T16:00:00Z' },
  { id: 'hist-5', eventType: 'attachment', description: 'Voice note uploaded', userName: 'David Kim', userType: 'driver', tripId: 'TRP-88190', city: 'Los Angeles', timestamp: '2026-06-13T14:06:00Z' },
]

export function computeCommunicationOverview(): CommunicationOverview {
  const active = mockConversations.filter((c) => !['resolved', 'closed'].includes(c.status))
  return {
    openConversations: active.length,
    activeSupportAgents: 8,
    activeDriverChats: mockConversations.filter((c) => c.userType === 'driver' && !['resolved', 'closed'].includes(c.status)).length,
    activePassengerChats: mockConversations.filter((c) => c.userType === 'passenger' && !['resolved', 'closed'].includes(c.status)).length,
    averageResponseTimeMinutes: 3.2,
    resolvedConversations: mockConversations.filter((c) => c.status === 'resolved').length,
    safetyCases: mockSafetyCommunications.filter((s) => !['resolved', 'closed'].includes(s.status)).length,
    escalatedCases: mockConversations.filter((c) => c.status === 'escalated').length,
  }
}

export function computeCommunicationAnalytics(): CommunicationAnalytics {
  return {
    summary: {
      totalConversations: 1842,
      averageResolutionTimeHours: 4.6,
      firstResponseTimeMinutes: 2.8,
      escalationRate: 8.4,
      satisfactionScore: 4.6,
    },
    conversationsPerDay: [
      { label: 'Mon', value: 245 },
      { label: 'Tue', value: 268 },
      { label: 'Wed', value: 290 },
      { label: 'Thu', value: 312 },
      { label: 'Fri', value: 285 },
      { label: 'Sat', value: 220 },
      { label: 'Sun', value: 198 },
    ],
    responseTimeTrend: [
      { label: 'Mon', value: 3.8, secondary: 2.1 },
      { label: 'Tue', value: 3.2, secondary: 1.9 },
      { label: 'Wed', value: 2.9, secondary: 1.8 },
      { label: 'Thu', value: 3.1, secondary: 2.0 },
      { label: 'Fri', value: 3.5, secondary: 2.2 },
      { label: 'Sat', value: 4.2, secondary: 2.8 },
      { label: 'Sun', value: 4.0, secondary: 2.5 },
    ],
    resolutionRate: [
      { label: 'Mon', value: 92 },
      { label: 'Tue', value: 94 },
      { label: 'Wed', value: 91 },
      { label: 'Thu', value: 95 },
      { label: 'Fri', value: 89 },
      { label: 'Sat', value: 88 },
      { label: 'Sun', value: 90 },
    ],
    safetyCasesTrend: [
      { label: 'Mon', value: 4 },
      { label: 'Tue', value: 6 },
      { label: 'Wed', value: 3 },
      { label: 'Thu', value: 8 },
      { label: 'Fri', value: 5 },
      { label: 'Sat', value: 7 },
      { label: 'Sun', value: 2 },
    ],
    agentPerformance: [
      { label: 'Sarah K.', value: 98 },
      { label: 'Mike T.', value: 94 },
      { label: 'Lisa P.', value: 91 },
      { label: 'Safety A.', value: 96 },
      { label: 'Compliance', value: 88 },
    ],
    satisfactionTrend: [
      { label: 'Mon', value: 4.5 },
      { label: 'Tue', value: 4.6 },
      { label: 'Wed', value: 4.7 },
      { label: 'Thu', value: 4.6 },
      { label: 'Fri', value: 4.5 },
      { label: 'Sat', value: 4.4 },
      { label: 'Sun', value: 4.5 },
    ],
  }
}

export function getActiveTripChats() {
  const activeTrips = mockTrips.filter((t) => ['accepted', 'in_progress', 'requested'].includes(t.status))
  return activeTrips.slice(0, 10).map((trip, i) => {
    const conv = mockConversations.find((c) => c.tripId === trip.id)
    return {
      trip,
      conversationId: conv?.id ?? mockConversations[i % mockConversations.length]?.id ?? `conv-trip-${trip.id}`,
      driverOnline: i % 2 === 0,
      passengerOnline: i % 3 !== 0,
      unreadCount: conv?.unreadCount ?? i % 4,
      lastMessage: conv?.lastMessage ?? 'No messages yet',
      lastActivity: conv?.lastActivity ?? trip.startedAt,
    }
  })
}

export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  waiting_user: 'Waiting User',
  escalated: 'Escalated',
  resolved: 'Resolved',
  closed: 'Closed',
  investigating: 'Investigating',
}

export const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const CATEGORY_LABELS: Record<string, string> = {
  trip_updates: 'Trip Updates',
  safety: 'Safety',
  lost_found: 'Lost & Found',
  cancellation: 'Cancellation',
  payment: 'Payment',
  compliance: 'Compliance',
  general: 'General',
}

export const BROADCAST_TARGET_LABELS: Record<string, string> = {
  all_drivers: 'All Drivers',
  all_passengers: 'All Passengers',
  city: 'City Specific',
  state: 'State Specific',
  airport_drivers: 'Airport Drivers',
  black_drivers: 'Black Category Drivers',
  black_suv_drivers: 'Black SUV Drivers',
  platinum_drivers: 'Platinum Drivers',
  diamond_drivers: 'Diamond Drivers',
}

export const BROADCAST_TYPE_LABELS: Record<string, string> = {
  maintenance: 'Maintenance Alert',
  service: 'Service Alert',
  weather: 'Weather Alert',
  surge: 'Surge Opportunity',
  airport: 'Airport Notice',
  emergency: 'Emergency Notice',
  platform_update: 'Platform Update',
}

export const CASE_TYPE_LABELS: Record<string, string> = {
  safety: 'Safety',
  lost_found: 'Lost & Found',
  cancellation: 'Cancellation',
  fare_dispute: 'Fare Dispute',
  driver_complaint: 'Driver Complaint',
  passenger_complaint: 'Passenger Complaint',
  refund: 'Refund',
  technical: 'Technical Issue',
}

export const NOTE_TYPE_LABELS: Record<string, string> = {
  fraud: 'Fraud Note',
  compliance: 'Compliance Note',
  safety: 'Safety Note',
  support: 'Support Note',
  vip: 'VIP User Note',
}

export const SAFETY_TYPE_LABELS: Record<string, string> = {
  sos: 'SOS Case',
  emergency: 'Emergency Alert',
  driver_report: 'Driver Safety Report',
  passenger_report: 'Passenger Safety Report',
  harassment: 'Harassment Report',
  accident: 'Accident Report',
}
