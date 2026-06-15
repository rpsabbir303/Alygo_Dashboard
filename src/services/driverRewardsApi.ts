import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  Achievement,
  BonusRule,
  DriverLevel,
  DriverPerformanceRecord,
  DriverRewardsOverview,
  DriverRewardsOverviewCharts,
  EarningsAnalyticsData,
  EarningsPeriod,
  LevelAnalyticsData,
  LevelBenefit,
  PointsRule,
  ProgressionRule,
  Promotion,
  RewardNotificationTemplate,
  RewardsSearchResult,
} from '@/types/driverRewards'
import type { DriverLevelName } from '@/types/driverRewards'
import {
  computeDriverRewardsOverview,
  getEarningsAnalytics,
  mockAchievements,
  mockBonusRules,
  mockDriverLevels,
  mockDriverPerformance,
  mockLevelAnalytics,
  mockLevelBenefits,
  mockNotificationTemplates,
  mockOverviewCharts,
  mockPointsRules,
  mockProgressionRules,
  mockPromotions,
} from '@/services/mock/driverRewardsData'
import { createDefaultLevel } from '@/features/driver-rewards/utils/tierDefaults'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const levelOrder: DriverLevelName[] = ['journey', 'pro_go', 'elite', 'platinum', 'diamond']

function syncLevelBenefitsCount() {
  mockDriverLevels.forEach((level) => {
    level.benefitsCount = mockLevelBenefits.filter(
      (b) => b.level === level.name && b.status === 'active',
    ).length
  })
}

function syncProgressionFromLevel(level: DriverLevel) {
  const progIndex = mockProgressionRules.findIndex((p) => p.level === level.name)
  if (progIndex !== -1) {
    mockProgressionRules[progIndex] = {
      ...mockProgressionRules[progIndex],
      requiredPoints: level.requiredPoints,
      requiredRating: level.requiredRating,
      requiredTrips: level.requiredTrips,
      requiredOnlineHours: level.requiredOnlineHours,
      requiredAcceptanceRate: level.requiredAcceptanceRate,
      requiredCompletionRate: level.requiredCompletionRate,
    }
  }
}

