import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Transaction, Goal, Totals, SpendingInsight } from '../types'
import { DEFAULT_GOALS } from '../lib/constants'
import { supabase } from '../lib/supabase'

// ─── State Shape ──────────────────────────────────────────────────────────────

interface BudgetState {
  transactions: Transaction[]
  goals: Goal[]
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

interface BudgetActions {
  initialize: () => Promise<void>
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  updateGoalSaved: (id: string, saved: number) => Promise<void>
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

// ─── Derived / Computed ───────────────────────────────────────────────────────

interface BudgetComputed {
  totals: () => Totals
  insight: () => SpendingInsight | null
}

type BudgetStore = BudgetState & BudgetActions & BudgetComputed

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBudgetStore = create<BudgetStore>()(
  immer((set, get) => ({
    // ── Initial State ────────────────────────────────────────────────────
    transactions: [],
    goals: DEFAULT_GOALS,
    isLoading: false,
    isInitialized: false,
    error: null,

    // ── Actions ──────────────────────────────────────────────────────────
    initialize: async () => {
      if (get().isInitialized) return
      set({ isLoading: true, error: null })
      try {
        const fetchPromise = Promise.all([
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('goals').select('*').order('created_at', { ascending: true }),
        ])

        // Add a 5 second timeout to prevent infinite hanging if URL is invalid/unreachable
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout. Please check your Supabase URL.')), 5000)
        )

        const [txRes, goalsRes] = await Promise.race([fetchPromise, timeoutPromise]) as any

        if (txRes.error) throw txRes.error
        if (goalsRes.error) throw goalsRes.error

        set((state) => {
          // @ts-ignore mapping supabase types to local types
          state.transactions = (txRes.data || []).map((t: any) => ({
            id: t.id,
            title: t.title,
            amount: Number(t.amount),
            type: t.type as 'income' | 'expense',
            category: t.category,
            date: t.date,
            createdAt: t.created_at,
          }))

          if (goalsRes.data && goalsRes.data.length > 0) {
            state.goals = goalsRes.data.map((g: any) => ({
              id: g.id,
              title: g.title,
              target: Number(g.target),
              saved: Number(g.saved),
            }))
          }
          state.isInitialized = true
        })
      } catch (err: any) {
        console.error('Failed to initialize Supabase data:', err)
        set({ error: err.message || 'Failed to connect to backend' })
        // Fallback to empty/default state on failure
        set({ isInitialized: true })
      } finally {
        set({ isLoading: false })
      }
    },

    addTransaction: async (data) => {
      // Optimistic update
      const tempId = crypto.randomUUID()
      const newTx: Transaction = {
        ...data,
        id: tempId,
        createdAt: new Date().toISOString(),
      }
      set((state) => {
        state.transactions.unshift(newTx)
      })

      try {
        const { data: inserted, error } = await supabase
          .from('transactions')
          .insert({
            title: data.title,
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: data.date,
          })
          .select()
          .single()

        if (error) throw error

        // Update with real ID
        set((state) => {
          const index = state.transactions.findIndex(t => t.id === tempId)
          if (index !== -1) {
            state.transactions[index].id = inserted.id
            state.transactions[index].createdAt = inserted.created_at
          }
        })
      } catch (error) {
        console.error('Failed to add transaction:', error)
        // Rollback on failure
        set((state) => {
          state.transactions = state.transactions.filter(t => t.id !== tempId)
        })
      }
    },

    deleteTransaction: async (id) => {
      // Find for rollback
      const prev = get().transactions.find(t => t.id === id)
      // Optimistic update
      set((state) => {
        state.transactions = state.transactions.filter((t) => t.id !== id)
      })

      try {
        const { error } = await supabase.from('transactions').delete().eq('id', id)
        if (error) throw error
      } catch (error) {
        console.error('Failed to delete transaction:', error)
        // Rollback on failure
        if (prev) {
          set((state) => {
            state.transactions.unshift(prev)
          })
        }
      }
    },

    updateGoalSaved: async (id, saved) => {
      const prev = get().goals.find(g => g.id === id)?.saved
      set((state) => {
        const goal = state.goals.find((g) => g.id === id)
        if (goal) goal.saved = saved
      })

      try {
        const { error } = await supabase.from('goals').update({ saved }).eq('id', id)
        if (error) throw error
      } catch (error) {
        console.error('Failed to update goal:', error)
        if (prev !== undefined) {
          set((state) => {
            const goal = state.goals.find((g) => g.id === id)
            if (goal) goal.saved = prev
          })
        }
      }
    },

    addGoal: async (goalData) => {
      const tempId = crypto.randomUUID()
      const newGoal: Goal = {
        ...goalData,
        id: tempId,
      }
      set((state) => {
        state.goals.push(newGoal)
      })

      try {
        const { data: inserted, error } = await supabase
          .from('goals')
          .insert({
            title: goalData.title,
            target: goalData.target,
            saved: goalData.saved,
          })
          .select()
          .single()

        if (error) throw error

        set((state) => {
          const goal = state.goals.find(g => g.id === tempId)
          if (goal) goal.id = inserted.id
        })
      } catch (error) {
        console.error('Failed to add goal:', error)
        set((state) => {
          state.goals = state.goals.filter(g => g.id !== tempId)
        })
      }
    },

    deleteGoal: async (id) => {
      const prev = get().goals.find(g => g.id === id)
      set((state) => {
        state.goals = state.goals.filter((g) => g.id !== id)
      })

      try {
        const { error } = await supabase.from('goals').delete().eq('id', id)
        if (error) throw error
      } catch (error) {
        console.error('Failed to delete goal:', error)
        if (prev) {
          set((state) => {
            state.goals.push(prev)
          })
        }
      }
    },

    clearAll: async () => {
      const prevTxs = get().transactions
      const prevGoals = get().goals
      set((state) => {
        state.transactions = []
        state.goals = DEFAULT_GOALS
      })

      try {
        // Delete all transactions and goals
        await Promise.all([
          supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000'), // Delete all
          supabase.from('goals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        ])
        
        // Re-insert default goals
        await supabase.from('goals').insert(DEFAULT_GOALS.map(g => ({
          title: g.title,
          target: g.target,
          saved: g.saved
        })))
      } catch (error) {
        console.error('Failed to clear all:', error)
        set((state) => {
          state.transactions = prevTxs
          state.goals = prevGoals
        })
      }
    },

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
  }))
)
