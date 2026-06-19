import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CapacityOverview,
  CapacityRuleFormValues,
  DriverCapSetting,
  DriverCapacityListParams,
  DriverCapacityListResponse,
  WaitlistDriver,
} from '@/types/driverCapacity'
import {
  computeCapacityOverview,
  mockDriverCapSettings,
  mockWaitlistDrivers,
  paginateWaitlistDrivers,
  recalcCapSlots,
  reorderWaitlistPositions,
} from '@/services/mock/driverCapacityData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const driverCapacityApi = createApi({
  reducerPath: 'driverCapacityApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CapacityOverview', 'DriverCapSettings', 'WaitlistDrivers'],
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
    createDriverCapSetting: builder.mutation<DriverCapSetting, CapacityRuleFormValues>({
      queryFn: async (values) => {
        await delay()
        const rule: DriverCapSetting = {
          id: `cap-${Date.now()}`,
          state: values.state,
          city: values.city,
          maxDrivers: values.maxDrivers,
          currentDrivers: 0,
          remainingSlots: values.maxDrivers,
          notes: values.notes,
          status: values.status,
        }
        mockDriverCapSettings.unshift(rule)
        return { data: rule }
      },
      invalidatesTags: ['DriverCapSettings', 'CapacityOverview'],
    }),
    updateDriverCapSetting: builder.mutation<
      DriverCapSetting,
      { id: string } & Partial<CapacityRuleFormValues>
    >({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockDriverCapSettings.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Capacity rule not found' } }
        const nextMax = updates.maxDrivers ?? mockDriverCapSettings[index].maxDrivers
        if (nextMax < mockDriverCapSettings[index].currentDrivers) {
          return { error: { status: 400, data: 'Max drivers cannot be below current driver count' } }
        }
        mockDriverCapSettings[index] = {
          ...mockDriverCapSettings[index],
          ...updates,
          maxDrivers: nextMax,
        }
        recalcCapSlots(mockDriverCapSettings[index])
        return { data: mockDriverCapSettings[index] }
      },
      invalidatesTags: ['DriverCapSettings', 'CapacityOverview'],
    }),
    deleteDriverCapSetting: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockDriverCapSettings.findIndex((c) => c.id === id)
        if (index === -1) return { error: { status: 404, data: 'Capacity rule not found' } }
        if (mockDriverCapSettings[index].currentDrivers > 0) {
          return { error: { status: 400, data: 'Cannot delete a rule with active drivers' } }
        }
        mockDriverCapSettings.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['DriverCapSettings', 'CapacityOverview'],
    }),
    getWaitlistDrivers: builder.query<
      DriverCapacityListResponse<WaitlistDriver>,
      DriverCapacityListParams | void
    >({
      queryFn: async (params) => {
        await delay()
        return { data: paginateWaitlistDrivers(params ?? {}) }
      },
      providesTags: ['WaitlistDrivers'],
    }),
    approveWaitlistDriver: builder.mutation<WaitlistDriver, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index] = { ...mockWaitlistDrivers[index], status: 'approved' }
        const cap = mockDriverCapSettings.find(
          (c) =>
            c.city === mockWaitlistDrivers[index].city &&
            c.state === mockWaitlistDrivers[index].state &&
            c.status === 'active',
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
    setWaitlistPriority: builder.mutation<WaitlistDriver, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers[index] = {
          ...mockWaitlistDrivers[index],
          priority: true,
          status: 'priority',
        }
        reorderWaitlistPositions()
        return { data: mockWaitlistDrivers[index] }
      },
      invalidatesTags: ['WaitlistDrivers'],
    }),
    removeWaitlistDriver: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockWaitlistDrivers.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockWaitlistDrivers.splice(index, 1)
        reorderWaitlistPositions()
        return { data: undefined }
      },
      invalidatesTags: ['WaitlistDrivers', 'CapacityOverview'],
    }),
  }),
})

export const {
  useGetCapacityOverviewQuery,
  useGetDriverCapSettingsQuery,
  useCreateDriverCapSettingMutation,
  useUpdateDriverCapSettingMutation,
  useDeleteDriverCapSettingMutation,
  useGetWaitlistDriversQuery,
  useApproveWaitlistDriverMutation,
  useRejectWaitlistDriverMutation,
  useSetWaitlistPriorityMutation,
  useRemoveWaitlistDriverMutation,
} = driverCapacityApi

export const WAITLIST_STATUS_LABELS: Record<WaitlistDriver['status'], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  priority: 'Priority',
}

export { CITY_OPTIONS, STATE_OPTIONS } from '@/services/mock/driverCapacityData'
