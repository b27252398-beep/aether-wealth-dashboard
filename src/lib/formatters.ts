// ─── Currency Formatter ───────────────────────────────────────────────────────

export function formatCurrency(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `₹${(value / 1_000_000).toFixed(2)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `₹${(value / 1_000).toFixed(1)}K`
  }
  return `₹${formatCurrency(value)}`
}

// ─── Date Formatter ───────────────────────────────────────────────────────────

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateLong(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getMonthKey(dateStr: string): string {
  return dateStr?.slice(0, 7) || 'Unknown'
}

// ─── String Utilities ─────────────────────────────────────────────────────────

export function initials(title: string): string {
  return title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

// ─── Number Utilities ─────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function percentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCSV<T extends Record<string, unknown>>(
  rows: T[],
  filename: string
): void {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? '')
          return val.includes(',') ? `"${val}"` : val
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
