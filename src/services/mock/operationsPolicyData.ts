import type { OperationsPolicyOverview, OperationsPolicyRule } from '@/types/operationsPolicy'

export let mockOperationsPolicies: OperationsPolicyRule[] = [
  { id: 'op-dh-1', category: 'driving_hours', name: 'Maximum Daily Driving Hours', description: 'Global cap on consecutive driving hours per day', value: '12 hours', numericValue: 12, unit: 'hours', status: 'active', lastUpdated: '2026-05-01T00:00:00Z', updatedBy: 'Super Admin' },
  { id: 'op-dh-2', category: 'driving_hours', name: 'Required Rest Period', description: 'Minimum off-duty hours before next shift', value: '8 hours', numericValue: 8, unit: 'hours', status: 'active', lastUpdated: '2026-05-01T00:00:00Z', updatedBy: 'Super Admin' },
  { id: 'op-dh-3', category: 'driving_hours', name: 'Warning Threshold', description: 'Hours remaining before limit warning notification', value: '2 hours', numericValue: 2, unit: 'hours', status: 'active', lastUpdated: '2026-05-15T00:00:00Z', updatedBy: 'Operations Manager' },
  { id: 'op-df-1', category: 'destination_filter', name: 'Journey Daily Filter Limit', description: 'Max destination filters per day for Journey tier', value: '2 filters', numericValue: 2, unit: 'filters', status: 'active', lastUpdated: '2026-04-20T00:00:00Z', updatedBy: 'Operations Manager' },
  { id: 'op-df-2', category: 'destination_filter', name: 'Diamond Weekly Filter Limit', description: 'Max destination filters per week for Diamond tier', value: '40 filters', numericValue: 40, unit: 'filters', status: 'active', lastUpdated: '2026-04-20T00:00:00Z', updatedBy: 'Operations Manager' },
  { id: 'op-df-3', category: 'destination_filter', name: 'Filter Expiration Default', description: 'Default expiration time for active filters', value: '6 hours', numericValue: 6, unit: 'hours', status: 'active', lastUpdated: '2026-04-20T00:00:00Z', updatedBy: 'Operations Manager' },
  { id: 'op-fa-1', category: 'fare_adjustment', name: 'Max Fare Adjustment Percentage', description: 'Maximum percentage a fare can be adjusted', value: '50%', numericValue: 50, unit: 'percent', status: 'active', lastUpdated: '2026-03-10T00:00:00Z', updatedBy: 'Finance Manager' },
  { id: 'op-fa-2', category: 'fare_adjustment', name: 'Auto-Adjust Threshold', description: 'Distance delta meters triggering auto fare review', value: '200 meters', numericValue: 200, unit: 'meters', status: 'active', lastUpdated: '2026-03-10T00:00:00Z', updatedBy: 'Finance Manager' },
  { id: 'op-fa-3', category: 'fare_adjustment', name: 'Route Deviation Tolerance', description: 'Allowed route deviation before flagging', value: '15%', numericValue: 15, unit: 'percent', status: 'active', lastUpdated: '2026-03-10T00:00:00Z', updatedBy: 'Finance Manager' },
  { id: 'op-rf-1', category: 'refund', name: 'Full Refund Auto-Approval Limit', description: 'Max fare amount for automatic full refund', value: '$25', numericValue: 25, unit: 'USD', status: 'active', lastUpdated: '2026-02-01T00:00:00Z', updatedBy: 'Finance Manager' },
  { id: 'op-rf-2', category: 'refund', name: 'Partial Refund Default Percentage', description: 'Default partial refund for early dropoff complaints', value: '50%', numericValue: 50, unit: 'percent', status: 'active', lastUpdated: '2026-02-01T00:00:00Z', updatedBy: 'Finance Manager' },
  { id: 'op-rf-3', category: 'refund', name: 'Refund Processing SLA', description: 'Maximum hours to process approved refunds', value: '48 hours', numericValue: 48, unit: 'hours', status: 'active', lastUpdated: '2026-02-01T00:00:00Z', updatedBy: 'Finance Manager' },
  { id: 'op-dp-1', category: 'driver_penalty', name: 'Early Dropoff Warning Threshold', description: 'Complaints before driver warning', value: '2 complaints', numericValue: 2, unit: 'count', status: 'active', lastUpdated: '2026-01-15T00:00:00Z', updatedBy: 'Compliance Manager' },
  { id: 'op-dp-2', category: 'driver_penalty', name: 'Suspension Threshold', description: 'Complaints before temporary suspension', value: '5 complaints', numericValue: 5, unit: 'count', status: 'active', lastUpdated: '2026-01-15T00:00:00Z', updatedBy: 'Compliance Manager' },
  { id: 'op-dp-3', category: 'driver_penalty', name: 'Repeat Offender Period', description: 'Days to track repeat offender status', value: '90 days', numericValue: 90, unit: 'days', status: 'active', lastUpdated: '2026-01-15T00:00:00Z', updatedBy: 'Compliance Manager' },
]

export function computeOperationsPolicyOverview(): OperationsPolicyOverview {
  const byCategory = (cat: OperationsPolicyRule['category']) =>
    mockOperationsPolicies.filter((p) => p.category === cat && p.status === 'active').length

  return {
    totalPolicies: mockOperationsPolicies.length,
    activePolicies: mockOperationsPolicies.filter((p) => p.status === 'active').length,
    drivingHourPolicies: byCategory('driving_hours'),
    destinationFilterPolicies: byCategory('destination_filter'),
    fareAdjustmentRules: byCategory('fare_adjustment'),
    refundRules: byCategory('refund'),
    driverPenaltyRules: byCategory('driver_penalty'),
  }
}
