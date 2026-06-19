import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  IncidentCategory,
  IncidentCategoryFormValues,
  SafetyDashboardSummary,
  SafetyIncident,
  SafetyOverview,
  SafetySettings,
} from '@/types/safetyIncident'
import {
  computeSafetyDashboardSummary,
  computeSafetyOverview,
  mockIncidentCategories,
  mockSafetyIncidents,
  mockSafetySettings,
} from '@/services/mock/safetyIncidentData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const safetyIncidentApi = createApi({
  reducerPath: 'safetyIncidentApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['SafetyOverview', 'Incidents', 'IncidentCategories', 'SafetySettings'],
  endpoints: (builder) => ({
    getSafetyOverview: builder.query<SafetyOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeSafetyOverview() }
      },
      providesTags: ['SafetyOverview'],
    }),
    getSafetyDashboardSummary: builder.query<SafetyDashboardSummary, void>({
      queryFn: async () => {
        await delay()
        return { data: computeSafetyDashboardSummary() }
      },
      providesTags: ['SafetyOverview', 'Incidents'],
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
            {
              id: `n-${Date.now()}`,
              author: 'Admin',
              content: `Assigned to ${assignedTo}`,
              timestamp: new Date().toISOString(),
            },
          ],
        }
        return { data: mockSafetyIncidents[index] }
      },
      invalidatesTags: ['Incidents', 'SafetyOverview'],
    }),
    addIncidentNote: builder.mutation<SafetyIncident, { id: string; content: string }>({
      queryFn: async ({ id, content }) => {
        await delay()
        const index = mockSafetyIncidents.findIndex((i) => i.id === id)
        if (index === -1) return { error: { status: 404, data: 'Incident not found' } }
        mockSafetyIncidents[index] = {
          ...mockSafetyIncidents[index],
          notes: [
            ...mockSafetyIncidents[index].notes,
            { id: `n-${Date.now()}`, author: 'Admin', content, timestamp: new Date().toISOString() },
          ],
        }
        return { data: mockSafetyIncidents[index] }
      },
      invalidatesTags: ['Incidents'],
    }),
    resolveIncident: builder.mutation<SafetyIncident, { id: string; note?: string }>({
      queryFn: async ({ id, note }) => {
        await delay()
        const index = mockSafetyIncidents.findIndex((i) => i.id === id)
        if (index === -1) return { error: { status: 404, data: 'Incident not found' } }
        mockSafetyIncidents[index] = {
          ...mockSafetyIncidents[index],
          status: 'resolved',
          resolutionNotes: note ?? 'Case resolved',
          notes: [
            ...mockSafetyIncidents[index].notes,
            {
              id: `n-${Date.now()}`,
              author: 'Admin',
              content: note ?? 'Case resolved',
              timestamp: new Date().toISOString(),
            },
          ],
        }
        return { data: mockSafetyIncidents[index] }
      },
      invalidatesTags: ['Incidents', 'SafetyOverview'],
    }),
    closeIncident: builder.mutation<SafetyIncident, { id: string; note?: string }>({
      queryFn: async ({ id, note }) => {
        await delay()
        const index = mockSafetyIncidents.findIndex((i) => i.id === id)
        if (index === -1) return { error: { status: 404, data: 'Incident not found' } }
        mockSafetyIncidents[index] = {
          ...mockSafetyIncidents[index],
          status: 'closed',
          notes: [
            ...mockSafetyIncidents[index].notes,
            {
              id: `n-${Date.now()}`,
              author: 'Admin',
              content: note ?? 'Case closed',
              timestamp: new Date().toISOString(),
            },
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
    createIncidentCategory: builder.mutation<IncidentCategory, IncidentCategoryFormValues>({
      queryFn: async (values) => {
        await delay()
        const category: IncidentCategory = { id: `cat-${Date.now()}`, ...values }
        mockIncidentCategories.push(category)
        return { data: category }
      },
      invalidatesTags: ['IncidentCategories'],
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
    deleteIncidentCategory: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockIncidentCategories.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Category not found' } }
        mockIncidentCategories.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['IncidentCategories'],
    }),
    getSafetySettings: builder.query<SafetySettings, void>({
      queryFn: async () => ({ data: { ...mockSafetySettings } }),
      providesTags: ['SafetySettings'],
    }),
    updateSafetySettings: builder.mutation<SafetySettings, Partial<SafetySettings>>({
      queryFn: async (updates) => {
        await delay()
        Object.assign(mockSafetySettings, updates)
        return { data: { ...mockSafetySettings } }
      },
      invalidatesTags: ['SafetySettings'],
    }),
  }),
})

export const {
  useGetSafetyOverviewQuery,
  useGetSafetyDashboardSummaryQuery,
  useGetIncidentsQuery,
  useGetIncidentByIdQuery,
  useAssignIncidentMutation,
  useAddIncidentNoteMutation,
  useResolveIncidentMutation,
  useCloseIncidentMutation,
  useGetIncidentCategoriesQuery,
  useCreateIncidentCategoryMutation,
  useUpdateIncidentCategoryMutation,
  useDeleteIncidentCategoryMutation,
  useGetSafetySettingsQuery,
  useUpdateSafetySettingsMutation,
} = safetyIncidentApi

export {
  TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  SEVERITY_LABELS,
  ASSIGN_OPTIONS,
} from '@/services/mock/safetyIncidentData'
