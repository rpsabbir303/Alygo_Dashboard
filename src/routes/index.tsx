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
const DriverWaitlistPage = lazy(() => import('@/features/drivers/DriverWaitlistPage'))
const PassengersPage = lazy(() => import('@/features/passengers/PassengersPage'))
const PassengerProfilePage = lazy(() => import('@/features/passengers/PassengerProfilePage'))
const LiveTripsPage = lazy(() => import('@/features/operations/LiveTripsPage'))
const ActiveDriversPage = lazy(() => import('@/features/operations/ActiveDriversPage'))
const ActivePassengersPage = lazy(() => import('@/features/operations/ActivePassengersPage'))
const RideMonitoringPage = lazy(() => import('@/features/operations/RideMonitoringPage'))
const CancellationManagementPage = lazy(() => import('@/features/cancellations/CancellationManagementPage'))
const DriverRewardsPage = lazy(() => import('@/features/driver-rewards/DriverRewardsPage'))
const LostFoundManagementPage = lazy(() => import('@/features/lost-found/LostFoundManagementPage'))
const ComplianceCenterPage = lazy(() => import('@/features/compliance/ComplianceCenterPage'))
const BackgroundChecksPage = lazy(() => import('@/features/compliance/BackgroundChecksPage'))
const DocumentMonitoringPage = lazy(() => import('@/features/compliance/DocumentMonitoringPage'))
const DriverRestrictionsPage = lazy(() => import('@/features/compliance/DriverRestrictionsPage'))
const EligibilityRulesPage = lazy(() => import('@/features/eligibility/EligibilityRulesPage'))
const VehicleCategoriesPage = lazy(() => import('@/features/eligibility/VehicleCategoriesPage'))
const CategoryAssignmentsPage = lazy(() => import('@/features/eligibility/CategoryAssignmentsPage'))
const PremiumVehiclesPage = lazy(() => import('@/features/eligibility/PremiumVehiclesPage'))
const CategoryDetailPage = lazy(() => import('@/features/categories/CategoryDetailPage'))
const DemandTrendsPage = lazy(() => import('@/features/demand/DemandTrendsPage'))
const DemandForecastingPage = lazy(() => import('@/features/demand/DemandForecastingPage'))
const HeatMapsPage = lazy(() => import('@/features/demand/HeatMapsPage'))
const EarningsForecastsPage = lazy(() => import('@/features/demand/EarningsForecastsPage'))
const EventIntelligencePage = lazy(() => import('@/features/demand/EventIntelligencePage'))
const SurgeZonesPage = lazy(() => import('@/features/pricing/SurgeZonesPage'))
const PricingRulesPage = lazy(() => import('@/features/pricing/PricingRulesPage'))
const SurgeHistoryPage = lazy(() => import('@/features/pricing/SurgeHistoryPage'))
const ScheduledRidesPage = lazy(() => import('@/features/reservations/ScheduledRidesPage'))
const AirportReservationsPage = lazy(() => import('@/features/reservations/AirportReservationsPage'))
const EventReservationsPage = lazy(() => import('@/features/reservations/EventReservationsPage'))
const StatesPage = lazy(() => import('@/features/locations/StatesPage'))
const CitiesPage = lazy(() => import('@/features/locations/CitiesPage'))
const AirportsPage = lazy(() => import('@/features/locations/AirportsPage'))
const ZonesPage = lazy(() => import('@/features/locations/ZonesPage'))
const RevenuePage = lazy(() => import('@/features/finance/RevenuePage'))
const PayoutsPage = lazy(() => import('@/features/finance/PayoutsPage'))
const WalletsPage = lazy(() => import('@/features/finance/WalletsPage'))
const TransactionsPage = lazy(() => import('@/features/finance/TransactionsPage'))
const DriverAnalyticsPage = lazy(() => import('@/features/analytics/DriverAnalyticsPage'))
const PassengerAnalyticsPage = lazy(() => import('@/features/analytics/PassengerAnalyticsPage'))
const RevenueAnalyticsPage = lazy(() => import('@/features/analytics/RevenueAnalyticsPage'))
const DemandAnalyticsPage = lazy(() => import('@/features/analytics/DemandAnalyticsPage'))
const ComplianceAnalyticsPage = lazy(() => import('@/features/analytics/ComplianceAnalyticsPage'))
const PlatformSettingsPage = lazy(() => import('@/features/settings/PlatformSettingsPage'))
const NotificationsSettingsPage = lazy(() => import('@/features/settings/NotificationsSettingsPage'))
const IntegrationsPage = lazy(() => import('@/features/settings/IntegrationsPage'))
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
      { path: 'operations/active-drivers', element: withSuspense(<ActiveDriversPage />) },
      { path: 'operations/active-passengers', element: withSuspense(<ActivePassengersPage />) },
      { path: 'operations/ride-monitoring', element: withSuspense(<RideMonitoringPage />) },
      { path: 'operations/cancellation-management', element: withSuspense(<CancellationManagementPage />) },
      { path: 'operations/lost-found', element: withSuspense(<LostFoundManagementPage />) },
      { path: 'drivers', element: withSuspense(<DriversPage />) },
      { path: 'drivers/rewards', element: withSuspense(<DriverRewardsPage />) },
      { path: 'drivers/:id', element: withSuspense(<DriverProfilePage />) },
      { path: 'drivers/waitlist', element: withSuspense(<DriverWaitlistPage />) },
      { path: 'passengers', element: withSuspense(<PassengersPage />) },
      { path: 'passengers/:id', element: withSuspense(<PassengerProfilePage />) },
      { path: 'compliance', element: withSuspense(<ComplianceCenterPage />) },
      { path: 'compliance/background-checks', element: withSuspense(<BackgroundChecksPage />) },
      { path: 'compliance/documents', element: withSuspense(<DocumentMonitoringPage />) },
      { path: 'compliance/restrictions', element: withSuspense(<DriverRestrictionsPage />) },
      { path: 'eligibility/rules', element: withSuspense(<EligibilityRulesPage />) },
      { path: 'eligibility/categories', element: withSuspense(<VehicleCategoriesPage />) },
      { path: 'eligibility/assignments', element: withSuspense(<CategoryAssignmentsPage />) },
      { path: 'eligibility/premium-vehicles', element: withSuspense(<PremiumVehiclesPage />) },
      { path: 'categories/:category', element: withSuspense(<CategoryDetailPage />) },
      { path: 'demand/trends', element: withSuspense(<DemandTrendsPage />) },
      { path: 'demand/forecasting', element: withSuspense(<DemandForecastingPage />) },
      { path: 'demand/heat-maps', element: withSuspense(<HeatMapsPage />) },
      { path: 'demand/earnings-forecasts', element: withSuspense(<EarningsForecastsPage />) },
      { path: 'demand/event-intelligence', element: withSuspense(<EventIntelligencePage />) },
      { path: 'pricing/surge-zones', element: withSuspense(<SurgeZonesPage />) },
      { path: 'pricing/rules', element: withSuspense(<PricingRulesPage />) },
      { path: 'pricing/surge-history', element: withSuspense(<SurgeHistoryPage />) },
      { path: 'reservations/scheduled', element: withSuspense(<ScheduledRidesPage />) },
      { path: 'reservations/airport', element: withSuspense(<AirportReservationsPage />) },
      { path: 'reservations/events', element: withSuspense(<EventReservationsPage />) },
      { path: 'locations/states', element: withSuspense(<StatesPage />) },
      { path: 'locations/cities', element: withSuspense(<CitiesPage />) },
      { path: 'locations/airports', element: withSuspense(<AirportsPage />) },
      { path: 'locations/zones', element: withSuspense(<ZonesPage />) },
      { path: 'finance/revenue', element: withSuspense(<RevenuePage />) },
      { path: 'finance/payouts', element: withSuspense(<PayoutsPage />) },
      { path: 'finance/wallets', element: withSuspense(<WalletsPage />) },
      { path: 'finance/transactions', element: withSuspense(<TransactionsPage />) },
      { path: 'analytics/drivers', element: withSuspense(<DriverAnalyticsPage />) },
      { path: 'analytics/passengers', element: withSuspense(<PassengerAnalyticsPage />) },
      { path: 'analytics/revenue', element: withSuspense(<RevenueAnalyticsPage />) },
      { path: 'analytics/demand', element: withSuspense(<DemandAnalyticsPage />) },
      { path: 'analytics/compliance', element: withSuspense(<ComplianceAnalyticsPage />) },
      { path: 'settings/platform', element: withSuspense(<PlatformSettingsPage />) },
      { path: 'settings/notifications', element: withSuspense(<NotificationsSettingsPage />) },
      { path: 'settings/integrations', element: withSuspense(<IntegrationsPage />) },
      { path: 'settings/admin-roles', element: withSuspense(<AdminRolesPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
