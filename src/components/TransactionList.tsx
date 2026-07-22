import { useMemo, useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import { formatCurrency, initials, exportToCSV } from '../lib/formatters'
import type { Transaction } from '../types'

export default function TransactionList() {
  const transactions = useBudgetStore((s) => s.transactions)
  const deleteTransaction = useBudgetStore((s) => s.deleteTransaction)
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return transactions
    return transactions.filter(
      (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    )
  }, [transactions, query])

  function handleDelete(id: string) {
    if (confirmId === id) {
      deleteTransaction(id)
      setConfirmId(null)
    } else {
      setConfirmId(id)
      // Auto-cancel confirm after 3 seconds
      setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 3000)
    }
  }

  function handleExport() {
    exportToCSV(
      transactions.map((t) => ({
        date: t.date,
        title: t.title,
        category: t.category,
        type: t.type,
        amount: t.amount,
      })),
      'aether-transactions'
    )
  }

  return (
    <div className="glass panel">
      <div className="panel-head">
        <h2>Transactions</h2>
        {transactions.length > 0 && (
          <button
            id="export-csv-btn"
            className="export-btn"
            onClick={handleExport}
            title="Export all transactions as CSV"
          >
            ↓ Export CSV
          </button>
        )}
      </div>

      <input
        id="transaction-search"
        className="search-input"
        type="search"
        placeholder="Search by title or category…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search transactions"
      />

      {filtered.length === 0 ? (
        <div className="empty-state" role="status">
          {transactions.length === 0
            ? 'No entries yet — add your first one above.'
            : 'No matches found.'}
        </div>
      ) : (
        <div role="list" aria-label="Transaction list">
          {filtered.map((t) => (
            <div className="tx-row" key={t.id} role="listitem">
              <div className="tx-icon" aria-hidden="true">
                {initials(t.title)}
              </div>
              <div className="tx-info">
                <div className="tx-title">{t.title}</div>
                <div className="tx-meta">
                  {t.category} · {t.date}
                </div>
              </div>
              <div className={`tx-amount ${t.type}`} aria-label={`${t.type === 'income' ? 'Income' : 'Expense'}: ${formatCurrency(t.amount)} dollars`}>
                {t.type === 'income' ? '+' : '−'}${formatCurrency(t.amount)}
              </div>
              <button
                className={`delete-btn${confirmId === t.id ? ' confirm' : ''}`}
                onClick={() => handleDelete(t.id)}
                aria-label={confirmId === t.id ? `Confirm delete ${t.title}` : `Delete ${t.title}`}
                title={confirmId === t.id ? 'Click again to confirm' : 'Delete'}
              >
                {confirmId === t.id ? '?' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="tx-count">
          Showing {filtered.length} of {transactions.length} transaction
          {transactions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
