import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CityDrivingRule,
  DriverHoursRecord,
  DrivingHoursAnalytics,
  DrivingHoursGlobalPolicy,
  DrivingHoursOverview,
  StateDrivingRule,
} from '@/types/drivingHours'
import {
  computeDrivingHoursOverview,
  mockCityDrivingRules,
  mockDriverHoursRecords,
  mockDrivingHoursAnalytics,
  mockDrivingHoursPolicy,
  mockStateDrivingRules,
} from '@/services/mock/drivingHoursData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const drivingHoursApi = createApi({
  reducerPath: 'drivingHoursApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'DrivingHoursPolicy',
    'StateRules',
    'CityRules',
    'DriverHours',
    'DrivingHoursOverview',
    'DrivingHoursAnalytics',
  ],
  endpoints: (builder) => ({
    getDrivingHoursOverview: builder.query<DrivingHoursOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeDrivingHoursOverview() }
      },
      providesTags: ['DrivingHoursOverview'],
    }),
    getDrivingHoursPolicy: builder.query<DrivingHoursGlobalPolicy, void>({
      queryFn: async () => ({ data: { ...mockDrivingHoursPolicy } }),
      providesTags: ['DrivingHoursPolicy'],
    }),
    updateDrivingHoursPolicy: builder.mutation<DrivingHoursGlobalPolicy, Partial<DrivingHoursGlobalPolicy>>({
      queryFn: async (updates) => {
        await delay()
        Object.assign(mockDrivingHoursPolicy, updates)
        return { data: { ...mockDrivingHoursPolicy } }
      },
      invalidatesTags: ['DrivingHoursPolicy', 'DrivingHoursOverview'],
    }),
    getStateDrivingRules: builder.query<StateDrivingRule[], void>({
      queryFn: async () => ({ data: [...mockStateDrivingRules] }),
      providesTags: ['StateRules'],
    }),
    updateStateDrivingRule: builder.mutation<StateDrivingRule, Partial<StateDrivingRule> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockStateDrivingRules.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Rule not found' } }
        mockStateDrivingRules[index] = { ...mockStateDrivingRules[index], ...updates }
        return { data: mockStateDrivingRules[index] }
      },
      invalidatesTags: ['StateRules'],
    }),
    getCityDrivingRules: builder.query<CityDrivingRule[], void>({
      queryFn: async () => ({ data: [...mockCityDrivingRules] }),
      providesTags: ['CityRules'],
    }),
    updateCityDrivingRule: builder.mutation<CityDrivingRule, Partial<CityDrivingRule> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockCityDrivingRules.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Rule not found' } }
        mockCityDrivingRules[index] = { ...mockCityDrivingRules[index], ...updates }
        return { data: mockCityDrivingRules[index] }
      },
      invalidatesTags: ['CityRules'],
    }),
    getDriverHoursRecords: builder.query<DriverHoursRecord[], void>({
      queryFn: async () => ({ data: [...mockDriverHoursRecords] }),
      providesTags: ['DriverHours'],
    }),
    getDrivingHoursAnalytics: builder.query<DrivingHoursAnalytics, void>({
      queryFn: async () => ({ data: mockDrivingHoursAnalytics }),
      providesTags: ['DrivingHoursAnalytics'],
    }),
  }),
})

export const {
  useGetDrivingHoursOverviewQuery,
  useGetDrivingHoursPolicyQuery,
  useUpdateDrivingHoursPolicyMutation,
  useGetStateDrivingRulesQuery,
  useUpdateStateDrivingRuleMutation,
  useGetCityDrivingRulesQuery,
  useUpdateCityDrivingRuleMutation,
  useGetDriverHoursRecordsQuery,
  useGetDrivingHoursAnalyticsQuery,
} = drivingHoursApi
