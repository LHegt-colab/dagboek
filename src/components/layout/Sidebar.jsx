import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Heart, Brain, Dumbbell, Zap,
  Users, FlameKindling, SunMedium, BarChart3, Settings, BookMarked,
  Sun, Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import useAppStore from '@/store/useAppStore'

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

export default function Sidebar() {
  const { settings, updateSettings } = useAppStore()
  const isDark = settings.theme === 'dark'

  const toggleTheme = () => updateSettings({ theme: isDark ? 'light' : 'dark' })

  return (
    <aside
      className="hidden lg:flex flex-col w-[var(--sidebar-width)] h-screen sticky top-0 shrink-0"
      style={{ backgroundColor: 'var(--nav-bg)', borderRight: '1px solid var(--nav-border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6" style={{ borderBottom: '1px solid var(--nav-border)' }}>
        <div className="w-8 h-8 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center">
          <BookMarked className="w-4 h-4 text-amber" />
        </div>
        <div>
          <h1 className="font-display text-base font-semibold leading-none" style={{ color: 'var(--text)' }}>Dagboek</h1>
          <p className="text-[10px] font-body mt-0.5" style={{ color: 'var(--text-40)' }}>Persoonlijk Inzicht</p>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {({ isActive }) => (
                <span className={cn(isActive ? 'nav-item-active' : 'nav-item')}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber" />}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer with theme toggle */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--nav-border)' }}
      >
        <p className="text-[10px] font-body" style={{ color: 'var(--text-20)' }}>v1.0.0</p>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-amber/10"
          title={isDark ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
          style={{ color: 'var(--text-60)' }}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
