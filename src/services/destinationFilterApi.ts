import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  DestinationFilterAnalytics,
  DestinationFilterOverview,
  TierFilterSettings,
} from '@/types/destinationFilter'
import {
  computeDestinationFilterOverview,
  mockDestinationFilterAnalytics,
  mockTierFilterSettings,
} from '@/services/mock/destinationFilterData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const destinationFilterApi = createApi({
  reducerPath: 'destinationFilterApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['TierFilterSettings', 'DestinationFilterOverview', 'DestinationFilterAnalytics'],
  endpoints: (builder) => ({
    getDestinationFilterOverview: builder.query<DestinationFilterOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeDestinationFilterOverview() }
      },
      providesTags: ['DestinationFilterOverview'],
    }),
    getTierFilterSettings: builder.query<TierFilterSettings[], void>({
      queryFn: async () => ({ data: [...mockTierFilterSettings] }),
      providesTags: ['TierFilterSettings'],
    }),
    updateTierFilterSettings: builder.mutation<TierFilterSettings, Partial<TierFilterSettings> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockTierFilterSettings.findIndex((s) => s.id === id)
        if (index === -1) return { error: { status: 404, data: 'Settings not found' } }
        mockTierFilterSettings[index] = { ...mockTierFilterSettings[index], ...updates }
        return { data: mockTierFilterSettings[index] }
      },
      invalidatesTags: ['TierFilterSettings', 'DestinationFilterOverview'],
    }),
    getDestinationFilterAnalytics: builder.query<DestinationFilterAnalytics, void>({
      queryFn: async () => ({ data: mockDestinationFilterAnalytics }),
      providesTags: ['DestinationFilterAnalytics'],
    }),
  }),
})

export const {
  useGetDestinationFilterOverviewQuery,
  useGetTierFilterSettingsQuery,
  useUpdateTierFilterSettingsMutation,
  useGetDestinationFilterAnalyticsQuery,
} = destinationFilterApi
