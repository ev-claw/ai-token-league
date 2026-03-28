import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ProviderUsage, PROVIDERS, fmtTokens, totalTokens } from '../data/mockData'

interface Props {
  totals: ProviderUsage
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-surface-600 border border-border-bright rounded-xl p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.payload.color }} />
        <span className="text-sm font-semibold text-slate-200">{item.name}</span>
      </div>
      <p className="text-xs font-mono text-slate-300">{fmtTokens(item.value)}</p>
      <p className="text-xs text-slate-500">{item.payload.pct}% of total</p>
    </div>
  )
}

export default function ProviderDistribution({ totals }: Props) {
  const grand = totalTokens(totals)

  const data = PROVIDERS.map(p => ({
    name: p.label,
    value: totals[p.id],
    color: p.color,
    light: p.light,
    pct: grand > 0 ? Math.round((totals[p.id] / grand) * 100) : 0,
  }))

  return (
    <div className="card p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-200">Provider Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">Share of total token consumption</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Total</p>
            <p className="text-xl font-bold font-mono text-slate-100">{fmtTokens(grand)}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full mt-4 space-y-2.5">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-300">{d.name}</span>
                  <span className="text-xs font-mono text-slate-400">{d.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-surface-500">
                  <div
                    className="h-1 rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 w-14 text-right flex-shrink-0">
                {fmtTokens(d.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
