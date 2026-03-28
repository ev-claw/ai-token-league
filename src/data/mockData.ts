// Mock data generator for AI Token League dashboard
// All data is seeded deterministically for consistent rendering

export type Provider = 'cursor' | 'gemini' | 'claude' | 'openai'

export interface ProviderUsage {
  cursor: number
  gemini: number
  claude: number
  openai: number
}

export interface DailyUsage {
  date: string // YYYY-MM-DD
  usage: ProviderUsage
}

export interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
  initials: string
  avatarColor: string
  // Bias toward certain providers based on role
  bias: ProviderUsage
}

export interface UserStats {
  user: User
  today: ProviderUsage
  last7d: ProviderUsage
  mtd: ProviderUsage
  ytd: ProviderUsage
  daily: DailyUsage[]
}

// ─── Seed-based pseudo-random ──────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Static user roster ────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#7c3aed', '#1d7cde', '#f97316', '#10b981',
  '#ec4899', '#06b6d4', '#f59e0b', '#8b5cf6',
  '#14b8a6', '#f43f5e', '#6366f1', '#22d3ee',
]

const RAW_USERS = [
  { name: 'Priya Kapoor',      email: 'p.kapoor@acme.io',      department: 'Platform Eng',    role: 'Staff Engineer',         bias: { cursor: 0.50, gemini: 0.20, claude: 0.20, openai: 0.10 } },
  { name: 'Marcus Webb',       email: 'm.webb@acme.io',        department: 'AI/ML',           role: 'ML Engineer',            bias: { cursor: 0.15, gemini: 0.45, claude: 0.25, openai: 0.15 } },
  { name: 'Sofia Nakamura',    email: 's.nakamura@acme.io',    department: 'Product',         role: 'Senior PM',              bias: { cursor: 0.10, gemini: 0.20, claude: 0.55, openai: 0.15 } },
  { name: 'Declan O\'Brien',   email: 'd.obrien@acme.io',      department: 'Backend Eng',     role: 'Principal Engineer',     bias: { cursor: 0.55, gemini: 0.15, claude: 0.20, openai: 0.10 } },
  { name: 'Yuki Tanaka',       email: 'y.tanaka@acme.io',      department: 'Frontend Eng',    role: 'Senior Engineer',        bias: { cursor: 0.60, gemini: 0.10, claude: 0.20, openai: 0.10 } },
  { name: 'Amara Osei',        email: 'a.osei@acme.io',        department: 'Data',            role: 'Data Scientist',         bias: { cursor: 0.10, gemini: 0.50, claude: 0.25, openai: 0.15 } },
  { name: 'Liam Kowalski',     email: 'l.kowalski@acme.io',    department: 'DevOps',          role: 'SRE Lead',               bias: { cursor: 0.40, gemini: 0.20, claude: 0.30, openai: 0.10 } },
  { name: 'Camille Dubois',    email: 'c.dubois@acme.io',      department: 'Security',        role: 'Security Engineer',      bias: { cursor: 0.20, gemini: 0.30, claude: 0.35, openai: 0.15 } },
  { name: 'Raj Patel',         email: 'r.patel@acme.io',       department: 'Platform Eng',    role: 'Engineering Manager',    bias: { cursor: 0.25, gemini: 0.25, claude: 0.35, openai: 0.15 } },
  { name: 'Elena Marchetti',   email: 'e.marchetti@acme.io',   department: 'AI/ML',           role: 'Research Engineer',      bias: { cursor: 0.10, gemini: 0.40, claude: 0.30, openai: 0.20 } },
  { name: 'James Okafor',      email: 'j.okafor@acme.io',      department: 'Backend Eng',     role: 'Senior Engineer',        bias: { cursor: 0.45, gemini: 0.15, claude: 0.25, openai: 0.15 } },
  { name: 'Nadia Volkov',      email: 'n.volkov@acme.io',      department: 'Frontend Eng',    role: 'Staff Engineer',         bias: { cursor: 0.55, gemini: 0.15, claude: 0.20, openai: 0.10 } },
  { name: 'Chen Wei',          email: 'c.wei@acme.io',         department: 'Data',            role: 'Analytics Lead',         bias: { cursor: 0.15, gemini: 0.45, claude: 0.25, openai: 0.15 } },
  { name: 'Tobias Müller',     email: 't.muller@acme.io',      department: 'Platform Eng',    role: 'Senior Engineer',        bias: { cursor: 0.50, gemini: 0.20, claude: 0.20, openai: 0.10 } },
  { name: 'Adeola Adeyemi',    email: 'a.adeyemi@acme.io',     department: 'Product',         role: 'Product Designer',       bias: { cursor: 0.10, gemini: 0.20, claude: 0.60, openai: 0.10 } },
  { name: 'Ivan Petrov',       email: 'i.petrov@acme.io',      department: 'AI/ML',           role: 'ML Engineer',            bias: { cursor: 0.15, gemini: 0.40, claude: 0.25, openai: 0.20 } },
  { name: 'Mei-Ling Zhang',    email: 'm.zhang@acme.io',       department: 'Backend Eng',     role: 'Senior Engineer',        bias: { cursor: 0.45, gemini: 0.20, claude: 0.25, openai: 0.10 } },
  { name: 'Oliver Santos',     email: 'o.santos@acme.io',      department: 'DevOps',          role: 'Platform Engineer',      bias: { cursor: 0.35, gemini: 0.25, claude: 0.25, openai: 0.15 } },
  { name: 'Fatima Al-Rashidi', email: 'f.alrashidi@acme.io',   department: 'Security',        role: 'Lead Security Eng',      bias: { cursor: 0.20, gemini: 0.30, claude: 0.35, openai: 0.15 } },
  { name: 'Aaron Kim',         email: 'a.kim@acme.io',         department: 'Frontend Eng',    role: 'Principal Engineer',     bias: { cursor: 0.55, gemini: 0.15, claude: 0.20, openai: 0.10 } },
  { name: 'Riya Sharma',       email: 'r.sharma@acme.io',      department: 'Data',            role: 'Senior Data Scientist',  bias: { cursor: 0.10, gemini: 0.50, claude: 0.25, openai: 0.15 } },
  { name: 'Brendan Cole',      email: 'b.cole@acme.io',        department: 'Platform Eng',    role: 'Engineering Manager',    bias: { cursor: 0.30, gemini: 0.25, claude: 0.30, openai: 0.15 } },
  { name: 'Yara Hassan',       email: 'y.hassan@acme.io',      department: 'AI/ML',           role: 'AI Researcher',          bias: { cursor: 0.10, gemini: 0.35, claude: 0.30, openai: 0.25 } },
  { name: 'Pedro Alves',       email: 'p.alves@acme.io',       department: 'Backend Eng',     role: 'Staff Engineer',         bias: { cursor: 0.50, gemini: 0.15, claude: 0.25, openai: 0.10 } },
  { name: 'Simone Leclair',    email: 's.leclair@acme.io',     department: 'Product',         role: 'Senior PM',              bias: { cursor: 0.10, gemini: 0.20, claude: 0.55, openai: 0.15 } },
]

