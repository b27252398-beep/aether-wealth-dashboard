import { useBudgetStore } from '../store/useBudgetStore'
import { useShallow } from 'zustand/react/shallow'
import NetWorthCrystal from './NetWorthCrystal'
import { formatCurrency } from '../lib/formatters'

export default function HeroNetWorth() {
  const totals = useBudgetStore(useShallow((s) => s.totals()))
  const isUp = totals.netWorth >= 0
  const retentionPct =
    totals.income > 0 ? Math.round((totals.netWorth / totals.income) * 100) : 0

  return (
    <div className="hero-grid">
      <div className="glass hero-card">
        <div>
          <div className="label-caps">Total Net Worth</div>
          <div
            className="balance-xl"
            aria-label={`Net worth: ${formatCurrency(totals.netWorth)} dollars`}
          >
            ${formatCurrency(totals.netWorth)}
          </div>
          <div className={`pill ${isUp ? 'up' : 'down'}`} aria-live="polite">
            {isUp ? '↗' : '↘'} {Math.abs(retentionPct)}% of income retained
          </div>
        </div>
        <NetWorthCrystal />
      </div>

      <div className="mini-stat-stack">
        <div className="glass mini-stat">
          <div className="mini-icon cyan" aria-hidden="true">↑</div>
          <div>
            <div className="label">Total Income</div>
            <div className="value" aria-label={`Total income: ${formatCurrency(totals.income)} dollars`}>
              ${formatCurrency(totals.income)}
            </div>
          </div>
        </div>
        <div className="glass mini-stat">
          <div className="mini-icon violet" aria-hidden="true">↓</div>
          <div>
            <div className="label">Total Expenses</div>
            <div className="value" aria-label={`Total expenses: ${formatCurrency(totals.expense)} dollars`}>
              ${formatCurrency(totals.expense)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
