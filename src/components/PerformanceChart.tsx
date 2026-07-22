import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useBudgetStore } from '../store/useBudgetStore'
import { getMonthKey } from '../lib/formatters'
import type { TimeRange, PerformanceDataPoint } from '../types'

const RANGES: TimeRange[] = ['1M', '3M', '6M', 'ALL']

export default function PerformanceChart() {
  const transactions = useBudgetStore((s) => s.transactions)
  const [range, setRange] = useState<TimeRange>('ALL')

  const data = useMemo((): PerformanceDataPoint[] => {
    const byMonth: Record<string, number> = {}
    const sorted = [...transactions].sort((a, b) =>
      (a.date || '').localeCompare(b.date || '')
    )
    let running = 0
    sorted.forEach((t) => {
      const month = getMonthKey(t.date)
      running += t.type === 'income' ? t.amount : -t.amount
      byMonth[month] = running
    })
    let points: PerformanceDataPoint[] = Object.entries(byMonth).map(([month, value]) => ({
      month,
      value,
    }))

    if (range !== 'ALL') {
      const n: Record<string, number> = { '1M': 1, '3M': 3, '6M': 6 }
      points = points.slice(-n[range])
    }
    return points
  }, [transactions, range])

  return (
    <div className="glass panel" role="region" aria-label="Performance chart">
      <div className="panel-head">
        <h2>Performance Overview</h2>
        <div className="range-toggle" role="group" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r}
              id={`range-${r}`}
              className={range === r ? 'active' : ''}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">Add a few transactions to see your trend line.</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="glowFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00f5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#96a3c4', fontFamily: 'Inter' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#96a3c4', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#171f33',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: '#dae2fd' }}
              formatter={(v: number) => [`₹${v.toFixed(2)}`, 'Net Worth']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00f5ff"
              strokeWidth={3}
              fill="url(#glowFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
