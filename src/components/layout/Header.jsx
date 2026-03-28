import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { BookMarked, X, Menu } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Heart, SunMedium, BarChart3, Brain,
  Dumbbell, Zap, Users, FlameKindling, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const title = routeTitles[pathname] || 'Dagboek'
  const today = format(new Date(), 'EEEE d MMMM', { locale: nl })

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      {/* Top header bar — mobile only */}
      <header className="lg:hidden sticky top-0 z-30 bg-noir-950/95 backdrop-blur-md border-b border-cream-200/[0.06] px-4 py-3 flex items-center justify-between">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-cream-200/60 hover:text-cream-200 hover:bg-cream-200/5 transition-colors -ml-1"
          aria-label="Menu openen"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="font-display text-base font-semibold text-cream-200 leading-none">{title}</h1>
        </div>

        {/* Logo badge right */}
        <div className="w-7 h-7 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center">
          <BookMarked className="w-3.5 h-3.5 text-amber" />
        </div>
      </header>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-noir-950/75 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Slide-in drawer */}
      <div className={cn(
        'lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-noir-900 border-r border-cream-200/[0.06] flex flex-col',
        'transition-transform duration-300 ease-out will-change-transform',
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-cream-200/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
              <BookMarked className="w-4 h-4 text-amber" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-cream-200 leading-none">Dagboek</h2>
              <p className="text-[10px] text-cream-200/30 font-body mt-0.5 capitalize">{today}</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-cream-200/40 hover:text-cream-200 hover:bg-cream-200/5 transition-colors"
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

        {/* Footer */}
        <div className="px-5 py-4 border-t border-cream-200/[0.06]">
          <p className="text-[10px] text-cream-200/20 font-body">v1.0.0 · Lokaal opgeslagen</p>
        </div>
      </div>
    </>
  )
}
