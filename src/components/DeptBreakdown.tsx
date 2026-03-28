import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { USER_STATS, PROVIDERS, fmtTokens, totalTokens } from '../data/mockData'
import type { Period } from './PeriodSelector'

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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const total = payload[0]?.payload?.total ?? 0
  return (
    <div className="bg-surface-600 border border-border-bright rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-xs font-semibold text-slate-300 mb-2">{label}</p>
      {PROVIDERS.map(p => {
        const val = payload[0]?.payload?.[p.id] ?? 0
        return (
          <div key={p.id} className="flex justify-between gap-4 mb-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-xs text-slate-400">{p.label}</span>
            </div>
            <span className="text-xs font-mono text-slate-200">{fmtTokens(val)}</span>
          </div>
        )
      })}
      <div className="mt-2 pt-2 border-t border-border flex justify-between">
        <span className="text-xs text-slate-500">Total</span>
        <span className="text-xs font-mono font-bold text-slate-100">{fmtTokens(total)}</span>
      </div>
    </div>
  )
}

export default function DeptBreakdown({ period }: Props) {
  const deptMap: Record<string, { cursor: number; gemini: number; claude: number; openai: number; total: number }> = {}

  for (const s of USER_STATS) {
    const dept = s.user.department
    if (!deptMap[dept]) deptMap[dept] = { cursor: 0, gemini: 0, claude: 0, openai: 0, total: 0 }
    deptMap[dept].cursor += s[period].cursor
    deptMap[dept].gemini += s[period].gemini
    deptMap[dept].claude += s[period].claude
    deptMap[dept].openai += s[period].openai
    deptMap[dept].total += totalTokens(s[period])
  }

  const data = Object.entries(deptMap)
    .map(([dept, vals]) => ({ dept, ...vals }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="card p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-200">Usage by Department</h3>
        <p className="text-xs text-slate-500 mt-0.5">Aggregated token consumption per team</p>
      </div>

      <div className="space-y-3">
        {data.map(d => {
          const maxTotal = Math.max(...data.map(x => x.total))
          const pct = maxTotal > 0 ? (d.total / maxTotal) * 100 : 0
          const color = DEPT_COLORS[d.dept] || '#64748b'

          return (
            <div key={d.dept} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-medium text-slate-300">{d.dept}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{fmtTokens(d.total)}</span>
              </div>
              <div className="h-5 rounded-md bg-surface-500 overflow-hidden flex">
                {PROVIDERS.map(p => {
                  const segPct = d.total > 0 ? (d[p.id as keyof typeof d] as number / d.total) * pct : 0
                  return (
                    <div
                      key={p.id}
                      className="h-full transition-all duration-500"
                      style={{ width: `${segPct}%`, background: p.color }}
                      title={`${p.label}: ${fmtTokens(d[p.id as keyof typeof d] as number)}`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Provider legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        {PROVIDERS.map(p => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2 rounded-sm" style={{ background: p.color }} />
            <span className="text-xs text-slate-500">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
