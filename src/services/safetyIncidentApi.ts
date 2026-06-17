import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  EscalationRule,
  IncidentCategory,
  ResponseSlaSettings,
  SafetyIncident,
  SafetyOverview,
  SafetyTeamMember,
} from '@/types/safetyIncident'
import {
  computeSafetyOverview,
  mockEscalationRules,
  mockIncidentCategories,
  mockResponseSla,
  mockSafetyIncidents,
  mockSafetyTeam,
} from '@/services/mock/safetyIncidentData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const safetyIncidentApi = createApi({
  reducerPath: 'safetyIncidentApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['SafetyOverview', 'Incidents', 'IncidentCategories', 'EscalationRules', 'ResponseSla', 'SafetyTeam'],
  endpoints: (builder) => ({
    getSafetyOverview: builder.query<SafetyOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeSafetyOverview() }
      },
      providesTags: ['SafetyOverview'],
    }),
    getIncidents: builder.query<SafetyIncident[], void>({
      queryFn: async () => ({ data: [...mockSafetyIncidents] }),
      providesTags: ['Incidents'],
    }),
    getIncidentById: builder.query<SafetyIncident | undefined, string>({
      queryFn: async (id) => {
        await delay()
        return { data: mockSafetyIncidents.find((i) => i.id === id) }
      },
      providesTags: ['Incidents'],
    }),
    assignIncident: builder.mutation<SafetyIncident, { id: string; assignedTo: string }>({
      queryFn: async ({ id, assignedTo }) => {
        await delay()
        const index = mockSafetyIncidents.findIndex((i) => i.id === id)
        if (index === -1) return { error: { status: 404, data: 'Incident not found' } }
        mockSafetyIncidents[index] = {
          ...mockSafetyIncidents[index],
          status: 'assigned',
          assignedTo,
          notes: [
            ...mockSafetyIncidents[index].notes,
            { id: `n-${Date.now()}`, author: 'Admin', content: `Assigned to ${assignedTo}`, timestamp: new Date().toISOString() },
          ],
        }
        return { data: mockSafetyIncidents[index] }
      },
      invalidatesTags: ['Incidents', 'SafetyOverview'],
    }),
    resolveIncident: builder.mutation<SafetyIncident, { id: string; note?: string }>({
      queryFn: async ({ id, note }) => {
        await delay()
        const index = mockSafetyIncidents.findIndex((i) => i.id === id)
        if (index === -1) return { error: { status: 404, data: 'Incident not found' } }
        mockSafetyIncidents[index] = {
          ...mockSafetyIncidents[index],
          status: 'resolved',
          notes: [
            ...mockSafetyIncidents[index].notes,
            { id: `n-${Date.now()}`, author: 'Admin', content: note ?? 'Case resolved', timestamp: new Date().toISOString() },
          ],
        }
        return { data: mockSafetyIncidents[index] }
      },
      invalidatesTags: ['Incidents', 'SafetyOverview'],
    }),
    escalateIncident: builder.mutation<SafetyIncident, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockSafetyIncidents.findIndex((i) => i.id === id)
        if (index === -1) return { error: { status: 404, data: 'Incident not found' } }
        mockSafetyIncidents[index] = {
          ...mockSafetyIncidents[index],
          status: 'escalated',
          priority: mockSafetyIncidents[index].priority === 'low' ? 'medium' : mockSafetyIncidents[index].priority === 'medium' ? 'high' : 'critical',
          notes: [
            ...mockSafetyIncidents[index].notes,
            { id: `n-${Date.now()}`, author: 'Admin', content: 'Case escalated to senior safety team', timestamp: new Date().toISOString() },
          ],
        }
        return { data: mockSafetyIncidents[index] }
      },
      invalidatesTags: ['Incidents', 'SafetyOverview'],
    }),
    getIncidentCategories: builder.query<IncidentCategory[], void>({
      queryFn: async () => ({ data: [...mockIncidentCategories] }),
      providesTags: ['IncidentCategories'],
    }),
    updateIncidentCategory: builder.mutation<IncidentCategory, Partial<IncidentCategory> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockIncidentCategories.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Category not found' } }
        mockIncidentCategories[index] = { ...mockIncidentCategories[index], ...updates }
        return { data: mockIncidentCategories[index] }
      },
      invalidatesTags: ['IncidentCategories'],
    }),
    getEscalationRules: builder.query<EscalationRule[], void>({
      queryFn: async () => ({ data: [...mockEscalationRules] }),
      providesTags: ['EscalationRules'],
    }),
    updateEscalationRule: builder.mutation<EscalationRule, Partial<EscalationRule> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockEscalationRules.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Rule not found' } }
        mockEscalationRules[index] = { ...mockEscalationRules[index], ...updates }
        return { data: mockEscalationRules[index] }
      },
      invalidatesTags: ['EscalationRules'],
    }),
    getResponseSla: builder.query<ResponseSlaSettings, void>({
      queryFn: async () => ({ data: { ...mockResponseSla } }),
      providesTags: ['ResponseSla'],
    }),
    updateResponseSla: builder.mutation<ResponseSlaSettings, Partial<ResponseSlaSettings>>({
      queryFn: async (updates) => {
        await delay()
        Object.assign(mockResponseSla, updates)
        return { data: { ...mockResponseSla } }
      },
      invalidatesTags: ['ResponseSla'],
    }),
    getSafetyTeam: builder.query<SafetyTeamMember[], void>({
      queryFn: async () => ({ data: [...mockSafetyTeam] }),
      providesTags: ['SafetyTeam'],
    }),
    updateSafetyTeamMember: builder.mutation<SafetyTeamMember, Partial<SafetyTeamMember> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockSafetyTeam.findIndex((m) => m.id === id)
        if (index === -1) return { error: { status: 404, data: 'Team member not found' } }
        mockSafetyTeam[index] = { ...mockSafetyTeam[index], ...updates }
        return { data: mockSafetyTeam[index] }
      },
      invalidatesTags: ['SafetyTeam'],
    }),
  }),
})

export const {
  useGetSafetyOverviewQuery,
  useGetIncidentsQuery,
  useGetIncidentByIdQuery,
  useAssignIncidentMutation,
  useResolveIncidentMutation,
  useEscalateIncidentMutation,
  useGetIncidentCategoriesQuery,
  useUpdateIncidentCategoryMutation,
  useGetEscalationRulesQuery,
  useUpdateEscalationRuleMutation,
  useGetResponseSlaQuery,
  useUpdateResponseSlaMutation,
  useGetSafetyTeamQuery,
  useUpdateSafetyTeamMemberMutation,
} = safetyIncidentApi

export { TYPE_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '@/services/mock/safetyIncidentData'
