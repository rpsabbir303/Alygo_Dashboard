import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
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
import type { ActiveTripChat } from '@/types/communication'
import {
  computeCommunicationAnalytics,
  computeCommunicationOverview,
  getActiveTripChats,
  mockBroadcasts,
  mockChatMessages,
  mockCommunicationHistory,
  mockConversations,
  mockInternalNotes,
  mockMessageTemplates,
  mockSafetyCommunications,
  mockSupportCases,
} from '@/services/mock/communicationData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const communicationApi = createApi({
  reducerPath: 'communicationApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'CommunicationOverview',
    'Conversations',
    'Messages',
    'Templates',
    'InternalNotes',
    'SupportCases',
    'SafetyCommunications',
    'Broadcasts',
    'CommunicationHistory',
    'CommunicationAnalytics',
    'ActiveTripChats',
  ],
  endpoints: (builder) => ({
    getCommunicationOverview: builder.query<CommunicationOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeCommunicationOverview() }
      },
      providesTags: ['CommunicationOverview'],
    }),
    getConversations: builder.query<Conversation[], { category?: string; userType?: string } | void>({
      queryFn: async (filters) => {
        await delay()
        let data = [...mockConversations]
        if (filters?.category) {
          data = data.filter((c) => c.category === filters.category)
        }
        if (filters?.userType) {
          data = data.filter((c) => c.userType === filters.userType)
        }
        return { data }
      },
      providesTags: ['Conversations'],
    }),
    getConversationById: builder.query<Conversation | undefined, string>({
      queryFn: async (id) => ({ data: mockConversations.find((c) => c.id === id) }),
      providesTags: ['Conversations'],
    }),
    getMessages: builder.query<ChatMessage[], string>({
      queryFn: async (conversationId) => ({
        data: mockChatMessages[conversationId] ?? [],
      }),
      providesTags: (_r, _e, id) => [{ type: 'Messages', id }],
    }),
    sendMessage: builder.mutation<
      ChatMessage,
      { conversationId: string; content: string; type?: ChatMessage['type'] }
    >({
      queryFn: async ({ conversationId, content, type = 'text' }) => {
        await delay(150)
        const msg: ChatMessage = {
          id: `m-${Date.now()}`,
          conversationId,
          senderId: 'admin-1',
          senderName: 'Admin',
          senderRole: 'admin',
          type,
          content,
          timestamp: new Date().toISOString(),
          deliveryStatus: 'sent',
          isRead: false,
        }
        if (!mockChatMessages[conversationId]) mockChatMessages[conversationId] = []
        mockChatMessages[conversationId].push(msg)
        const conv = mockConversations.find((c) => c.id === conversationId)
        if (conv) {
          conv.lastMessage = content
          conv.lastActivity = msg.timestamp
          conv.status = conv.status === 'open' ? 'in_progress' : conv.status
        }
        return { data: msg }
      },
      invalidatesTags: (_r, _e, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        'Conversations',
        'CommunicationOverview',
        'CommunicationHistory',
      ],
    }),
    updateConversationStatus: builder.mutation<
      Conversation,
      { id: string; status: Conversation['status'] }
    >({
      queryFn: async ({ id, status }) => {
        await delay()
        const index = mockConversations.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Conversation not found' } }
        mockConversations[index] = { ...mockConversations[index], status, lastActivity: new Date().toISOString() }
        return { data: mockConversations[index] }
      },
      invalidatesTags: ['Conversations', 'CommunicationOverview', 'CommunicationHistory'],
    }),
    assignConversation: builder.mutation<Conversation, { id: string; agent: string }>({
      queryFn: async ({ id, agent }) => {
        await delay()
        const index = mockConversations.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Conversation not found' } }
        mockConversations[index] = {
          ...mockConversations[index],
          assignedAgent: agent,
          status: 'in_progress',
          lastActivity: new Date().toISOString(),
        }
        return { data: mockConversations[index] }
      },
      invalidatesTags: ['Conversations'],
    }),
    updateConversation: builder.mutation<Conversation, Partial<Conversation> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockConversations.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Conversation not found' } }
        mockConversations[index] = {
          ...mockConversations[index],
          ...updates,
          lastActivity: new Date().toISOString(),
        }
        return { data: mockConversations[index] }
      },
      invalidatesTags: ['Conversations', 'CommunicationOverview'],
    }),
    getMessageTemplates: builder.query<MessageTemplate[], void>({
      queryFn: async () => ({ data: [...mockMessageTemplates] }),
      providesTags: ['Templates'],
    }),
    createMessageTemplate: builder.mutation<MessageTemplate, Omit<MessageTemplate, 'id' | 'usageCount' | 'updatedAt'>>({
      queryFn: async (payload) => {
        await delay()
        const template: MessageTemplate = {
          ...payload,
          id: `tpl-${Date.now()}`,
          usageCount: 0,
          updatedAt: new Date().toISOString(),
        }
        mockMessageTemplates.push(template)
        return { data: template }
      },
      invalidatesTags: ['Templates'],
    }),
    updateMessageTemplate: builder.mutation<MessageTemplate, Partial<MessageTemplate> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockMessageTemplates.findIndex((t) => t.id === id)
        if (index === -1) return { error: { status: 404, data: 'Template not found' } }
        mockMessageTemplates[index] = { ...mockMessageTemplates[index], ...updates, updatedAt: new Date().toISOString() }
        return { data: mockMessageTemplates[index] }
      },
      invalidatesTags: ['Templates'],
    }),
    deleteMessageTemplate: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockMessageTemplates.findIndex((t) => t.id === id)
        if (index === -1) return { error: { status: 404, data: 'Template not found' } }
        mockMessageTemplates.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['Templates'],
    }),
    getInternalNotes: builder.query<InternalNote[], void>({
      queryFn: async () => ({ data: [...mockInternalNotes] }),
      providesTags: ['InternalNotes'],
    }),
    createInternalNote: builder.mutation<InternalNote, Omit<InternalNote, 'id' | 'createdAt' | 'author'>>({
      queryFn: async (payload) => {
        await delay()
        const note: InternalNote = {
          ...payload,
          id: `note-${Date.now()}`,
          author: 'Admin',
          createdAt: new Date().toISOString(),
        }
        mockInternalNotes.unshift(note)
        return { data: note }
      },
      invalidatesTags: ['InternalNotes', 'CommunicationHistory'],
    }),
    getSupportCases: builder.query<SupportCase[], void>({
      queryFn: async () => ({ data: [...mockSupportCases] }),
      providesTags: ['SupportCases'],
    }),
    updateSupportCase: builder.mutation<SupportCase, Partial<SupportCase> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockSupportCases.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Case not found' } }
        mockSupportCases[index] = {
          ...mockSupportCases[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        return { data: mockSupportCases[index] }
      },
      invalidatesTags: ['SupportCases', 'CommunicationOverview'],
    }),
    getSafetyCommunications: builder.query<SafetyCommunication[], void>({
      queryFn: async () => ({ data: [...mockSafetyCommunications] }),
      providesTags: ['SafetyCommunications'],
    }),
    getBroadcasts: builder.query<BroadcastRecord[], void>({
      queryFn: async () => ({ data: [...mockBroadcasts] }),
      providesTags: ['Broadcasts'],
    }),
    sendBroadcast: builder.mutation<
      BroadcastRecord,
      Omit<BroadcastRecord, 'id' | 'sentAt' | 'sentBy' | 'recipientCount' | 'status'>
    >({
      queryFn: async (payload) => {
        await delay(500)
        const broadcast: BroadcastRecord = {
          ...payload,
          id: `bc-${Date.now()}`,
          recipientCount: Math.floor(Math.random() * 5000) + 1000,
          sentBy: 'Admin',
          sentAt: new Date().toISOString(),
          status: 'sent',
        }
        mockBroadcasts.unshift(broadcast)
        return { data: broadcast }
      },
      invalidatesTags: ['Broadcasts'],
    }),
    getCommunicationHistory: builder.query<CommunicationHistoryEntry[], void>({
      queryFn: async () => ({ data: [...mockCommunicationHistory] }),
      providesTags: ['CommunicationHistory'],
    }),
    getCommunicationAnalytics: builder.query<CommunicationAnalytics, void>({
      queryFn: async () => {
        await delay()
        return { data: computeCommunicationAnalytics() }
      },
      providesTags: ['CommunicationAnalytics'],
    }),
    getActiveTripChats: builder.query<ActiveTripChat[], void>({
      queryFn: async () => {
        await delay()
        return { data: getActiveTripChats() }
      },
      providesTags: ['ActiveTripChats'],
    }),
  }),
})

export const {
  useGetCommunicationOverviewQuery,
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateConversationStatusMutation,
  useAssignConversationMutation,
  useUpdateConversationMutation,
  useGetMessageTemplatesQuery,
  useCreateMessageTemplateMutation,
  useUpdateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useGetInternalNotesQuery,
  useCreateInternalNoteMutation,
  useGetSupportCasesQuery,
  useUpdateSupportCaseMutation,
  useGetSafetyCommunicationsQuery,
  useGetBroadcastsQuery,
  useSendBroadcastMutation,
  useGetCommunicationHistoryQuery,
  useGetCommunicationAnalyticsQuery,
  useGetActiveTripChatsQuery,
} = communicationApi

export {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
  BROADCAST_TARGET_LABELS,
  BROADCAST_TYPE_LABELS,
  CASE_TYPE_LABELS,
  NOTE_TYPE_LABELS,
  SAFETY_TYPE_LABELS,
} from '@/services/mock/communicationData'
