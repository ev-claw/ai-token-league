import { TrendingUp, TrendingDown, Minus, Users, Zap, Crown } from 'lucide-react'
import clsx from 'clsx'
import {
  ProviderUsage, PROVIDERS, fmtTokens, fmtTokensFull, totalTokens, USER_STATS, CHANGE_PCT
} from '../data/mockData'
import type { Period } from './PeriodSelector'

interface KPICardsProps {
  totals: ProviderUsage
  period: Period
}

function TrendBadge({ pct }: { pct: number }) {
  const isPos = pct > 0
  const isZero = pct === 0
  return (
    <div className={clsx(
      'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
      isZero ? 'bg-slate-700 text-slate-400'
        : isPos ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
          : 'bg-red-950 text-red-400 border border-red-900',
    )}>
      {isZero ? <Minus size={10} /> : isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {isZero ? '–' : `${isPos ? '+' : ''}${pct}%`}
    </div>
  )
}

export default function KPICards({ totals, period }: KPICardsProps) {
  const grand = totalTokens(totals)
  const activeUsers = USER_STATS.filter(s => totalTokens(s[period]) > 0).length
  const avgPerUser = activeUsers > 0 ? Math.round(grand / activeUsers) : 0
  const topProvider = PROVIDERS.reduce((a, b) => totals[a.id] > totals[b.id] ? a : b)
  const topProviderShare = grand > 0 ? Math.round((totals[topProvider.id] / grand) * 100) : 0

  const change = CHANGE_PCT[period]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Tokens */}
      <div className="card p-5 relative overflow-hidden group hover:border-border-bright transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-cursor/5 to-transparent pointer-events-none" />
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-cursor/10 border border-cursor/20">
            <Zap size={16} className="text-cursor-light" />
          </div>
          <TrendBadge pct={change} />
        </div>
        <p className="label mb-1">Total Tokens</p>
        <p className="text-3xl font-bold text-slate-100 font-mono leading-none">{fmtTokens(grand)}</p>
        <p className="text-xs text-slate-500 mt-1.5 font-mono">{fmtTokensFull(grand)}</p>
      </div>

      {/* Active Users */}
      <div className="card p-5 relative overflow-hidden hover:border-border-bright transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-gemini/5 to-transparent pointer-events-none" />
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-gemini/10 border border-gemini/20">
            <Users size={16} className="text-gemini-light" />
          </div>
          <div className="badge bg-gemini/10 text-gemini-light border border-gemini/20">
            of {USER_STATS.length}
          </div>
        </div>
        <p className="label mb-1">Active Users</p>
        <p className="text-3xl font-bold text-slate-100 font-mono leading-none">{activeUsers}</p>
        <p className="text-xs text-slate-500 mt-1.5">
          {Math.round((activeUsers / USER_STATS.length) * 100)}% team participation
        </p>
      </div>

      {/* Avg per User */}
      <div className="card p-5 relative overflow-hidden hover:border-border-bright transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-claude/5 to-transparent pointer-events-none" />
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-claude/10 border border-claude/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-claude-light">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 21-3.5-3.5"/>
              <path d="M19.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
            </svg>
          </div>
          <span className="text-xs text-slate-500 font-mono">avg</span>
        </div>
        <p className="label mb-1">Avg per User</p>
        <p className="text-3xl font-bold text-slate-100 font-mono leading-none">{fmtTokens(avgPerUser)}</p>
        <p className="text-xs text-slate-500 mt-1.5">{fmtTokensFull(avgPerUser)} tokens</p>
      </div>

      {/* Top Provider */}
      <div className="card p-5 relative overflow-hidden hover:border-border-bright transition-colors"
        style={{ '--glow': topProvider.color } as React.CSSProperties}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(135deg, ${topProvider.muted} 0%, transparent 60%)`,
        }} />
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg border" style={{
            backgroundColor: topProvider.muted,
            borderColor: topProvider.color + '40',
          }}>
            <Crown size={16} style={{ color: topProvider.light }} />
          </div>
          <div className="badge text-xs font-semibold px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: topProvider.muted,
              color: topProvider.light,
              borderColor: topProvider.color + '40',
            }}>
            {topProviderShare}% share
          </div>
        </div>
        <p className="label mb-1">Top Provider</p>
        <p className="text-3xl font-bold text-slate-100 font-mono leading-none">{topProvider.label}</p>
        <p className="text-xs text-slate-500 mt-1.5">{fmtTokens(totals[topProvider.id])} tokens</p>
      </div>
    </div>
  )
}
