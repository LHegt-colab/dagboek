import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { BookMarked, X, Menu, Sun, Moon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Heart, SunMedium, BarChart3, Brain,
  Dumbbell, Zap, Users, FlameKindling, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useAppStore from '@/store/useAppStore'

const routeTitles = {
  '/': 'Dashboard',
  '/journal': 'Dagboek',
  '/mood': 'Stemming',
  '/checkin': 'Check-in',
  '/schema': 'Schematherapie',
  '/health': 'Gezondheid',
  '/triggers': 'Triggers & Gedachten',
  '/relationships': 'Relaties',
  '/energy': 'Energie & Flow',
  '/reports': 'Rapporten',
  '/settings': 'Instellingen',
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/journal', icon: BookOpen, label: 'Dagboek' },
  { to: '/mood', icon: Heart, label: 'Stemming' },
  { to: '/checkin', icon: SunMedium, label: 'Check-in' },
  { to: '/schema', icon: Brain, label: 'Schematherapie' },
  { to: '/health', icon: Dumbbell, label: 'Gezondheid' },
  { to: '/triggers', icon: FlameKindling, label: 'Triggers & Gedachten' },
  { to: '/relationships', icon: Users, label: 'Relaties' },
  { to: '/energy', icon: Zap, label: 'Energie & Flow' },
  { to: '/reports', icon: BarChart3, label: 'Rapporten' },
  { to: '/settings', icon: Settings, label: 'Instellingen' },
]

export default function Header() {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { settings, updateSettings } = useAppStore()
  const isDark = settings.theme === 'dark'

  const title = routeTitles[pathname] || 'Dagboek'
  const today = format(new Date(), 'EEEE d MMMM', { locale: nl })
  const closeDrawer = () => setDrawerOpen(false)
  const toggleTheme = () => updateSettings({ theme: isDark ? 'light' : 'dark' })

  return (
    <>
      {/* Top header bar — mobile only */}
      <header
        className="lg:hidden sticky top-0 z-30 backdrop-blur-md px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'var(--header-bg)', borderBottom: '1px solid var(--border)' }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors -ml-1"
          style={{ color: 'var(--text-60)' }}
          aria-label="Menu openen"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="font-display text-base font-semibold leading-none" style={{ color: 'var(--text)' }}>{title}</h1>
        </div>

        {/* Right: theme toggle + logo */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-60)' }}
            title={isDark ? 'Lichte modus' : 'Donkere modus'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="w-7 h-7 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center">
            <BookMarked className="w-3.5 h-3.5 text-amber" />
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeDrawer}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col',
          'transition-transform duration-300 ease-out will-change-transform',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: 'var(--nav-bg)', borderRight: '1px solid var(--nav-border)' }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid var(--nav-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
              <BookMarked className="w-4 h-4 text-amber" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold leading-none" style={{ color: 'var(--text)' }}>Dagboek</h2>
              <p className="text-[10px] font-body mt-0.5 capitalize" style={{ color: 'var(--text-40)' }}>{today}</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-40)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={closeDrawer}>
              {({ isActive }) => (
                <span className={cn(isActive ? 'nav-item-active' : 'nav-item')}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber" />}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer with theme toggle */}
        <div className="px-4 py-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--nav-border)' }}>
          <p className="text-[10px] font-body" style={{ color: 'var(--text-20)' }}>v1.0.0</p>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-amber/10"
            style={{ color: 'var(--text-60)' }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  )
}
