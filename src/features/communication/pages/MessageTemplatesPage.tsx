import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { MessageTemplatesTable } from '@/features/communication/components/MessageTemplatesTable'

export default function MessageTemplatesPage() {
  return (
    <CommunicationLayout
      title="Message Templates"
      description="Create and manage quick response templates for support agents across trip updates, safety, payments, and compliance."
    >
      <MessageTemplatesTable />
    </CommunicationLayout>
  )
}
