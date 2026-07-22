import type { NavItem } from '../types'

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '◆', path: '/' },
  { key: 'portfolio', label: 'Portfolio', icon: '◈', path: '/portfolio' },
  { key: 'goals', label: 'Goals', icon: '◇', path: '/goals' },
  { key: 'transactions', label: 'Transactions', icon: '☰', path: '/transactions' },
]

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'Salary',
  'Equities',
  'Crypto',
  'Real Estate',
  'Dining',
  'Transport',
  'Utilities',
  'Luxury',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

// ─── Chart Colors ─────────────────────────────────────────────────────────────

export const CHART_COLORS = [
  '#00f5ff',
  '#a78bfa',
  '#10b981',
  '#ff6b6b',
  '#63f7ff',
  '#f5d76e',
  '#8b9dc3',
  '#fb923c',
]

// ─── Default Goals ────────────────────────────────────────────────────────────

export const DEFAULT_GOALS = [
  { id: 'g1', title: 'Emergency Fund', target: 20000, saved: 12500 },
  { id: 'g2', title: 'Retirement (2026)', target: 100000, saved: 63400 },
  { id: 'g3', title: 'Down Payment', target: 50000, saved: 18250 },
]

// ─── Local Storage Keys ───────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  TRANSACTIONS: 'aether:transactions',
  GOALS: 'aether:goals',
  THEME: 'aether:theme',
} as const
