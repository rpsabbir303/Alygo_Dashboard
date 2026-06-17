import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BackgroundCheckFeeAuditLog,
  BackgroundCheckFeeConfig,
  BackgroundCheckFeeOverview,
  BackgroundCheckPaymentRules,
} from '@/types/backgroundCheckFee'
import {
  computeBackgroundCheckFeeOverview,
  logFeeConfigChanges,
  logPaymentRulesChanges,
  mockBackgroundCheckFeeAuditLogs,
  mockBackgroundCheckFees,
  mockBackgroundCheckPaymentRules,
} from '@/services/mock/backgroundCheckFeeData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const backgroundCheckFeeApi = createApi({
  reducerPath: 'backgroundCheckFeeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['BackgroundCheckFeeOverview', 'BackgroundCheckFees', 'BackgroundCheckPaymentRules', 'BackgroundCheckFeeAuditLogs'],
  endpoints: (builder) => ({
    getBackgroundCheckFeeOverview: builder.query<BackgroundCheckFeeOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeBackgroundCheckFeeOverview() }
      },
      providesTags: ['BackgroundCheckFeeOverview'],
    }),
    getBackgroundCheckFees: builder.query<BackgroundCheckFeeConfig[], void>({
      queryFn: async () => ({ data: [...mockBackgroundCheckFees] }),
      providesTags: ['BackgroundCheckFees'],
    }),
    updateBackgroundCheckFee: builder.mutation<
      BackgroundCheckFeeConfig,
      Partial<BackgroundCheckFeeConfig> & { id: string; changedBy?: string }
    >({
      queryFn: async ({ id, changedBy = 'Admin', ...updates }) => {
        await delay()
        const index = mockBackgroundCheckFees.findIndex((f) => f.id === id)
        if (index === -1) return { error: { status: 404, data: 'Fee configuration not found' } }
        const before = { ...mockBackgroundCheckFees[index] }
        mockBackgroundCheckFees[index] = { ...mockBackgroundCheckFees[index], ...updates }
        logFeeConfigChanges(mockBackgroundCheckFees[index], before, updates, changedBy)
        return { data: mockBackgroundCheckFees[index] }
      },
      invalidatesTags: ['BackgroundCheckFees', 'BackgroundCheckFeeAuditLogs'],
    }),
    getBackgroundCheckPaymentRules: builder.query<BackgroundCheckPaymentRules, void>({
      queryFn: async () => ({ data: { ...mockBackgroundCheckPaymentRules } }),
      providesTags: ['BackgroundCheckPaymentRules'],
    }),
    updateBackgroundCheckPaymentRules: builder.mutation<
      BackgroundCheckPaymentRules,
      Partial<BackgroundCheckPaymentRules> & { changedBy?: string }
    >({
      queryFn: async ({ changedBy = 'Admin', ...updates }) => {
        await delay()
        const before = { ...mockBackgroundCheckPaymentRules }
        Object.assign(mockBackgroundCheckPaymentRules, updates)
        logPaymentRulesChanges(before, { ...mockBackgroundCheckPaymentRules }, changedBy)
        return { data: { ...mockBackgroundCheckPaymentRules } }
      },
      invalidatesTags: ['BackgroundCheckPaymentRules', 'BackgroundCheckFeeAuditLogs'],
    }),
    getBackgroundCheckFeeAuditLogs: builder.query<BackgroundCheckFeeAuditLog[], void>({
      queryFn: async () => ({ data: [...mockBackgroundCheckFeeAuditLogs] }),
      providesTags: ['BackgroundCheckFeeAuditLogs'],
    }),
  }),
})

export const {
  useGetBackgroundCheckFeeOverviewQuery,
  useGetBackgroundCheckFeesQuery,
  useUpdateBackgroundCheckFeeMutation,
  useGetBackgroundCheckPaymentRulesQuery,
  useUpdateBackgroundCheckPaymentRulesMutation,
  useGetBackgroundCheckFeeAuditLogsQuery,
} = backgroundCheckFeeApi

export { CATEGORY_LABELS, PAYMENT_MODE_LABELS } from '@/services/mock/backgroundCheckFeeData'
