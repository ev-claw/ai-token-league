import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { TREND_30D, PROVIDERS, fmtTokens } from '../data/mockData'

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0)
  return (
    <div className="bg-surface-600 border border-border-bright rounded-xl p-3 shadow-xl min-w-[180px]">
      <p className="text-xs font-semibold text-slate-300 mb-2">{label}</p>
      {[...payload].reverse().map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-slate-400 capitalize">{p.dataKey}</span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-200">{fmtTokens(p.value)}</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-border flex justify-between">
        <span className="text-xs text-slate-500">Total</span>
        <span className="text-xs font-mono font-bold text-slate-100">{fmtTokens(total)}</span>
      </div>
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center justify-center gap-5 pt-2">
      {payload?.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm" style={{ background: entry.color }} />
          <span className="text-xs font-medium text-slate-400 capitalize">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TrendChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Token Consumption Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily usage across all providers · last 30 days</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-600 border border-border">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-slate-400">Live</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={TREND_30D}
          margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
        >
          <defs>
            {PROVIDERS.map(p => (
              <linearGradient key={p.id} id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={p.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={p.color} stopOpacity={0.03} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,82,0.6)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tickFormatter={fmtTokens}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(100,116,139,0.3)', strokeWidth: 1 }} />
          <Legend content={<CustomLegend />} />
          {PROVIDERS.map(p => (
            <Area
              key={p.id}
              type="monotone"
              dataKey={p.id}
              stackId="1"
              stroke={p.color}
              strokeWidth={1.5}
              fill={`url(#grad-${p.id})`}
              fillOpacity={1}
              dot={false}
              activeDot={{ r: 4, fill: p.color, stroke: '#0a0f24', strokeWidth: 2 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
