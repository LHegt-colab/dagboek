import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Heart, Brain, Dumbbell, Zap,
  Users, FlameKindling, SunMedium, BarChart3, Settings, BookMarked,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  return (
    <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] h-screen sticky top-0 bg-noir-900 border-r border-cream-200/[0.06] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-cream-200/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center">
          <BookMarked className="w-4 h-4 text-amber" />
        </div>
        <div>
          <h1 className="font-display text-base font-semibold text-cream-200 leading-none">Dagboek</h1>
          <p className="text-[10px] text-cream-200/30 font-body mt-0.5">Persoonlijk Inzicht</p>
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

      {/* Footer */}
      <div className="px-5 py-4 border-t border-cream-200/[0.06]">
        <p className="text-[10px] text-cream-200/20 font-body">v1.0.0 · Lokaal opgeslagen</p>
      </div>
    </aside>
  )
}
