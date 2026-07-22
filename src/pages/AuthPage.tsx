import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMsg(null)
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('Check your email for the confirmation link!')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gridTemplateColumns: '1fr' }}>
      <div className="glass panel" style={{ maxWidth: '400px', width: '100%', margin: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="brand" style={{ fontSize: '32px' }}>AETHER</div>
          <div className="brand-sub" style={{ marginBottom: '8px' }}>WEALTH MANAGEMENT</div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        {msg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-field">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