export const driverRewardsApi = createApi({
  reducerPath: 'driverRewardsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'RewardsOverview',
    'DriverLevels',
    'PointsRules',
    'LevelBenefits',
    'DriverPerformance',
    'Promotions',
    'Achievements',
    'ProgressionRules',
    'NotificationTemplates',
    'BonusRules',
    'EarningsAnalytics',
    'LevelAnalytics',
  ],
  endpoints: (builder) => ({
    getRewardsOverview: builder.query<
      { overview: DriverRewardsOverview; charts: DriverRewardsOverviewCharts },
      void
    >({
      queryFn: async () => ({
        data: { overview: computeDriverRewardsOverview(), charts: mockOverviewCharts },
      }),
      providesTags: ['RewardsOverview'],
    }),
    getDriverLevels: builder.query<DriverLevel[], void>({
      queryFn: async () => {
        syncLevelBenefitsCount()
        return { data: [...mockDriverLevels] }
      },
      providesTags: ['DriverLevels'],
    }),
    updateDriverLevel: builder.mutation<DriverLevel, Partial<DriverLevel> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockDriverLevels.findIndex((l) => l.id === id)
        if (index === -1) return { error: { status: 404, data: 'Level not found' } }
        mockDriverLevels[index] = { ...mockDriverLevels[index], ...updates }
        syncProgressionFromLevel(mockDriverLevels[index])
        return { data: mockDriverLevels[index] }
      },
      invalidatesTags: ['DriverLevels', 'ProgressionRules', 'RewardsOverview', 'LevelAnalytics'],
    }),
    createDriverLevel: builder.mutation<DriverLevel, Omit<DriverLevel, 'id' | 'benefitsCount'>>({
      queryFn: async (payload) => {
        await delay()
        const level: DriverLevel = {
          ...payload,
          id: `lvl-${Date.now()}`,
          benefitsCount: 0,
        }
        mockDriverLevels.push(level)
        mockProgressionRules.push({
          id: `prog-${level.id}`,
          level: level.name,
          requiredPoints: level.requiredPoints,
          requiredRating: level.requiredRating,
          requiredTrips: level.requiredTrips,
          requiredOnlineHours: level.requiredOnlineHours,
          requiredAcceptanceRate: level.requiredAcceptanceRate,
          requiredCompletionRate: level.requiredCompletionRate,
        })
        return { data: level }
      },
      invalidatesTags: ['DriverLevels', 'ProgressionRules', 'RewardsOverview'],
    }),
    duplicateDriverLevel: builder.mutation<DriverLevel, string>({
      queryFn: async (id) => {
        await delay()
        const source = mockDriverLevels.find((l) => l.id === id)
        if (!source) return { error: { status: 404, data: 'Tier not found' } }
        const duplicate = createDefaultLevel(
          `lvl-${Date.now()}`,
          `${source.name}_copy`,
          `${source.label} (Copy)`,
          source.description,
          source.requiredPoints,
          source.requiredRating,
          source.requiredTrips,
          source.requiredOnlineHours,
          source.requiredAcceptanceRate,
          source.requiredCompletionRate,
          0,
        )
        duplicate.tierColor = source.tierColor
        duplicate.tierBadge = `${source.tierBadge}*`
        duplicate.status = 'inactive'
        mockDriverLevels.push(duplicate)
        return { data: duplicate }
      },
      invalidatesTags: ['DriverLevels', 'ProgressionRules'],
    }),
    getPointsRules: builder.query<PointsRule[], void>({
      queryFn: async () => ({ data: [...mockPointsRules] }),
      providesTags: ['PointsRules'],
    }),
    updatePointsRule: builder.mutation<PointsRule, Partial<PointsRule> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockPointsRules.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Rule not found' } }
        mockPointsRules[index] = { ...mockPointsRules[index], ...updates }
        return { data: mockPointsRules[index] }
      },
      invalidatesTags: ['PointsRules'],
    }),
    createPointsRule: builder.mutation<PointsRule, Omit<PointsRule, 'id'>>({
      queryFn: async (payload) => {
        await delay()
        const rule: PointsRule = { ...payload, id: `pr-${Date.now()}` }
        mockPointsRules.unshift(rule)
        return { data: rule }
      },
      invalidatesTags: ['PointsRules'],
    }),
    deletePointsRule: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockPointsRules.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Rule not found' } }
        mockPointsRules.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['PointsRules'],
    }),
    getDriverPerformance: builder.query<DriverPerformanceRecord[], void>({
      queryFn: async () => ({ data: [...mockDriverPerformance] }),
      providesTags: ['DriverPerformance'],
    }),
    adjustDriverPoints: builder.mutation<
      DriverPerformanceRecord,
      { id: string; points: number; reason: string }
    >({
      queryFn: async ({ id, points, reason }) => {
        await delay()
        const index = mockDriverPerformance.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockDriverPerformance[index] = {
          ...mockDriverPerformance[index],
          currentPoints: mockDriverPerformance[index].currentPoints + points,
          pointsHistory: [
            { action: reason, points, date: new Date().toISOString() },
            ...mockDriverPerformance[index].pointsHistory,
          ],
        }
        return { data: mockDriverPerformance[index] }
      },
      invalidatesTags: ['DriverPerformance', 'RewardsOverview', 'LevelAnalytics'],
    }),
    changeDriverLevel: builder.mutation<
      DriverPerformanceRecord,
      { id: string; direction: 'upgrade' | 'downgrade' }
    >({
      queryFn: async ({ id, direction }) => {
        await delay()
        const index = mockDriverPerformance.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        const currentIdx = levelOrder.indexOf(mockDriverPerformance[index].currentLevel)
        const newIdx = direction === 'upgrade' ? currentIdx + 1 : currentIdx - 1
        if (newIdx < 0 || newIdx >= levelOrder.length) {
          return { error: { status: 400, data: 'Cannot change level further' } }
        }
        const newLevel = levelOrder[newIdx]
        mockDriverPerformance[index] = {
          ...mockDriverPerformance[index],
          currentLevel: newLevel,
          levelHistory: [
            { level: newLevel, date: new Date().toISOString() },
            ...mockDriverPerformance[index].levelHistory,
          ],
        }
        return { data: mockDriverPerformance[index] }
      },
      invalidatesTags: ['DriverPerformance', 'RewardsOverview', 'LevelAnalytics'],
    }),
    resetDriverTier: builder.mutation<DriverPerformanceRecord, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockDriverPerformance.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockDriverPerformance[index] = {
          ...mockDriverPerformance[index],
          currentLevel: 'journey',
          levelHistory: [
            { level: 'journey', date: new Date().toISOString() },
            ...mockDriverPerformance[index].levelHistory,
          ],
        }
        return { data: mockDriverPerformance[index] }
      },
      invalidatesTags: ['DriverPerformance', 'RewardsOverview', 'LevelAnalytics'],
    }),
    suspendDriverRewards: builder.mutation<DriverPerformanceRecord, { id: string; suspended: boolean }>({
      queryFn: async ({ id, suspended }) => {
        await delay()
        const index = mockDriverPerformance.findIndex((d) => d.id === id)
        if (index === -1) return { error: { status: 404, data: 'Driver not found' } }
        mockDriverPerformance[index] = {
          ...mockDriverPerformance[index],
          rewardsSuspended: suspended,
          status: suspended ? 'suspended' : 'active',
        }
        return { data: mockDriverPerformance[index] }
      },
      invalidatesTags: ['DriverPerformance'],
    }),
    getBonusRules: builder.query<BonusRule[], void>({
      queryFn: async () => ({ data: [...mockBonusRules] }),
      providesTags: ['BonusRules'],
    }),
    createBonusRule: builder.mutation<BonusRule, Omit<BonusRule, 'id'>>({
      queryFn: async (payload) => {
        await delay()
        const rule: BonusRule = { ...payload, id: `br-${Date.now()}` }
        mockBonusRules.unshift(rule)
        return { data: rule }
      },
      invalidatesTags: ['BonusRules', 'EarningsAnalytics'],
    }),
    searchRewards: builder.query<RewardsSearchResult[], string>({
      queryFn: async (query) => {
        await delay(150)
        const q = query.trim().toLowerCase()
        if (!q) return { data: [] }
        const results: RewardsSearchResult[] = []
        mockDriverPerformance.forEach((d) => {
          if (d.driverName.toLowerCase().includes(q) || d.driverId.toLowerCase().includes(q) || String(d.currentPoints).includes(q)) {
            results.push({ type: 'driver', id: d.id, label: d.driverName, meta: `${d.driverId} · ${d.currentPoints} pts` })
          }
        })
        mockDriverLevels.forEach((l) => {
          if (l.label.toLowerCase().includes(q)) {
            results.push({ type: 'tier', id: l.id, label: l.label, meta: `${l.requiredPoints} points required` })
          }
        })
        mockAchievements.forEach((a) => {
          if (a.name.toLowerCase().includes(q)) {
            results.push({ type: 'achievement', id: a.id, label: a.name, meta: `${a.pointsAwarded} pts` })
          }
        })
        mockPromotions.forEach((p) => {
          if (p.name.toLowerCase().includes(q)) {
            results.push({ type: 'promotion', id: p.id, label: p.name, meta: p.type.replace(/_/g, ' ') })
          }
        })
        mockPointsRules.forEach((r) => {
          if (r.ruleName.toLowerCase().includes(q) || String(r.points).includes(q)) {
            results.push({ type: 'points', id: r.id, label: r.ruleName, meta: `${r.points > 0 ? '+' : ''}${r.points} pts` })
          }
        })
        return { data: results.slice(0, 12) }
      },
    }),
    getPromotions: builder.query<Promotion[], void>({
      queryFn: async () => ({ data: [...mockPromotions] }),
      providesTags: ['Promotions'],
    }),
    createPromotion: builder.mutation<Promotion, Omit<Promotion, 'id'>>({
      queryFn: async (payload) => {
        await delay()
        const promotion: Promotion = { ...payload, id: `promo-${Date.now()}` }
        mockPromotions.unshift(promotion)
        return { data: promotion }
      },
      invalidatesTags: ['Promotions', 'EarningsAnalytics'],
    }),
    updatePromotion: builder.mutation<Promotion, Partial<Promotion> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockPromotions.findIndex((p) => p.id === id)
        if (index === -1) return { error: { status: 404, data: 'Promotion not found' } }
        mockPromotions[index] = { ...mockPromotions[index], ...updates }
        return { data: mockPromotions[index] }
      },
      invalidatesTags: ['Promotions', 'EarningsAnalytics'],
    }),
    deletePromotion: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockPromotions.findIndex((p) => p.id === id)
        if (index === -1) return { error: { status: 404, data: 'Promotion not found' } }
        mockPromotions.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['Promotions'],
    }),
    getLevelBenefits: builder.query<LevelBenefit[], void>({
      queryFn: async () => ({ data: [...mockLevelBenefits] }),
      providesTags: ['LevelBenefits'],
    }),
    createLevelBenefit: builder.mutation<LevelBenefit, Omit<LevelBenefit, 'id'>>({
      queryFn: async (payload) => {
        await delay()
        const benefit: LevelBenefit = { ...payload, id: `ben-${Date.now()}` }
        mockLevelBenefits.unshift(benefit)
        syncLevelBenefitsCount()
        return { data: benefit }
      },
      invalidatesTags: ['LevelBenefits', 'DriverLevels'],
    }),
    updateLevelBenefit: builder.mutation<LevelBenefit, Partial<LevelBenefit> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockLevelBenefits.findIndex((b) => b.id === id)
        if (index === -1) return { error: { status: 404, data: 'Benefit not found' } }
        mockLevelBenefits[index] = { ...mockLevelBenefits[index], ...updates }
        syncLevelBenefitsCount()
        return { data: mockLevelBenefits[index] }
      },
      invalidatesTags: ['LevelBenefits', 'DriverLevels'],
    }),
    deleteLevelBenefit: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockLevelBenefits.findIndex((b) => b.id === id)
        if (index === -1) return { error: { status: 404, data: 'Benefit not found' } }
        mockLevelBenefits.splice(index, 1)
        syncLevelBenefitsCount()
        return { data: undefined }
      },
      invalidatesTags: ['LevelBenefits', 'DriverLevels'],
    }),
    getAchievements: builder.query<Achievement[], void>({
      queryFn: async () => ({ data: [...mockAchievements] }),
      providesTags: ['Achievements'],
    }),
    createAchievement: builder.mutation<Achievement, Omit<Achievement, 'id'>>({
      queryFn: async (payload) => {
        await delay()
        const achievement: Achievement = { ...payload, id: `ach-${Date.now()}` }
        mockAchievements.unshift(achievement)
        return { data: achievement }
      },
      invalidatesTags: ['Achievements'],
    }),
    updateAchievement: builder.mutation<Achievement, Partial<Achievement> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockAchievements.findIndex((a) => a.id === id)
        if (index === -1) return { error: { status: 404, data: 'Achievement not found' } }
        mockAchievements[index] = { ...mockAchievements[index], ...updates }
        return { data: mockAchievements[index] }
      },
      invalidatesTags: ['Achievements'],
    }),
    deleteAchievement: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay()
        const index = mockAchievements.findIndex((a) => a.id === id)
        if (index === -1) return { error: { status: 404, data: 'Achievement not found' } }
        mockAchievements.splice(index, 1)
        return { data: undefined }
      },
      invalidatesTags: ['Achievements'],
    }),
    getProgressionRules: builder.query<ProgressionRule[], void>({
      queryFn: async () => ({ data: [...mockProgressionRules] }),
      providesTags: ['ProgressionRules'],
    }),
    updateProgressionRule: builder.mutation<ProgressionRule, Partial<ProgressionRule> & { id: string }>({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockProgressionRules.findIndex((r) => r.id === id)
        if (index === -1) return { error: { status: 404, data: 'Rule not found' } }
        mockProgressionRules[index] = { ...mockProgressionRules[index], ...updates }
        const levelIndex = mockDriverLevels.findIndex(
          (l) => l.name === mockProgressionRules[index].level,
        )
        if (levelIndex !== -1) {
          mockDriverLevels[levelIndex] = {
            ...mockDriverLevels[levelIndex],
            requiredPoints: mockProgressionRules[index].requiredPoints,
            requiredRating: mockProgressionRules[index].requiredRating,
            requiredTrips: mockProgressionRules[index].requiredTrips,
            requiredOnlineHours: mockProgressionRules[index].requiredOnlineHours,
            requiredAcceptanceRate: mockProgressionRules[index].requiredAcceptanceRate,
            requiredCompletionRate: mockProgressionRules[index].requiredCompletionRate,
          }
        }
        return { data: mockProgressionRules[index] }
      },
      invalidatesTags: ['ProgressionRules', 'DriverLevels'],
    }),
    getNotificationTemplates: builder.query<RewardNotificationTemplate[], void>({
      queryFn: async () => ({ data: [...mockNotificationTemplates] }),
      providesTags: ['NotificationTemplates'],
    }),
    updateNotificationTemplate: builder.mutation<
      RewardNotificationTemplate,
      Partial<RewardNotificationTemplate> & { id: string }
    >({
      queryFn: async ({ id, ...updates }) => {
        await delay()
        const index = mockNotificationTemplates.findIndex((t) => t.id === id)
        if (index === -1) return { error: { status: 404, data: 'Template not found' } }
        mockNotificationTemplates[index] = { ...mockNotificationTemplates[index], ...updates }
        return { data: mockNotificationTemplates[index] }
      },
      invalidatesTags: ['NotificationTemplates'],
    }),
    getEarningsAnalytics: builder.query<EarningsAnalyticsData, EarningsPeriod>({
      queryFn: async (period) => ({ data: getEarningsAnalytics(period) }),
      providesTags: ['EarningsAnalytics'],
    }),
    getLevelAnalytics: builder.query<LevelAnalyticsData, void>({
      queryFn: async () => ({ data: mockLevelAnalytics }),
      providesTags: ['LevelAnalytics'],
    }),
  }),
})

