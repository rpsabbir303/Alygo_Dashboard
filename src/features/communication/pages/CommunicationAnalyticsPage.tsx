import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { CommunicationAnalytics } from '@/features/communication/components/CommunicationAnalytics'

export default function CommunicationAnalyticsPage() {
  return (
    <CommunicationLayout
      title="Communication Analytics"
      description="Performance metrics, response times, resolution rates, agent performance, and satisfaction trends."
    >
      <CommunicationAnalytics />
    </CommunicationLayout>
  )
}
