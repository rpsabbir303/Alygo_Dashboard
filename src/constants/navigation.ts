import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Car,
  CreditCard,
  FileCheck,
  Gauge,
  Globe2,
  LayoutDashboard,
  Map,
  MapPin,
  MessageSquare,
  Plane,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import type { Permission } from '@/types'

export interface NavItem {
  key: string
  label: string
  path?: string
  icon?: LucideIcon
  permission?: Permission
  children?: NavItem[]
}

export const NAVIGATION: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    permission: 'dashboard.view',
  },
  {
    key: 'operations',
    label: 'Operations',
    icon: Activity,
    permission: 'operations.view',
    children: [
      { key: 'live-trips', label: 'Live Trips', path: '/operations/live-trips' },
      { key: 'active-drivers', label: 'Active Drivers', path: '/operations/active-drivers' },
      { key: 'active-passengers', label: 'Active Passengers', path: '/operations/active-passengers' },
      { key: 'ride-monitoring', label: 'Ride Monitoring', path: '/operations/ride-monitoring' },
      { key: 'cancellation-management', label: 'Cancellation Management', path: '/operations/cancellation-management' },
      { key: 'lost-found', label: 'Lost & Found', path: '/operations/lost-found' },
      { key: 'trip-completion-review', label: 'Trip Completion Review', path: '/operations/trip-completion-review' },
      { key: 'driving-hours', label: 'Driving Hours', path: '/operations/driving-hours' },
      { key: 'destination-filters', label: 'Destination Filters', path: '/operations/destination-filters' },
      { key: 'policy-center', label: 'Operations Policy Center', path: '/operations/policy-center' },
      { key: 'safety-incidents', label: 'Safety & Incidents', path: '/operations/safety-incidents' },
    ],
  },
  {
    key: 'communication',
    label: 'Communication Center',
    icon: MessageSquare,
    permission: 'communication.view',
    children: [
      { key: 'conversations', label: 'Conversations', path: '/communication/conversations' },
      { key: 'active-trip-chats', label: 'Active Trip Chats', path: '/communication/active-trip-chats' },
      { key: 'driver-support', label: 'Driver Support', path: '/communication/driver-support' },
      { key: 'passenger-support', label: 'Passenger Support', path: '/communication/passenger-support' },
      { key: 'safety-comms', label: 'Safety Communications', path: '/communication/safety' },
      { key: 'broadcast', label: 'Broadcast Center', path: '/communication/broadcast' },
      { key: 'templates', label: 'Message Templates', path: '/communication/templates' },
      { key: 'internal-notes', label: 'Internal Notes', path: '/communication/internal-notes' },
      { key: 'comm-analytics', label: 'Communication Analytics', path: '/communication/analytics' },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    icon: Users,
    permission: 'drivers.view',
    children: [
      { key: 'drivers', label: 'Driver Management', path: '/drivers' },
      { key: 'driver-rewards', label: 'Driver Rewards & Performance', path: '/drivers/rewards' },
      { key: 'passengers', label: 'Passenger Management', path: '/passengers' },
      { key: 'waitlist', label: 'Driver Capacity & Waitlist', path: '/drivers/waitlist' },
    ],
  },
  {
    key: 'compliance',
    label: 'Compliance',
    icon: Shield,
    permission: 'compliance.view',
    children: [
      { key: 'compliance-center', label: 'Compliance Center', path: '/compliance' },
      { key: 'background-checks', label: 'Background Checks', path: '/compliance/background-checks' },
      { key: 'background-check-fees', label: 'Background Check Fees', path: '/compliance/background-check-fees' },
      { key: 'document-monitoring', label: 'Document Monitoring', path: '/compliance/documents' },
      { key: 'driver-restrictions', label: 'Driver Restrictions', path: '/compliance/restrictions' },
    ],
  },
  {
    key: 'eligibility',
    label: 'Vehicle Eligibility Engine',
    icon: FileCheck,
    permission: 'eligibility.view',
    children: [
      { key: 'eligibility-rules', label: 'Eligibility Rules', path: '/eligibility/rules' },
      { key: 'vehicle-categories', label: 'Vehicle Categories', path: '/eligibility/categories' },
      { key: 'category-assignments', label: 'Category Assignments', path: '/eligibility/assignments' },
      { key: 'premium-vehicles', label: 'Premium Vehicle Lists', path: '/eligibility/premium-vehicles' },
    ],
  },
  {
    key: 'ride-categories',
    label: 'Ride Categories',
    icon: Car,
    permission: 'eligibility.view',
    children: [
      { key: 'standard', label: 'Standard', path: '/categories/standard' },
      { key: 'comfort', label: 'Comfort', path: '/categories/comfort' },
      { key: 'xl', label: 'XL', path: '/categories/xl' },
      { key: 'pet', label: 'Pet', path: '/categories/pet' },
      { key: 'priority', label: 'Priority', path: '/categories/priority' },
      { key: 'black', label: 'Black', path: '/categories/black' },
      { key: 'black-suv', label: 'Black SUV', path: '/categories/black_suv' },
    ],
  },
  {
    key: 'demand',
    label: 'Demand Intelligence',
    icon: TrendingUp,
    permission: 'analytics.view',
    children: [
      { key: 'demand-trends', label: 'Demand Trends', path: '/demand/trends' },
      { key: 'demand-forecasting', label: 'Demand Forecasting', path: '/demand/forecasting' },
      { key: 'heat-maps', label: 'Heat Maps', path: '/demand/heat-maps' },
      { key: 'earnings-forecasts', label: 'Earnings Forecasts', path: '/demand/earnings-forecasts' },
      { key: 'event-intelligence', label: 'Event Intelligence', path: '/demand/event-intelligence' },
    ],
  },
  {
    key: 'pricing',
    label: 'Dynamic Pricing',
    icon: Gauge,
    permission: 'pricing.view',
    children: [
      { key: 'surge-zones', label: 'Surge Zones', path: '/pricing/surge-zones' },
      { key: 'pricing-rules', label: 'Pricing Rules', path: '/pricing/rules' },
      { key: 'surge-history', label: 'Surge History', path: '/pricing/surge-history' },
    ],
  },
  {
    key: 'reservations',
    label: 'Reservations',
    icon: MapPin,
    permission: 'reservations.view',
    children: [
      { key: 'scheduled-rides', label: 'Scheduled Rides', path: '/reservations/scheduled' },
      { key: 'airport-reservations', label: 'Airport Reservations', path: '/reservations/airport' },
      { key: 'event-reservations', label: 'Event Reservations', path: '/reservations/events' },
    ],
  },
  {
    key: 'locations',
    label: 'Location Management',
    icon: Globe2,
    permission: 'settings.view',
    children: [
      { key: 'states', label: 'States', path: '/locations/states' },
      { key: 'state-activation', label: 'State Activation Control', path: '/locations/state-activation' },
      { key: 'cities', label: 'Cities', path: '/locations/cities' },
      { key: 'airports', label: 'Airports', path: '/locations/airports' },
      { key: 'airport-queue', label: 'Airport Queue Management', path: '/locations/airport-queue' },
      { key: 'zones', label: 'Zones', path: '/locations/zones' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: Wallet,
    permission: 'finance.view',
    children: [
      { key: 'revenue', label: 'Revenue', path: '/finance/revenue' },
      { key: 'driver-payouts', label: 'Driver Payouts', path: '/finance/payouts' },
      { key: 'wallet-management', label: 'Wallet Management', path: '/finance/wallets' },
      { key: 'transactions', label: 'Transaction History', path: '/finance/transactions' },
    ],
  },
  {
    key: 'analytics',
    label: 'Reports & Analytics',
    icon: BarChart3,
    permission: 'analytics.view',
    children: [
      { key: 'driver-analytics', label: 'Driver Analytics', path: '/analytics/drivers' },
      { key: 'passenger-analytics', label: 'Passenger Analytics', path: '/analytics/passengers' },
      { key: 'revenue-analytics', label: 'Revenue Analytics', path: '/analytics/revenue' },
      { key: 'demand-analytics', label: 'Demand Analytics', path: '/analytics/demand' },
      { key: 'compliance-analytics', label: 'Compliance Analytics', path: '/analytics/compliance' },
    ],
  },
  {
    key: 'settings',
    label: 'System Settings',
    icon: Settings,
    permission: 'settings.view',
    children: [
      { key: 'platform-settings', label: 'Platform Settings', path: '/settings/platform' },
      { key: 'notifications', label: 'Notifications', path: '/settings/notifications' },
      { key: 'integrations', label: 'Integrations', path: '/settings/integrations' },
      { key: 'admin-roles', label: 'Admin Roles', path: '/settings/admin-roles' },
    ],
  },
]

export const QUICK_LINKS = [
  { label: 'Airport Queue', path: '/locations/airport-queue', icon: Plane },
  { label: 'Surge Monitor', path: '/pricing/surge-zones', icon: AlertTriangle },
  { label: 'Live Map', path: '/operations/ride-monitoring', icon: Map },
  { label: 'Stripe Payouts', path: '/finance/payouts', icon: CreditCard },
  { label: 'Compliance Alerts', path: '/compliance', icon: Building2 },
]
