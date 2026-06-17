import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CapacityAutoRules,
  CapacityOverview,
  DriverCapSetting,
  WaitlistDriver,
  WaitlistDriverStatus,
} from '@/types/driverCapacity'
import {
  computeCapacityOverview,
  mockCapacityAutoRules,
  mockDriverCapSettings,
  mockWaitlistDrivers,
  recalcCapSlots,
  reorderWaitlistPositions,
} from '@/services/mock/driverCapacityData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const driverCapacityApi = createApi({
  reducerPath: 'driverCapacityApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CapacityOverview', 'DriverCapSettings', 'WaitlistDrivers', 'CapacityAutoRules'],
  endpoints: (builder) => ({
    getCapacityOverview: builder.query<CapacityOverview, void>({
      queryFn: async () => {
        await delay()
        return { data: computeCapacityOverview() }
      },
      providesTags: ['CapacityOverview'],
    }),
    getDriverCapSettings: builder.query<DriverCapSetting[], void>({
      queryFn: async () => ({ data: [...mockDriverCapSettings] }),
      providesTags: ['DriverCapSettings'],
    }),
    updateDriverCapSetting: builder.mutation<DriverCapSetting, { id: string; maxDrivers: number }>({
      queryFn: async ({ id, maxDrivers }) => {
        await delay()
        const index = mockDriverCapSettings.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Cap setting not found' } }
        mockDriverCapSettings[index] = { ...mockDriverCapSettings[index], maxDrivers }
        recalcCapSlots(mockDriverCapSettings[index])
        return { data: mockDriverCapSettings[index] }
      },
      invalidatesTags: ['DriverCapSettings', 'CapacityOverview'],
    }),
    getWaitlistDrivers: builder.query<WaitlistDriver[], void>({
      queryFn: async () => ({ data: [...mockWaitlistDrivers].sort((a, b) => a.position - b.position) }),
      providesTags: ['WaitlistDrivers'],
    }),
    approveWaitlistDriver: builder.mutation<WaitlistDriver, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index] = { ...mockWaitlistDrivers[index], status: 'approved' }
        const cap = mockDriverCapSettings.find(
          (c) => c.city === mockWaitlistDrivers[index].city && c.state === mockWaitlistDrivers[index].state,
        )
        if (cap && cap.remainingSlots > 0) {
          cap.currentDrivers += 1
          recalcCapSlots(cap)
        }
        reorderWaitlistPositions()
        return { data: mockWaitlistDrivers[index] }
      },
      invalidatesTags: ['WaitlistDrivers', 'CapacityOverview', 'DriverCapSettings'],
    }),
    rejectWaitlistDriver: builder.mutation<WaitlistDriver, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index] = { ...mockWaitlistDrivers[index], status: 'rejected', priority: false }
        reorderWaitlistPositions()
        return { data: mockWaitlistDrivers[index] }
      },
      invalidatesTags: ['WaitlistDrivers', 'CapacityOverview'],
    }),
    priorityApproveWaitlistDriver: builder.mutation<WaitlistDriver, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index] = {
          ...mockWaitlistDrivers[index],
          status: 'approved',
          priority: true,
        }
        const cap = mockDriverCapSettings.find(
          (c) => c.city === mockWaitlistDrivers[index].city && c.state === mockWaitlistDrivers[index].state,
        )
        if (cap && cap.remainingSlots > 0) {
          cap.currentDrivers += 1
          recalcCapSlots(cap)
        }
        reorderWaitlistPositions()
        return { data: mockWaitlistDrivers[index] }
      },
      invalidatesTags: ['WaitlistDrivers', 'CapacityOverview', 'DriverCapSettings'],
    }),
    moveWaitlistPosition: builder.mutation<WaitlistDriver, { id: string; position: number }>({
      queryFn: async ({ id, position }) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index].position = position
        reorderWaitlistPositions()
        return { data: mockWaitlistDrivers[index] }
      },
      invalidatesTags: ['WaitlistDrivers'],
    }),
    setWaitlistPriority: builder.mutation<WaitlistDriver, { id: string; priority: boolean }>({
      queryFn: async ({ id, priority }) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index] = {
          ...mockWaitlistDrivers[index],
          priority,
          status: priority ? 'priority' : 'pending',
        }
        reorderWaitlistPositions()
        return { data: mockWaitlistDrivers[index] }
      },
      invalidatesTags: ['WaitlistDrivers'],
    }),
    getCapacityAutoRules: builder.query<CapacityAutoRules, void>({
      queryFn: async () => ({ data: { ...mockCapacityAutoRules } }),
      providesTags: ['CapacityAutoRules'],
    }),
    updateCapacityAutoRules: builder.mutation<CapacityAutoRules, Partial<CapacityAutoRules>>({
      queryFn: async (updates) => {
        await delay()
        Object.assign(mockCapacityAutoRules, updates)
        return { data: { ...mockCapacityAutoRules } }
      },
      invalidatesTags: ['CapacityAutoRules'],
    }),
  }),
})

export const {
  useGetCapacityOverviewQuery,
  useGetDriverCapSettingsQuery,
  useUpdateDriverCapSettingMutation,
  useGetWaitlistDriversQuery,
  useApproveWaitlistDriverMutation,
  useRejectWaitlistDriverMutation,
  usePriorityApproveWaitlistDriverMutation,
  useMoveWaitlistPositionMutation,
  useGetCapacityAutoRulesQuery,
  useUpdateCapacityAutoRulesMutation,
} = driverCapacityApi

export const WAITLIST_STATUS_LABELS: Record<WaitlistDriverStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  priority: 'Priority',
}
