import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { formatDateLong } from './lib/formatters'
import { NAV_ITEMS } from './lib/constants'
import { useBudgetStore } from './store/useBudgetStore'
import { supabase } from './lib/supabase'

// Code-split each page for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))

function PageTitle() {
  const { pathname } = useLocation()
  const item = NAV_ITEMS.find((n) => n.path === pathname)
  return <>{item?.label ?? 'Not Found'}</>
}

function PageSkeleton() {
  return (
    <div className="page-skeleton">
      <div className="skeleton-bar wide" />
      <div className="skeleton-bar" />
      <div className="skeleton-bar medium" />
    </div>
  )
}

export default function App() {
  const initialize = useBudgetStore((s) => s.initialize)
  const isInitialized = useBudgetStore((s) => s.isInitialized)
  const error = useBudgetStore((s) => s.error)
  const user = useBudgetStore((s) => s.user)
  const setUser = useBudgetStore((s) => s.setUser)
  const signOut = useBudgetStore((s) => s.signOut)

  // Listen to Supabase Auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  // Initialize data when user is present
  useEffect(() => {
    if (user) {
      initialize()
    }
  }, [user, initialize])

  // If not logged in, show Auth Page
  if (!user) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <AuthPage />
      </Suspense>
    )
  }

  // If logged in but data is loading
  if (!isInitialized) {
    return (
      <div className="shell">
        <Sidebar />
        <main className="main" id="main-content">
          <PageSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main" id="main-content">
        {error && (
          <div style={{ background: '#3b2525', color: '#ff8a8a', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ff5c5c', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Warning:</strong> {error}</span>
            <button onClick={signOut} style={{ background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', textDecoration: 'underline' }}>Sign out</button>
          </div>
        )}
        <div className="topbar">
          <h1>
            <PageTitle />
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="date" aria-label="Today's date">
              {formatDateLong()}
            </span>
            <button onClick={signOut} className="export-btn" style={{ borderColor: 'transparent' }}>
              Sign Out
            </button>
          </div>
        </div>

        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
