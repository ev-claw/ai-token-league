import { BarChart2, TrendingUp } from 'lucide-react'
import { ProviderUsage, PROVIDERS, USER_STATS, fmtTokens, totalTokens } from '../data/mockData'
import type { Period } from './PeriodSelector'

interface Props {
  totals: ProviderUsage
  period: Period
}

export default function ProviderCards({ totals, period }: Props) {
  const grand = totalTokens(totals)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {PROVIDERS.map(p => {
        const value = totals[p.id]
        const share = grand > 0 ? Math.round((value / grand) * 100) : 0

        // Count users actively using this provider in this period
        const activeCount = USER_STATS.filter(s => s[period][p.id] > 0).length

        // Top user for this provider in this period
        const topUser = USER_STATS.reduce((a, b) =>
          a[period][p.id] > b[period][p.id] ? a : b
        )

        return (
          <div
            key={p.id}
            className="card p-5 relative overflow-hidden hover:border-border-bright transition-all duration-200 group"
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 0% 0%, ${p.muted} 0%, transparent 60%)` }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center border text-sm font-bold"
                  style={{
                    backgroundColor: p.muted,
                    borderColor: p.color + '40',
                    color: p.light,
                  }}
                >
                  {p.label[0]}
                </div>
                <span className="text-sm font-semibold text-slate-200">{p.label}</span>
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  backgroundColor: p.muted,
                  borderColor: p.color + '40',
                  color: p.light,
                }}
              >
                {share}%
              </div>
            </div>

            {/* Main metric */}
            <p
              className="text-2xl font-bold font-mono leading-none mb-1"
              style={{ color: p.light }}
            >
              {fmtTokens(value)}
            </p>
            <p className="text-xs text-slate-500 font-mono mb-4">{value.toLocaleString()} tokens</p>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-surface-500 mb-4">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${share}%`, background: p.color }}
              />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <BarChart2 size={11} />
                <span>{activeCount} users</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <TrendingUp size={11} style={{ color: p.color }} />
                <span className="text-slate-400 truncate max-w-[80px]" title={topUser.user.name}>
                  {topUser.user.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
