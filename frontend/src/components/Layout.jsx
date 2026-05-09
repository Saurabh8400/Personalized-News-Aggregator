import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Zap, Home, Bookmark, Settings, LogOut, Menu, X,
  Search, Bell, User, TrendingUp
} from 'lucide-react'
import styles from './Layout.module.css'
import SearchBar from './SearchBar'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Zap size={20} fill="currentColor" />
            <span>Pulse</span>
          </div>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Home size={18} />
            <span>Feed</span>
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Bookmark size={18} />
            <span>Saved</span>
          </NavLink>
          <NavLink to="/preferences" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Settings size={18} />
            <span>Preferences</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user?.username}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className={styles.headerLeft}>
            <div className={styles.logoMobile}>
              <Zap size={18} fill="currentColor" />
              <span>Pulse</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.iconBtn} onClick={() => setSearchOpen(s => !s)}>
              <Search size={18} />
            </button>
            <div className={styles.avatarSmall}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
