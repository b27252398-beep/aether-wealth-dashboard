import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useBudgetStore } from '../store/useBudgetStore'
import { CHART_COLORS } from '../lib/constants'
import type { AllocationDataPoint } from '../types'

export default function AllocationChart() {
  const transactions = useBudgetStore((s) => s.transactions)
  const insight = useBudgetStore((s) => s.insight())

  const data = useMemo((): AllocationDataPoint[] => {
    const map: Record<string, number> = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount
      })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [transactions])

  return (
    <div className="glass panel" style={{ height: '100%' }} role="region" aria-label="Spending allocation">
      <div className="panel-head">
        <h2>Spending Allocation</h2>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">No expenses logged yet.</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#171f33',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {data.map((d, i) => (
              <span
                key={d.name}
                className="cat-tag"
                style={{ borderColor: CHART_COLORS[i % CHART_COLORS.length] }}
              >
                ● {d.name}
              </span>
            ))}
          </div>

          {insight && (
            <div className="insight-box" role="status" aria-live="polite">
              <strong>{insight.topCategory}</strong> is your largest expense category, making up{' '}
              <strong>{insight.share}%</strong> of total spending.
            </div>
          )}
        </>
      )}
    </div>
  )
}
