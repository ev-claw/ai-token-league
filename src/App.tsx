import { useState } from 'react'
import Header from './components/Header'
import PeriodSelector, { Period } from './components/PeriodSelector'
import KPICards from './components/KPICards'
import TrendChart from './components/TrendChart'
import ProviderDistribution from './components/ProviderDistribution'
import ProviderCards from './components/ProviderCards'
import UserLeaderboard from './components/UserLeaderboard'
import DeptBreakdown from './components/DeptBreakdown'
import { TEAM_TOTALS } from './data/mockData'

export default function App() {
  const [period, setPeriod] = useState<Period>('last7d')

  const totals = TEAM_TOTALS[period]
  const lastRefreshed = 'Mar 29, 2026 · 9:41 AM'

  return (
    <div className="min-h-screen bg-surface-900 grid-bg">
      <Header lastRefreshed={lastRefreshed} />

      <main className="max-w-screen-2xl mx-auto px-6 py-8 space-y-6">
        {/* Page title + period selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 leading-none">Token Consumption</h2>
            <p className="text-sm text-slate-500 mt-1">
              AI tool usage across your engineering organisation
            </p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* KPI summary row */}
        <KPICards totals={totals} period={period} />

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <TrendChart />
          </div>
          <div>
            <ProviderDistribution totals={totals} />
          </div>
        </div>

        {/* Provider breakdown cards */}
        <div>
          <h3 className="label mb-3">Provider Breakdown</h3>
          <ProviderCards totals={totals} period={period} />
        </div>

        {/* Department + Leaderboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div>
            <DeptBreakdown period={period} />
          </div>
          <div className="xl:col-span-2">
            <UserLeaderboard period={period} />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-medium">AI Token League · Engineering Director Dashboard</span>
            <div className="flex items-center gap-4">
              <span>Data period: Jan 1 – Mar 29, 2026</span>
              <span>25 users · 4 providers</span>
              <span className="font-mono">v1.0.0-demo</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