function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

// ─── Date helpers ──────────────────────────────────────────────────────────
const TODAY = new Date('2026-03-29')

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function daysSince(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

const START_OF_YEAR = new Date('2026-01-01')
const START_OF_MONTH = new Date('2026-03-01')
const DAYS_YTD = daysSince(START_OF_YEAR, TODAY) + 1
const DATE_LIST: string[] = []
for (let i = 0; i < DAYS_YTD; i++) {
  DATE_LIST.push(dateStr(addDays(START_OF_YEAR, i)))
}

// ─── Usage generation ──────────────────────────────────────────────────────
// Base daily tokens per provider per user (high-activity users get more)
const BASE_DAILY: Record<Provider, number> = {
  cursor: 32000,
  gemini: 28000,
  claude: 24000,
  openai: 18000,
}

function isWeekend(d: string): boolean {
  const day = new Date(d + 'T12:00:00Z').getUTCDay()
  return day === 0 || day === 6
}

function generateUserDailyData(
  user: User,
  rng: () => number,
): DailyUsage[] {
  // Each user has a personal scale factor (0.4 – 2.2)
  const scale = 0.4 + rng() * 1.8

  return DATE_LIST.map(date => {
    const weekend = isWeekend(date)
    const weekendFactor = weekend ? 0.05 + rng() * 0.1 : 1.0
    // Gradual ramp-up through the year
    const dateIdx = DATE_LIST.indexOf(date)
    const rampFactor = 0.7 + 0.3 * (dateIdx / DATE_LIST.length)

    const usage: ProviderUsage = { cursor: 0, gemini: 0, claude: 0, openai: 0 }
    const providers: Provider[] = ['cursor', 'gemini', 'claude', 'openai']
    for (const p of providers) {
      const base = BASE_DAILY[p] * user.bias[p] * scale * weekendFactor * rampFactor
      // Add ±30% noise
      const noise = 0.7 + rng() * 0.6
      usage[p] = Math.round(base * noise)
    }
    return { date, usage }
  })
}

// ─── Aggregate helpers ─────────────────────────────────────────────────────
function sumUsage(dailies: DailyUsage[], fromDate: string, toDate: string): ProviderUsage {
  const total: ProviderUsage = { cursor: 0, gemini: 0, claude: 0, openai: 0 }
  for (const d of dailies) {
    if (d.date >= fromDate && d.date <= toDate) {
      total.cursor += d.usage.cursor
      total.gemini += d.usage.gemini
      total.claude += d.usage.claude
      total.openai += d.usage.openai
    }
  }
  return total
}

function totalTokens(u: ProviderUsage): number {
  return u.cursor + u.gemini + u.claude + u.openai
}

// ─── Build full dataset ────────────────────────────────────────────────────
export const PROVIDERS: { id: Provider; label: string; color: string; light: string; muted: string }[] = [
  { id: 'cursor', label: 'Cursor',  color: '#7c3aed', light: '#a78bfa', muted: 'rgba(124,58,237,0.15)' },
  { id: 'gemini', label: 'Gemini',  color: '#1d7cde', light: '#60a5fa', muted: 'rgba(29,124,222,0.15)' },
  { id: 'claude', label: 'Claude',  color: '#f97316', light: '#fb923c', muted: 'rgba(249,115,22,0.15)' },
  { id: 'openai', label: 'OpenAI',  color: '#10b981', light: '#34d399', muted: 'rgba(16,185,129,0.15)' },
]

const todayStr = dateStr(TODAY)
const sevenDaysAgoStr = dateStr(addDays(TODAY, -6))
const mtdStr = dateStr(START_OF_MONTH)
const ytdStr = dateStr(START_OF_YEAR)

export const USER_STATS: UserStats[] = RAW_USERS.map((raw, idx) => {
  const rng = mulberry32(idx * 0x9e3779b9 + 0xdeadbeef)
  const user: User = {
    id: `user-${idx}`,
    name: raw.name,
    email: raw.email,
    department: raw.department,
    role: raw.role,
    initials: getInitials(raw.name),
    avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
    bias: raw.bias,
  }
  const daily = generateUserDailyData(user, rng)
  return {
    user,
    today: sumUsage(daily, todayStr, todayStr),
    last7d: sumUsage(daily, sevenDaysAgoStr, todayStr),
    mtd: sumUsage(daily, mtdStr, todayStr),
    ytd: sumUsage(daily, ytdStr, todayStr),
    daily,
  }
})

// ─── Team-level aggregates ─────────────────────────────────────────────────
function sumAll(stats: UserStats[], period: keyof Pick<UserStats, 'today' | 'last7d' | 'mtd' | 'ytd'>): ProviderUsage {
  const total: ProviderUsage = { cursor: 0, gemini: 0, claude: 0, openai: 0 }
  for (const s of stats) {
    total.cursor += s[period].cursor
    total.gemini += s[period].gemini
    total.claude += s[period].claude
    total.openai += s[period].openai
  }
  return total
}

export const TEAM_TOTALS = {
  today:  sumAll(USER_STATS, 'today'),
  last7d: sumAll(USER_STATS, 'last7d'),
  mtd:    sumAll(USER_STATS, 'mtd'),
  ytd:    sumAll(USER_STATS, 'ytd'),
}

// ─── Trend data for charts (last 30 days) ─────────────────────────────────
export interface TrendPoint {
  date: string
  label: string
  cursor: number
  gemini: number
  claude: number
  openai: number
  total: number
}

export const TREND_30D: TrendPoint[] = (() => {
  const points: TrendPoint[] = []
  for (let i = 29; i >= 0; i--) {
    const d = addDays(TODAY, -i)
    const ds = dateStr(d)
    const usage = USER_STATS.reduce<ProviderUsage>(
      (acc, s) => {
        const day = s.daily.find(x => x.date === ds)
        if (day) {
          acc.cursor += day.usage.cursor
          acc.gemini += day.usage.gemini
          acc.claude += day.usage.claude
          acc.openai += day.usage.openai
        }
        return acc
      },
      { cursor: 0, gemini: 0, claude: 0, openai: 0 },
    )
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    points.push({
      date: ds,
      label,
      cursor: usage.cursor,
      gemini: usage.gemini,
      claude: usage.claude,
      openai: usage.openai,
      total: usage.cursor + usage.gemini + usage.claude + usage.openai,
    })
  }
  return points
})()

// ─── Previous period comparisons ──────────────────────────────────────────
const prevTodayStr      = dateStr(addDays(TODAY, -1))
const prevSevenStart    = dateStr(addDays(TODAY, -13))
const prevSevenEnd      = dateStr(addDays(TODAY, -7))
const prevMtdStart      = new Date('2026-02-01')
const prevMtdEnd        = addDays(START_OF_MONTH, -1)
const prevYtdStart      = new Date('2025-01-01')
const prevYtdEnd        = new Date('2025-12-31')

function prevPeriodTotal(period: 'today' | 'last7d' | 'mtd' | 'ytd'): number {
  let from: string, to: string
  if (period === 'today')  { from = prevTodayStr; to = prevTodayStr }
  else if (period === 'last7d') { from = prevSevenStart; to = prevSevenEnd }
  else if (period === 'mtd') { from = dateStr(prevMtdStart); to = dateStr(prevMtdEnd) }
  else { from = dateStr(prevYtdStart); to = dateStr(prevYtdEnd) }

  return USER_STATS.reduce((sum, s) => {
    const u = sumUsage(s.daily, from, to)
    return sum + totalTokens(u)
  }, 0)
}

export const CHANGE_PCT = {
  today:  calcChange(totalTokens(TEAM_TOTALS.today),  prevPeriodTotal('today')),
  last7d: calcChange(totalTokens(TEAM_TOTALS.last7d), prevPeriodTotal('last7d')),
  mtd:    calcChange(totalTokens(TEAM_TOTALS.mtd),    prevPeriodTotal('mtd')),
  ytd:    calcChange(totalTokens(TEAM_TOTALS.ytd),    prevPeriodTotal('ytd')),
}

function calcChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

// ─── Utility exports ───────────────────────────────────────────────────────
export { totalTokens }

export function fmtTokens(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export function fmtTokensFull(n: number): string {
  return n.toLocaleString()
}
