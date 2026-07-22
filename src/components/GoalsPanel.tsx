import { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import { formatCurrency, clamp, percentage } from '../lib/formatters'

export default function GoalsPanel() {
  const goals = useBudgetStore((s) => s.goals)
  const updateGoalSaved = useBudgetStore((s) => s.updateGoalSaved)
  const addGoal = useBudgetStore((s) => s.addGoal)
  const deleteGoal = useBudgetStore((s) => s.deleteGoal)

  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [newSaved, setNewSaved] = useState('')

  function startEdit(id: string, current: number) {
    setEditing(id)
    setEditValue(String(current))
  }

  function commitEdit(id: string) {
    const val = parseFloat(editValue)
    if (!isNaN(val) && val >= 0) updateGoalSaved(id, val)
    setEditing(null)
  }

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault()
    const target = parseFloat(newTarget)
    const saved = parseFloat(newSaved) || 0
    if (!newTitle.trim() || isNaN(target) || target <= 0) return
    addGoal({ title: newTitle.trim(), target, saved })
    setNewTitle('')
    setNewTarget('')
    setNewSaved('')
    setShowAddForm(false)
  }

  return (
    <div className="glass panel">
      <div className="panel-head">
        <h2>Financial Goals</h2>
        <button
          id="add-goal-btn"
          className="export-btn"
          onClick={() => setShowAddForm((v) => !v)}
          aria-expanded={showAddForm}
        >
          {showAddForm ? '✕ Cancel' : '+ New Goal'}
        </button>
      </div>

      {showAddForm && (
        <form className="form-grid goal-add-form" onSubmit={handleAddGoal}>
          <div className="form-field">
            <label htmlFor="goal-title">Goal Title</label>
            <input
              id="goal-title"
              type="text"
              placeholder="e.g. Vacation fund"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="goal-target">Target ($)</label>
            <input
              id="goal-target"
              type="number"
              min="1"
              placeholder="10000"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="goal-saved">Already Saved ($)</label>
            <input
              id="goal-saved"
              type="number"
              min="0"
              placeholder="0"
              value={newSaved}
              onChange={(e) => setNewSaved(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn" style={{ marginTop: 0 }}>
            Add Goal
          </button>
        </form>
      )}

      <div className="goals-grid">
        {goals.map((g) => {
          const pct = clamp(percentage(g.saved, g.target), 0, 100)
          return (
            <div className="glass goal-card" key={g.id}>
              <div className="goal-card-head">
                <div className="goal-title">{g.title}</div>
                <button
                  className="delete-btn"
                  onClick={() => deleteGoal(g.id)}
                  aria-label={`Delete goal: ${g.title}`}
                >
                  ✕
                </button>
              </div>
              <div className="goal-numbers">
                {editing === g.id ? (
                  <input
                    id={`goal-saved-${g.id}`}
                    type="number"
                    className="goal-edit-input"
                    value={editValue}
                    min="0"
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(g.id)}
                    onKeyDown={(e) => e.key === 'Enter' && commitEdit(g.id)}
                    autoFocus
                    aria-label={`Edit saved amount for ${g.title}`}
                  />
                ) : (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => startEdit(g.id, g.saved)}
                    onKeyDown={(e) => e.key === 'Enter' && startEdit(g.id, g.saved)}
                    title="Click to edit"
                    aria-label={`Saved $${formatCurrency(g.saved, 0)} of $${formatCurrency(g.target, 0)}. Click to edit.`}
                  >
                    ${formatCurrency(g.saved, 0)} of ${formatCurrency(g.target, 0)}
                  </span>
                )}
              </div>
              <div
                className="goal-track"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% complete`}
              >
                <div className="goal-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="goal-pct">{pct}% complete</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
