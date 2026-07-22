// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCurrencyCompact,
  initials,
  percentage,
  clamp,
  todayISO,
} from '../lib/formatters'

describe('formatCurrency', () => {
  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('0.00')
  })
  it('formats positive number', () => {
    expect(formatCurrency(1234.5)).toBe('1,234.50')
  })
  it('formats large number with commas', () => {
    expect(formatCurrency(1000000)).toBe('1,000,000.00')
  })
  it('respects decimal places param', () => {
    expect(formatCurrency(1234, 0)).toBe('1,234')
  })
})

describe('formatCurrencyCompact', () => {
  it('shows M suffix for millions', () => {
    expect(formatCurrencyCompact(1500000)).toBe('$1.50M')
  })
  it('shows K suffix for thousands', () => {
    expect(formatCurrencyCompact(5000)).toBe('$5.0K')
  })
  it('shows full amount for small numbers', () => {
    expect(formatCurrencyCompact(500)).toBe('$500.00')
  })
})

describe('initials', () => {
  it('returns first letters of first two words', () => {
    expect(initials('Client Payment')).toBe('CP')
  })
  it('handles single word', () => {
    expect(initials('Rent')).toBe('R')
  })
  it('uppercases initials', () => {
    expect(initials('apple pie')).toBe('AP')
  })
})

describe('percentage', () => {
  it('returns 0 for zero total', () => {
    expect(percentage(500, 0)).toBe(0)
  })
  it('calculates correct percentage', () => {
    expect(percentage(1, 4)).toBe(25)
  })
  it('rounds to nearest integer', () => {
    expect(percentage(1, 3)).toBe(33)
  })
})

describe('clamp', () => {
  it('returns value within range unchanged', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })
  it('clamps to minimum', () => {
    expect(clamp(-10, 0, 100)).toBe(0)
  })
  it('clamps to maximum', () => {
    expect(clamp(150, 0, 100)).toBe(100)
  })
})

describe('todayISO', () => {
  it('returns string in YYYY-MM-DD format', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
