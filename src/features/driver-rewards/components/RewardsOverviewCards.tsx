import { useGetRewardsConfigOverviewQuery } from '@/services/driverRewardsApi'

export function RewardsOverviewCards() {
  const { data, isLoading } = useGetRewardsConfigOverviewQuery()

  const metrics = [
    { label: 'Total Reward Rules', value: data?.totalRewardRules ?? '—' },
    { label: 'Total Bonus Programs', value: data?.totalBonusPrograms ?? '—' },
    { label: 'Total Penalty Rules', value: data?.totalPenaltyRules ?? '—' },
    { label: 'Highest Reward Action', value: data?.highestRewardAction ?? '—' },
    { label: 'Highest Penalty Rule', value: data?.highestPenaltyRule ?? '—' },
    { label: 'Active Configurations', value: data?.activeConfigurations ?? '—' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((m) => (
        <div key={m.label} className="glass-card p-5">
          <p className="text-sm text-alygo-text-muted">{m.label}</p>
          <p
            className={`mt-2 text-lg font-semibold text-white sm:text-xl ${isLoading ? 'opacity-50' : ''}`}
          >
            {m.value}
          </p>
        </div>
      ))}
    </div>
  )
}
