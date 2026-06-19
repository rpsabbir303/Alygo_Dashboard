import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LazyPageFallback } from '@/components/common/PageLoader'
import { GuestRoute } from '@/features/auth/components/GuestRoute'
import { AuthLayout, DashboardLayout } from '@/layouts'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const OtpVerificationPage = lazy(() => import('@/features/auth/pages/OtpVerificationPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const PasswordUpdatedPage = lazy(() => import('@/features/auth/pages/PasswordUpdatedPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const DriversPage = lazy(() => import('@/features/drivers/DriversPage'))
const DriverProfilePage = lazy(() => import('@/features/drivers/DriverProfilePage'))
const DriverWaitlistPage = lazy(() => import('@/features/driver-capacity/DriverCapacityPage'))
const PassengersPage = lazy(() => import('@/features/passengers/PassengersPage'))
const PassengerProfilePage = lazy(() => import('@/features/passengers/PassengerProfilePage'))
const LiveTripsPage = lazy(() => import('@/features/operations/LiveTripsPage'))
const RideMonitoringPage = lazy(() => import('@/features/operations/RideMonitoringPage'))
const CancellationManagementPage = lazy(() => import('@/features/cancellations/CancellationManagementPage'))
const DriverRewardsPage = lazy(() => import('@/features/driver-rewards/DriverRewardsPage'))
const TierManagementPage = lazy(() => import('@/features/driver-rewards/TierManagementPage'))
const LostFoundManagementPage = lazy(() => import('@/features/lost-found/LostFoundManagementPage'))
const TripCompletionReviewPage = lazy(() => import('@/features/trip-completion-review/TripCompletionReviewPage'))
const DrivingHoursManagementPage = lazy(() => import('@/features/driving-hours/DrivingHoursManagementPage'))
const DestinationFilterManagementPage = lazy(() => import('@/features/destination-filters/DestinationFilterManagementPage'))
const OperationsPolicyCenterPage = lazy(() => import('@/features/operations-policy/OperationsPolicyCenterPage'))
const LocationDashboardPage = lazy(() => import('@/features/locations/LocationDashboardPage'))
const SafetyIncidentPage = lazy(() => import('@/features/safety-incidents/SafetyIncidentPage'))
const BackgroundCheckFeePage = lazy(() => import('@/features/background-check-fees/BackgroundCheckFeePage'))
const ConversationsPage = lazy(() => import('@/features/communication/pages/ConversationsPage'))
const ActiveTripChatsPage = lazy(() => import('@/features/communication/pages/ActiveTripChatsPage'))
const DriverSupportPage = lazy(() => import('@/features/communication/pages/DriverSupportPage'))
const PassengerSupportPage = lazy(() => import('@/features/communication/pages/PassengerSupportPage'))
const SafetyCommunicationsPage = lazy(() => import('@/features/communication/pages/SafetyCommunicationsPage'))
const BroadcastCenterPage = lazy(() => import('@/features/communication/pages/BroadcastCenterPage'))
const MessageTemplatesPage = lazy(() => import('@/features/communication/pages/MessageTemplatesPage'))
const CommunicationAnalyticsPage = lazy(() => import('@/features/communication/pages/CommunicationAnalyticsPage'))
const ComplianceCenterPage = lazy(() => import('@/features/compliance/ComplianceCenterPage'))
const BackgroundChecksPage = lazy(() => import('@/features/compliance/BackgroundChecksPage'))
const DocumentMonitoringPage = lazy(() => import('@/features/compliance/DocumentMonitoringPage'))
const DriverRestrictionsPage = lazy(() => import('@/features/compliance/DriverRestrictionsPage'))
const EligibilityRulesPage = lazy(() => import('@/features/eligibility/EligibilityRulesPage'))
const VehicleCategoriesPage = lazy(() => import('@/features/eligibility/VehicleCategoriesPage'))
const CategoryAssignmentsPage = lazy(() => import('@/features/eligibility/CategoryAssignmentsPage'))
const PremiumVehiclesPage = lazy(() => import('@/features/eligibility/PremiumVehiclesPage'))
const CategoryDetailPage = lazy(() => import('@/features/categories/CategoryDetailPage'))
const DemandIntelligenceCenterPage = lazy(() => import('@/features/demand-intelligence/DemandIntelligenceCenterPage'))
const DynamicPricingCenterPage = lazy(() => import('@/features/pricing/DynamicPricingCenterPage'))
const ReservationCenterPage = lazy(() => import('@/features/reservations/ReservationCenterPage'))
const FinanceDashboardPage = lazy(() => import('@/features/finance/FinanceDashboardPage'))
const ReportsAnalyticsPage = lazy(() => import('@/features/analytics/ReportsAnalyticsPage'))
const PlatformSettingsPage = lazy(() => import('@/features/settings/PlatformSettingsPage'))
const NotificationsSettingsPage = lazy(() => import('@/features/settings/NotificationsSettingsPage'))
const IntegrationsPage = lazy(() => import('@/features/settings/IntegrationsPage'))
const ReservationConfigurationPage = lazy(() => import('@/features/settings/ReservationConfigurationPage'))
const AdminRolesPage = lazy(() => import('@/features/settings/AdminRolesPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LazyPageFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/auth/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path: '/auth/verify-otp', element: withSuspense(<OtpVerificationPage />) },
      { path: '/auth/reset-password', element: withSuspense(<ResetPasswordPage />) },
      { path: '/auth/password-updated', element: withSuspense(<PasswordUpdatedPage />) },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: 'operations/live-trips', element: withSuspense(<LiveTripsPage />) },
      { path: 'operations/active-drivers', element: <Navigate to="/drivers?tab=active" replace /> },
      { path: 'operations/active-passengers', element: <Navigate to="/passengers?tab=active" replace /> },
      { path: 'operations/ride-monitoring', element: withSuspense(<RideMonitoringPage />) },
      { path: 'operations/cancellation-management', element: withSuspense(<CancellationManagementPage />) },
      { path: 'operations/lost-found', element: withSuspense(<LostFoundManagementPage />) },
      { path: 'operations/trip-completion-review', element: withSuspense(<TripCompletionReviewPage />) },
      { path: 'operations/driving-hours', element: withSuspense(<DrivingHoursManagementPage />) },
      { path: 'operations/destination-filters', element: withSuspense(<DestinationFilterManagementPage />) },
      { path: 'operations/policy-center', element: withSuspense(<OperationsPolicyCenterPage />) },
      { path: 'operations/safety-incidents', element: withSuspense(<SafetyIncidentPage />) },
      { path: 'communication/conversations', element: withSuspense(<ConversationsPage />) },
      { path: 'communication/active-trip-chats', element: withSuspense(<ActiveTripChatsPage />) },
      { path: 'communication/driver-support', element: withSuspense(<DriverSupportPage />) },
      { path: 'communication/passenger-support', element: withSuspense(<PassengerSupportPage />) },
      { path: 'communication/safety', element: withSuspense(<SafetyCommunicationsPage />) },
      { path: 'communication/broadcast', element: withSuspense(<BroadcastCenterPage />) },
      { path: 'communication/templates', element: withSuspense(<MessageTemplatesPage />) },
      { path: 'communication/internal-notes', element: <Navigate to="/communication/conversations" replace /> },
      { path: 'communication/analytics', element: withSuspense(<CommunicationAnalyticsPage />) },
      { path: 'drivers', element: withSuspense(<DriversPage />) },
      { path: 'drivers/rewards', element: withSuspense(<DriverRewardsPage />) },
      { path: 'drivers/tiers', element: withSuspense(<TierManagementPage />) },
      { path: 'drivers/rewards/tier-management', element: <Navigate to="/drivers/tiers" replace /> },
      { path: 'drivers/waitlist', element: withSuspense(<DriverWaitlistPage />) },
      { path: 'drivers/:id', element: withSuspense(<DriverProfilePage />) },
      { path: 'passengers', element: withSuspense(<PassengersPage />) },
      { path: 'passengers/:id', element: withSuspense(<PassengerProfilePage />) },
      { path: 'compliance', element: withSuspense(<ComplianceCenterPage />) },
      { path: 'compliance/background-checks', element: withSuspense(<BackgroundChecksPage />) },
      { path: 'compliance/background-check-fees', element: withSuspense(<BackgroundCheckFeePage />) },
      { path: 'compliance/documents', element: withSuspense(<DocumentMonitoringPage />) },
      { path: 'compliance/restrictions', element: withSuspense(<DriverRestrictionsPage />) },
      { path: 'eligibility/rules', element: withSuspense(<EligibilityRulesPage />) },
      { path: 'eligibility/categories', element: withSuspense(<VehicleCategoriesPage />) },
      { path: 'eligibility/assignments', element: withSuspense(<CategoryAssignmentsPage />) },
      { path: 'eligibility/premium-vehicles', element: withSuspense(<PremiumVehiclesPage />) },
      { path: 'categories/:category', element: withSuspense(<CategoryDetailPage />) },
      { path: 'demand-intelligence', element: withSuspense(<DemandIntelligenceCenterPage />) },
      { path: 'demand/trends', element: <Navigate to="/demand-intelligence" replace /> },
      { path: 'demand/forecasting', element: <Navigate to="/demand-intelligence" replace /> },
      { path: 'demand/heat-maps', element: <Navigate to="/demand-intelligence" replace /> },
      { path: 'demand/earnings-forecasts', element: <Navigate to="/demand-intelligence" replace /> },
      { path: 'demand/event-intelligence', element: <Navigate to="/demand-intelligence" replace /> },
      {
        path: 'pricing',
        children: [
          { index: true, element: withSuspense(<DynamicPricingCenterPage />) },
          { path: 'rules', element: <Navigate to="/pricing?tab=rules" replace /> },
          { path: 'surge-zones', element: <Navigate to="/pricing?tab=zones" replace /> },
          { path: 'surge-history', element: <Navigate to="/pricing?tab=analytics" replace /> },
        ],
      },
      {
        path: 'reservations',
        children: [
          { index: true, element: withSuspense(<ReservationCenterPage />) },
          { path: 'scheduled', element: <Navigate to="/reservations?type=scheduled" replace /> },
          { path: 'airport', element: <Navigate to="/reservations?type=airport" replace /> },
          { path: 'events', element: <Navigate to="/reservations?type=event" replace /> },
        ],
      },
      {
        path: 'locations',
        children: [
          { index: true, element: withSuspense(<LocationDashboardPage />) },
          { path: 'states', element: <Navigate to="/locations?tab=states" replace /> },
          { path: 'cities', element: <Navigate to="/locations?tab=cities" replace /> },
          { path: 'zones', element: <Navigate to="/locations?tab=zones" replace /> },
          { path: 'airports', element: <Navigate to="/locations?tab=airports" replace /> },
          { path: 'state-activation', element: <Navigate to="/locations?tab=states" replace /> },
          { path: 'airport-queue', element: <Navigate to="/locations?tab=airports" replace /> },
        ],
      },
      {
        path: 'finance',
        children: [
          { index: true, element: withSuspense(<FinanceDashboardPage />) },
          { path: 'revenue', element: <Navigate to="/finance?tab=revenue" replace /> },
          { path: 'payouts', element: <Navigate to="/finance?tab=payouts" replace /> },
          { path: 'wallets', element: <Navigate to="/finance?tab=wallets" replace /> },
          { path: 'transactions', element: <Navigate to="/finance?tab=transactions" replace /> },
        ],
      },
      {
        path: 'analytics',
        children: [
          { index: true, element: withSuspense(<ReportsAnalyticsPage />) },
          { path: 'drivers', element: <Navigate to="/analytics?tab=drivers" replace /> },
          { path: 'passengers', element: <Navigate to="/analytics?tab=passengers" replace /> },
          { path: 'revenue', element: <Navigate to="/analytics?tab=revenue" replace /> },
          { path: 'demand', element: <Navigate to="/analytics?tab=demand" replace /> },
          { path: 'compliance', element: <Navigate to="/analytics?tab=compliance" replace /> },
        ],
      },
      { path: 'settings/platform', element: withSuspense(<PlatformSettingsPage />) },
      { path: 'settings/notifications', element: withSuspense(<NotificationsSettingsPage />) },
      { path: 'settings/integrations', element: withSuspense(<IntegrationsPage />) },
      { path: 'settings/reservations', element: withSuspense(<ReservationConfigurationPage />) },
      { path: 'settings/admin-roles', element: withSuspense(<AdminRolesPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
