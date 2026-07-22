import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { formatDateLong } from './lib/formatters'
import { NAV_ITEMS } from './lib/constants'
import { useBudgetStore } from './store/useBudgetStore'

// Code-split each page for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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

  useEffect(() => {
    initialize()
  }, [initialize])

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
        <div className="topbar">
          <h1>
            <PageTitle />
          </h1>
          <span className="date" aria-label="Today's date">
            {formatDateLong()}
          </span>
        </div>

        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
