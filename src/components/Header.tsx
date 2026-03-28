import { Activity, ChevronDown, Bell, Settings } from 'lucide-react'

interface HeaderProps {
  lastRefreshed: string
}

export default function Header({ lastRefreshed }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-800/90 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cursor to-blue-600">
            <Activity size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 leading-none tracking-tight">
              AI Token League
            </h1>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5 font-medium tracking-wider uppercase">
              Engineering Director Dashboard
            </p>
          </div>
        </div>

        {/* Center: Org selector */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-600 cursor-pointer hover:border-border-bright transition-colors">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-200">Acme Corp — Engineering</span>
          <ChevronDown size={14} className="text-slate-500 ml-1" />
        </div>

        {/* Right: Actions + User */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-xs text-slate-500 font-mono">
            Updated {lastRefreshed}
          </span>

          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-500 transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cursor rounded-full" />
          </button>

          <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-500 transition-colors">
            <Settings size={16} />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gemini to-cursor flex items-center justify-center text-white text-xs font-bold">
              JR
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-200 leading-none">Jordan Rivera</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Engineering Director</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
