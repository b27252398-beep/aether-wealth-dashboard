// ─── Core Domain Types ─────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string // ISO date string YYYY-MM-DD
  createdAt: string // ISO datetime
}

export interface Goal {
  id: string
  title: string
  target: number
  saved: number
}

export interface Totals {
  income: number
  expense: number
  netWorth: number
}

export interface SpendingInsight {
  topCategory: string
  share: number
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface TransactionFormData {
  title: string
  amount: string
  type: TransactionType
  category: string
  date: string
}

// ─── Chart Data Types ────────────────────────────────────────────────────────

export interface PerformanceDataPoint {
  month: string
  value: number
}

export interface AllocationDataPoint {
  name: string
  value: number
}

// ─── UI Types ────────────────────────────────────────────────────────────────

export type TimeRange = '1M' | '3M' | '6M' | 'ALL'

export interface NavItem {
  key: string
  label: string
  icon: string
  path: string
}
