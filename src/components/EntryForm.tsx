import { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import { CATEGORIES } from '../lib/constants'
import type { TransactionType } from '../types'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export default function EntryForm() {
  const addTransaction = useBudgetStore((s) => s.addTransaction)
  const [type, setType] = useState<TransactionType>('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [date, setDate] = useState(todayISO())
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (!title.trim() || isNaN(parsed) || parsed <= 0) return

    addTransaction({
      title: title.trim(),
      amount: parsed,
      type,
      category,
      date,
    })

    // Reset form
    setTitle('')
    setAmount('')
    setCategory(CATEGORIES[0])
    setDate(todayISO())
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <div className="glass panel">
      <div className="panel-head">
        <h2>New Entry</h2>
      </div>
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div className="form-field full">
          <label>Type</label>
          <div className="type-toggle" role="group" aria-label="Transaction type">
            <button
              type="button"
              id="type-expense"
              className={type === 'expense' ? 'active expense' : ''}
              onClick={() => setType('expense')}
              aria-pressed={type === 'expense'}
            >
              Expense
            </button>
            <button
              type="button"
              id="type-income"
              className={type === 'income' ? 'active income' : ''}
              onClick={() => setType('income')}
              aria-pressed={type === 'income'}
            >
              Income
            </button>
          </div>
        </div>

        <div className="form-field full">
          <label htmlFor="entry-title">Title</label>
          <input
            id="entry-title"
            type="text"
            placeholder="e.g. Client payment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="form-field">
          <label htmlFor="entry-amount">Amount ($)</label>
          <input
            id="entry-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="entry-date">Date</label>
          <input
            id="entry-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-field full">
          <label htmlFor="entry-category">Category</label>
          <select
            id="entry-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" id="entry-submit" className={`submit-btn${submitted ? ' success' : ''}`}>
          {submitted ? '✓ Entry added!' : 'Add entry'}
        </button>
      </form>
    </div>
  )
}
