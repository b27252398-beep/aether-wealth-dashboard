import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import EntryForm from '../components/EntryForm'
import TransactionList from '../components/TransactionList'
import { useBudgetStore } from '../store/useBudgetStore'

export default function TransactionsPage() {
  const transactions = useBudgetStore((s) => s.transactions)

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {categoryData.length > 0 && (
        <section className="panel glass">
          <header className="panel-head">
            <h2>Spending by Category</h2>
          </header>
          <div style={{ height: '200px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: 'var(--surface-container-highest)', border: '1px solid var(--outline)', borderRadius: '8px', color: 'var(--on-surface)' }}
                  itemStyle={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" fill="var(--neon-cyan)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <div className="two-col">
        <EntryForm />
        <TransactionList />
      </div>
    </div>
  )
}
