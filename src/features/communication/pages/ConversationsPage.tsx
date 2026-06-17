import { Tabs } from 'antd'
import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { CaseManagementTable } from '@/features/communication/components/CaseManagementTable'
import { CommunicationHistoryTable } from '@/features/communication/components/CommunicationHistoryTable'
import { ConversationInbox } from '@/features/communication/components/ConversationInbox'

export default function ConversationsPage() {
  return (
    <CommunicationLayout
      title="Conversations"
      description="Inbox-style conversation management for all driver, passenger, trip, safety, and escalation communications."
    >
      <Tabs
        defaultActiveKey="inbox"
        items={[
          { key: 'inbox', label: 'Inbox', children: <ConversationInbox /> },
          { key: 'cases', label: 'Case Management', children: <CaseManagementTable /> },
          { key: 'history', label: 'Communication History', children: <CommunicationHistoryTable /> },
        ]}
      />
    </CommunicationLayout>
  )
}
