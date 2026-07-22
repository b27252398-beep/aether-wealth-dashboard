import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/constants'
import { useTheme } from '../hooks/useTheme'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="sidebar">
      <div className="brand">AETHER</div>
      <div className="brand-sub">WEALTH MANAGEMENT</div>

      <nav aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          onClick={toggleTheme} 
          className="export-btn"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <div>v2.0 · Data stays on your device.</div>
      </div>
    </aside>
  )
}
