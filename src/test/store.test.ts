// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'

// Mock localStorage for zustand persist middleware
const store: Record<string, string> = {}
global.localStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => Object.keys(store).forEach((k) => delete store[k]),
  length: 0,
  key: () => null,
}

import { useBudgetStore } from '../store/useBudgetStore'

// Reset store state before each test
beforeEach(() => {
  useBudgetStore.setState({ transactions: [], goals: [] })
})

describe('useBudgetStore — totals()', () => {
  it('returns zeros when no transactions', () => {
    const { totals } = useBudgetStore.getState()
    expect(totals()).toEqual({ income: 0, expense: 0, netWorth: 0 })
  })

  it('correctly sums income transactions', () => {
    const { addTransaction, totals } = useBudgetStore.getState()
    addTransaction({ title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2024-01-01' })
    addTransaction({ title: 'Bonus', amount: 1000, type: 'income', category: 'Salary', date: '2024-01-15' })
    expect(totals().income).toBe(6000)
    expect(totals().expense).toBe(0)
    expect(totals().netWorth).toBe(6000)
  })

  it('correctly sums expense transactions', () => {
    const { addTransaction, totals } = useBudgetStore.getState()
    addTransaction({ title: 'Rent', amount: 1500, type: 'expense', category: 'Utilities', date: '2024-01-01' })
    addTransaction({ title: 'Groceries', amount: 300, type: 'expense', category: 'Dining', date: '2024-01-05' })
    expect(totals().expense).toBe(1800)
    expect(totals().income).toBe(0)
    expect(totals().netWorth).toBe(-1800)
  })

  it('calculates net worth correctly with mixed transactions', () => {
    const { addTransaction, totals } = useBudgetStore.getState()
    addTransaction({ title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2024-01-01' })
    addTransaction({ title: 'Rent', amount: 1500, type: 'expense', category: 'Utilities', date: '2024-01-01' })
    expect(totals().netWorth).toBe(3500)
  })
})

describe('useBudgetStore — addTransaction()', () => {
  it('adds a transaction with auto-generated id and createdAt', () => {
    const { addTransaction } = useBudgetStore.getState()
    addTransaction({ title: 'Test', amount: 100, type: 'income', category: 'Other', date: '2024-01-01' })
    const txns = useBudgetStore.getState().transactions
    expect(txns).toHaveLength(1)
    expect(txns[0].id).toBeDefined()
    expect(txns[0].createdAt).toBeDefined()
    expect(txns[0].title).toBe('Test')
    expect(txns[0].amount).toBe(100)
  })

  it('inserts newest transactions at the front', () => {
    const { addTransaction } = useBudgetStore.getState()
    addTransaction({ title: 'First', amount: 100, type: 'income', category: 'Other', date: '2024-01-01' })
    addTransaction({ title: 'Second', amount: 200, type: 'income', category: 'Other', date: '2024-01-02' })
    const txns = useBudgetStore.getState().transactions
    expect(txns[0].title).toBe('Second')
  })
})

describe('useBudgetStore — deleteTransaction()', () => {
  it('removes a transaction by id', () => {
    const { addTransaction, deleteTransaction } = useBudgetStore.getState()
    addTransaction({ title: 'Test', amount: 100, type: 'income', category: 'Other', date: '2024-01-01' })
    const id = useBudgetStore.getState().transactions[0].id
    deleteTransaction(id)
    expect(useBudgetStore.getState().transactions).toHaveLength(0)
  })
})

describe('useBudgetStore — insight()', () => {
  it('returns null with no expenses', () => {
    expect(useBudgetStore.getState().insight()).toBeNull()
  })

  it('returns the top expense category', () => {
    const { addTransaction } = useBudgetStore.getState()
    addTransaction({ title: 'Rent', amount: 1500, type: 'expense', category: 'Utilities', date: '2024-01-01' })
    addTransaction({ title: 'Food', amount: 300, type: 'expense', category: 'Dining', date: '2024-01-05' })
    const insight = useBudgetStore.getState().insight()
    expect(insight?.topCategory).toBe('Utilities')
    expect(insight?.share).toBe(83) // 1500/1800 = 83%
  })
})

describe('useBudgetStore — goals', () => {
  it('can add a new goal', () => {
    const { addGoal } = useBudgetStore.getState()
    addGoal({ title: 'Vacation', target: 5000, saved: 1000 })
    const goals = useBudgetStore.getState().goals
    const newGoal = goals.find((g) => g.title === 'Vacation')
    expect(newGoal).toBeDefined()
    expect(newGoal?.target).toBe(5000)
    expect(newGoal?.id).toBeDefined()
  })

  it('can update goal saved amount', () => {
    const { addGoal, updateGoalSaved } = useBudgetStore.getState()
    addGoal({ title: 'House', target: 50000, saved: 10000 })
    const id = useBudgetStore.getState().goals.find((g) => g.title === 'House')!.id
    updateGoalSaved(id, 15000)
    const updated = useBudgetStore.getState().goals.find((g) => g.id === id)
    expect(updated?.saved).toBe(15000)
  })
})
