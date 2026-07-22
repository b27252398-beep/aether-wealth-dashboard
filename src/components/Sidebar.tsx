import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/constants'

export default function Sidebar() {
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

      <div className="sidebar-footer">v2.0 · Data stays on your device.</div>
    </aside>
  )
}
