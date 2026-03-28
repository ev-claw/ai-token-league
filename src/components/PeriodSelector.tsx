import clsx from 'clsx'

export type Period = 'today' | 'last7d' | 'mtd' | 'ytd'

const PERIODS: { id: Period; label: string; sublabel: string }[] = [
  { id: 'today',  label: 'Today',       sublabel: 'Mar 29' },
  { id: 'last7d', label: 'Last 7 Days', sublabel: 'Mar 23–29' },
  { id: 'mtd',    label: 'Month-to-Date', sublabel: 'Mar 1–29' },
  { id: 'ytd',    label: 'Year-to-Date', sublabel: 'Jan 1–Mar 29' },
]

interface PeriodSelectorProps {
  value: Period
  onChange: (p: Period) => void
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface-600 border border-border rounded-xl">
      {PERIODS.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={clsx(
            'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            value === p.id
              ? 'bg-surface-500 text-slate-100 shadow-sm border border-border-bright'
              : 'text-slate-400 hover:text-slate-200 hover:bg-surface-500/50',
          )}
        >
          <span className="block leading-none">{p.label}</span>
          <span className={clsx(
            'block text-[10px] mt-0.5 leading-none font-normal',
            value === p.id ? 'text-slate-400' : 'text-slate-600',
          )}>
            {p.sublabel}
          </span>
        </button>
      ))}
    </div>
  )
}
