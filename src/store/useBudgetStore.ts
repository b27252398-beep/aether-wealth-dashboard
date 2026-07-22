import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Transaction, Goal, Totals, SpendingInsight } from '../types'
import { DEFAULT_GOALS, STORAGE_KEYS } from '../lib/constants'

// ─── State Shape ──────────────────────────────────────────────────────────────

interface BudgetState {
  transactions: Transaction[]
  goals: Goal[]
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

interface BudgetActions {
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void
  deleteTransaction: (id: string) => void
  updateGoalSaved: (id: string, saved: number) => void
  addGoal: (goal: Omit<Goal, 'id'>) => void
  deleteGoal: (id: string) => void
  clearAll: () => void
}

// ─── Derived / Computed ───────────────────────────────────────────────────────

interface BudgetComputed {
  totals: () => Totals
  insight: () => SpendingInsight | null
}

type BudgetStore = BudgetState & BudgetActions & BudgetComputed

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBudgetStore = create<BudgetStore>()(
  persist(
    immer((set, get) => ({
      // ── Initial State ────────────────────────────────────────────────────
      transactions: [],
      goals: DEFAULT_GOALS,

      // ── Actions ──────────────────────────────────────────────────────────
      addTransaction: (data) =>
        set((state) => {
          state.transactions.unshift({
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          })
        }),

      deleteTransaction: (id) =>
        set((state) => {
          state.transactions = state.transactions.filter((t) => t.id !== id)
        }),

      updateGoalSaved: (id, saved) =>
        set((state) => {
          const goal = state.goals.find((g) => g.id === id)
          if (goal) goal.saved = saved
        }),

      addGoal: (goal) =>
        set((state) => {
          state.goals.push({ ...goal, id: crypto.randomUUID() })
        }),

      deleteGoal: (id) =>
        set((state) => {
          state.goals = state.goals.filter((g) => g.id !== id)
        }),

      clearAll: () =>
        set((state) => {
          state.transactions = []
          state.goals = DEFAULT_GOALS
        }),

      // ── Computed (derived) ────────────────────────────────────────────────
      totals: () => {
        const { transactions } = get()
        return transactions.reduce(
          (acc, t) => {
            if (t.type === 'income') acc.income += t.amount
            else acc.expense += t.amount
            acc.netWorth = acc.income - acc.expense
            return acc
          },
          { income: 0, expense: 0, netWorth: 0 } as Totals
        )
      },

      insight: () => {
        const { transactions } = get()
        const { expense: totalExpense } = get().totals()
        const byCategory: Record<string, number> = {}
        transactions
          .filter((t) => t.type === 'expense')
          .forEach((t) => {
            byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount
          })
        const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
        if (entries.length === 0) return null
        const [topCategory, topAmount] = entries[0]
        const share = totalExpense > 0 ? Math.round((topAmount / totalExpense) * 100) : 0
        return { topCategory, share }
      },
    })),
    {
      name: STORAGE_KEYS.TRANSACTIONS,
      // Persist only raw data, not computed functions
      partialize: (state) => ({
        transactions: state.transactions,
        goals: state.goals,
      }),
    }
  )
)
