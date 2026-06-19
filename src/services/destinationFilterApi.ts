import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  DestinationFilterAnalytics,
  DestinationFilterOverview,
  TierFilterSettings,
} from '@/types/destinationFilter'
import {
  applyTierFilterSettingsToLevel,
  deriveTierFilterSettingsFromLevels,
} from '@/features/driver-rewards/utils/tierConfigHelpers'
import {
  computeDestinationFilterOverview,
  mockDestinationFilterAnalytics,
} from '@/services/mock/destinationFilterData'
import { mockDriverLevels } from '@/services/mock/driverRewardsData'

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
      queryFn: async () => ({
        data: deriveTierFilterSettingsFromLevels(mockDriverLevels),
      }),
      providesTags: ['TierFilterSettings'],
    }),
    updateTierFilterSettings: builder.mutation<TierFilterSettings, Partial<TierFilterSettings> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const levelIndex = mockDriverLevels.findIndex((l) => `df-${l.id}` === id)
        if (levelIndex === -1) return { error: { status: 404, data: 'Tier not found' } }
        mockDriverLevels[levelIndex] = applyTierFilterSettingsToLevel(mockDriverLevels[levelIndex], updates)
        return { data: deriveTierFilterSettingsFromLevels(mockDriverLevels).find((s) => s.id === id)! }
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