export const {
  useGetRewardsOverviewQuery,
  useGetDriverLevelsQuery,
  useUpdateDriverLevelMutation,
  useCreateDriverLevelMutation,
  useDuplicateDriverLevelMutation,
  useGetPointsRulesQuery,
  useUpdatePointsRuleMutation,
  useCreatePointsRuleMutation,
  useDeletePointsRuleMutation,
  useGetLevelBenefitsQuery,
  useCreateLevelBenefitMutation,
  useUpdateLevelBenefitMutation,
  useDeleteLevelBenefitMutation,
  useGetDriverPerformanceQuery,
  useAdjustDriverPointsMutation,
  useChangeDriverLevelMutation,
  useResetDriverTierMutation,
  useSuspendDriverRewardsMutation,
  useGetBonusRulesQuery,
  useCreateBonusRuleMutation,
  useSearchRewardsQuery,
  useLazySearchRewardsQuery,
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useGetAchievementsQuery,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
  useGetProgressionRulesQuery,
  useUpdateProgressionRuleMutation,
  useGetNotificationTemplatesQuery,
  useUpdateNotificationTemplateMutation,
  useGetEarningsAnalyticsQuery,
  useGetLevelAnalyticsQuery,
} = driverRewardsApi

export const LEVEL_LABELS: Record<DriverLevelName, string> = {
  journey: 'Journey',
  pro_go: 'Pro Go',
  elite: 'Elite',
  platinum: 'Platinum',
  diamond: 'Diamond',
}

export const PROMOTION_TYPE_LABELS: Record<string, string> = {
  weekend_bonus: 'Weekend Bonus',
  airport_bonus: 'Airport Bonus',
  event_bonus: 'Event Bonus',
  peak_hour_bonus: 'Peak Hour Bonus',
  diamond_bonus: 'Diamond Bonus',
  black_driver_bonus: 'Black Driver Bonus',
  black_suv_bonus: 'Black SUV Bonus',
  referral_bonus: 'Referral Bonus',
  diamond_driver_bonus: 'Diamond Driver Bonus',
}

export const LEVEL_OPTIONS = Object.entries(LEVEL_LABELS).map(([value, label]) => ({
  value,
  label,
}))
