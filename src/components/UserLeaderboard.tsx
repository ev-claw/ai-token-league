import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react'
import clsx from 'clsx'
import { USER_STATS, PROVIDERS, fmtTokens, totalTokens, UserStats } from '../data/mockData'
import type { Period } from './PeriodSelector'

type SortKey = 'total' | 'cursor' | 'gemini' | 'claude' | 'openai' | 'name'

interface Props {
  period: Period
}

const DEPT_COLORS: Record<string, string> = {
  'Platform Eng':  '#7c3aed',
  'AI/ML':         '#1d7cde',
  'Product':       '#f97316',
  'Backend Eng':   '#10b981',
  'Frontend Eng':  '#ec4899',
  'Data':          '#06b6d4',
  'DevOps':        '#f59e0b',
  'Security':      '#6366f1',
}

function SortIcon({ field, current, dir }: { field: SortKey; current: SortKey; dir: 'asc' | 'desc' }) {
  if (field !== current) return <ArrowUpDown size={12} className="text-slate-600" />
  return dir === 'asc' ? <ArrowUp size={12} className="text-cursor-light" /> : <ArrowDown size={12} className="text-cursor-light" />
}

function UsageBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-surface-500">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-10 text-right flex-shrink-0">
        {fmtTokens(value)}
      </span>
    </div>
  )
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function UserLeaderboard({ period }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('total')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(0)
  }

  const sorted = [...USER_STATS]
    .filter(s => s.user.name.toLowerCase().includes(search.toLowerCase()) ||
                 s.user.department.toLowerCase().includes(search.toLowerCase()) ||
                 s.user.role.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av: number | string, bv: number | string
      if (sortKey === 'name') { av = a.user.name; bv = b.user.name }
      else if (sortKey === 'total') { av = totalTokens(a[period]); bv = totalTokens(b[period]) }
      else { av = a[period][sortKey]; bv = b[period][sortKey] }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  // Max values for bar scaling
  const maxTotal = Math.max(...sorted.map(s => totalTokens(s[period])))
  const maxPerProvider: Record<string, number> = {}
  for (const p of PROVIDERS) {
    maxPerProvider[p.id] = Math.max(...sorted.map(s => s[period][p.id]))
  }

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Full rank before filtering for medals
  const fullRanked = [...USER_STATS].sort((a, b) => totalTokens(b[period]) - totalTokens(a[period]))
  const rankMap = new Map(fullRanked.map((s, i) => [s.user.id, i]))

  function ColHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <th
        className="px-4 py-3 text-left cursor-pointer select-none group"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1.5 label group-hover:text-slate-400 transition-colors">
          {label}
          <SortIcon field={field} current={sortKey} dir={sortDir} />
        </div>
      </th>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">User Leaderboard</h3>
          <p className="text-xs text-slate-500 mt-0.5">{sorted.length} users · sorted by {sortKey}</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="pl-8 pr-4 py-2 text-sm bg-surface-600 border border-border rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-border-bright w-52"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-800/60">
              <th className="px-4 py-3 text-left label w-12">#</th>
              <ColHeader label="User" field="name" />
              {PROVIDERS.map(p => (
                <ColHeader key={p.id} label={p.label} field={p.id as SortKey} />
              ))}
              <ColHeader label="Total" field="total" />
            </tr>
          </thead>
          <tbody>
            {paged.map((s, rowIdx) => {
              const rank = rankMap.get(s.user.id)!
              const total = totalTokens(s[period])
              const isTop3 = rank < 3

              return (
                <tr
                  key={s.user.id}
                  className={clsx(
                    'border-b border-border/50 transition-colors hover:bg-surface-600/40',
                    isTop3 && 'bg-surface-700/30',
                  )}
                >
                  {/* Rank */}
                  <td className="px-4 py-3 w-12">
                    {rank < 3 ? (
                      <span className="text-base">{MEDALS[rank]}</span>
                    ) : (
                      <span className="text-xs font-mono text-slate-600">{rank + 1}</span>
                    )}
                  </td>

                  {/* User */}
                  <td className="px-4 py-3 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: s.user.avatarColor }}
                      >
                        {s.user.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 leading-none truncate">
                          {s.user.name}
                        </p>
                        <p className="text-xs text-slate-500 leading-none mt-0.5 truncate">
                          {s.user.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1.5 ml-11">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (DEPT_COLORS[s.user.department] || '#64748b') + '20',
                          color: DEPT_COLORS[s.user.department] || '#94a3b8',
                        }}
                      >
                        {s.user.department}
                      </span>
                    </div>
                  </td>

                  {/* Per-provider bars */}
                  {PROVIDERS.map(p => (
                    <td key={p.id} className="px-4 py-3 min-w-[140px]">
                      <UsageBar value={s[period][p.id]} max={maxPerProvider[p.id]} color={p.color} />
                    </td>
                  ))}

                  {/* Total */}
                  <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-500">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-cursor via-gemini to-claude"
                          style={{ width: `${(total / maxTotal) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-200 w-12 text-right flex-shrink-0">
                        {fmtTokens(total)}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-800/40">
          <span className="text-xs text-slate-500">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={clsx(
                  'w-7 h-7 rounded text-xs font-medium transition-colors',
                  i === page
                    ? 'bg-cursor text-white'
                    : 'text-slate-400 hover:bg-surface-500',
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
