import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CancellationAnalyticsSummary,
  CancellationFee,
  CancellationReason,
  CancellationReasonStat,
  CancellationReasonType,
  CancellationTrendPoint,
  CityCancellationPolicy,
  NoShowPolicy,
  PassengerWarningMessage,
} from '@/types/cancellation'
import type { RideCategory } from '@/types'
import {
  generateReasonId,
  mockCancellationAnalyticsSummary,
  mockCancellationByCategory,
  mockCancellationByCity,
  mockCancellationFees,
  mockCancellationTrend,
  mockCityPolicies,
  mockDriverCancellationReasons,
  mockNoShowPolicies,
  mockPassengerCancellationReasons,
  mockTopCancellationReasons,
  mockWarningMessages,
  touchReasonCreatedAt,
} from '@/services/mock/cancellationData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

function getReasonStore(type: CancellationReasonType) {
  return type === 'passenger' ? mockPassengerCancellationReasons : mockDriverCancellationReasons
}

export const cancellationApi = createApi({
  reducerPath: 'cancellationApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CancellationReasons', 'CancellationFees', 'NoShowPolicies', 'CityPolicies', 'WarningMessages', 'CancellationAnalytics'],
  endpoints: (builder) => ({
    getPassengerCancellationReasons: builder.query<CancellationReason[], void>({
      queryFn: async () => {
        await delay()
        return { data: [...mockPassengerCancellationReasons] }
      },
      providesTags: ['CancellationReasons'],
    }),
    getDriverCancellationReasons: builder.query<CancellationReason[], void>({
      queryFn: async () => {
        await delay()
        return { data: [...mockDriverCancellationReasons] }
      },
      providesTags: ['CancellationReasons'],
    }),
    getCancellationFees: builder.query<CancellationFee[], void>({
      queryFn: async () => ({ data: [...mockCancellationFees] }),
      providesTags: ['CancellationFees'],
    }),
    getNoShowPolicies: builder.query<NoShowPolicy[], void>({
      queryFn: async () => ({ data: [...mockNoShowPolicies] }),
      providesTags: ['NoShowPolicies'],
    }),
    getCityPolicies: builder.query<CityCancellationPolicy[], void>({
      queryFn: async () => ({ data: [...mockCityPolicies] }),
      providesTags: ['CityPolicies'],
    }),
    getWarningMessages: builder.query<PassengerWarningMessage[], void>({
      queryFn: async () => ({ data: [...mockWarningMessages] }),
      providesTags: ['WarningMessages'],
    }),
    getCancellationAnalytics: builder.query<{
      summary: CancellationAnalyticsSummary
      trend: CancellationTrendPoint[]
      topReasons: CancellationReasonStat[]
      byCity: CancellationReasonStat[]
      byCategory: CancellationReasonStat[]
    }, void>({
      queryFn: async () => ({
        data: {
          summary: mockCancellationAnalyticsSummary,
          trend: mockCancellationTrend,
          topReasons: mockTopCancellationReasons,
          byCity: mockCancellationByCity,
          byCategory: mockCancellationByCategory,
        },
      }),
      providesTags: ['CancellationAnalytics'],
    }),
    createCancellationReason: builder.mutation<
      CancellationReason,
      { type: CancellationReasonType; name: string; description: string }
    >({
      queryFn: async ({ type, name, description }) => {
        await delay()
        const store = getReasonStore(type)
        const reason: CancellationReason = {
          id: generateReasonId(type === 'passenger' ? 'pcr' : 'dcr'),
          name,
          description,
          status: 'active',
          createdAt: touchReasonCreatedAt(),
        }
        store.unshift(reason)
        return { data: reason }
      },
      invalidatesTags: ['CancellationReasons'],
    }),
    updateCancellationReason: builder.mutation<
      CancellationReason,
      { type: CancellationReasonType; id: string; name: string; description: string }
    >({
      queryFn: async ({ type, id, name, description }) => {
        await delay()
        const store = getReasonStore(type)
        const index = store.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Reason not found' } }
        store[index] = { ...store[index], name, description }
        return { data: store[index] }
      },
      invalidatesTags: ['CancellationReasons'],
    }),
    toggleCancellationReasonStatus: builder.mutation<
      CancellationReason,
      { type: CancellationReasonType; id: string; status: 'active' | 'inactive' }
    >({
      queryFn: async ({ type, id, status }) => {
        await delay()
        const store = getReasonStore(type)
        const index = store.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Reason not found' } }
        store[index] = { ...store[index], status }
        return { data: store[index] }
      },
      invalidatesTags: ['CancellationReasons'],
    }),
    deleteCancellationReason: builder.mutation<void, { type: CancellationReasonType; id: string }>({
      queryFn: async ({ type, id }) => {
        await delay()
        const store = getReasonStore(type)
        const index = store.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Reason not found' } }
        store.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['CancellationReasons'],
    }),
    updateCancellationFee: builder.mutation<
      CancellationFee,
      Partial<CancellationFee> & { id: string }
    >({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockCancellationFees.findIndex((f) => f.id === id)
        if (index === -1) return { error: { status: 404, data: 'Fee not found' } }
        mockCancellationFees[index] = { ...mockCancellationFees[index], ...updates }
        return { data: mockCancellationFees[index] }
      },
      invalidatesTags: ['CancellationFees'],
    }),
    updateNoShowPolicy: builder.mutation<
      NoShowPolicy,
      Partial<NoShowPolicy> & { id: string }
    >({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockNoShowPolicies.findIndex((p) => p.id === id)
        if (index === -1) return { error: { status: 404, data: 'Policy not found' } }
        mockNoShowPolicies[index] = { ...mockNoShowPolicies[index], ...updates }
        return { data: mockNoShowPolicies[index] }
      },
      invalidatesTags: ['NoShowPolicies'],
    }),
    createCityPolicy: builder.mutation<
      CityCancellationPolicy,
      Omit<CityCancellationPolicy, 'id'>
    >({
      queryFn: async (payload) => {
        await delay()
        const policy: CityCancellationPolicy = { ...payload, id: `cp-${Date.now()}` }
        mockCityPolicies.unshift(policy)
        return { data: policy }
      },
      invalidatesTags: ['CityPolicies'],
    }),
    updateCityPolicy: builder.mutation<
      CityCancellationPolicy,
      Partial<CityCancellationPolicy> & { id: string }
    >({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockCityPolicies.findIndex((p) => p.id === id)
        if (index === -1) return { error: { status: 404, data: 'Policy not found' } }
        mockCityPolicies[index] = { ...mockCityPolicies[index], ...updates }
        return { data: mockCityPolicies[index] }
      },
      invalidatesTags: ['CityPolicies'],
    }),
    deleteCityPolicy: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockCityPolicies.findIndex((p) => p.id === id)
        if (index === -1) return { error: { status: 404, data: 'Policy not found' } }
        mockCityPolicies.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['CityPolicies'],
    }),
    updateWarningMessage: builder.mutation<
      PassengerWarningMessage,
      Partial<PassengerWarningMessage> & { id: string }
    >({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockWarningMessages.findIndex((m) => m.id === id)
        if (index === -1) return { error: { status: 404, data: 'Message not found' } }
        mockWarningMessages[index] = { ...mockWarningMessages[index], ...updates }
        return { data: mockWarningMessages[index] }
      },
      invalidatesTags: ['WarningMessages'],
    }),
  }),
})

export const {
  useGetPassengerCancellationReasonsQuery,
  useGetDriverCancellationReasonsQuery,
  useGetCancellationFeesQuery,
  useGetNoShowPoliciesQuery,
  useGetCityPoliciesQuery,
  useGetWarningMessagesQuery,
  useGetCancellationAnalyticsQuery,
  useCreateCancellationReasonMutation,
  useUpdateCancellationReasonMutation,
  useToggleCancellationReasonStatusMutation,
  useDeleteCancellationReasonMutation,
  useUpdateCancellationFeeMutation,
  useUpdateNoShowPolicyMutation,
  useCreateCityPolicyMutation,
  useUpdateCityPolicyMutation,
  useDeleteCityPolicyMutation,
  useUpdateWarningMessageMutation,
} = cancellationApi

export const RIDE_CATEGORY_OPTIONS: { value: RideCategory; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'xl', label: 'XL' },
  { value: 'priority', label: 'Priority' },
  { value: 'pet', label: 'Pet' },
  { value: 'black', label: 'Black' },
  { value: 'black_suv', label: 'Black SUV' },
]
