import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Heart, SunMedium, BarChart3, Brain, Dumbbell, Zap, Users, FlameKindling, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const primaryItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/journal', icon: BookOpen, label: 'Dagboek' },
  { to: '/mood', icon: Heart, label: 'Stemming' },
  { to: '/checkin', icon: SunMedium, label: 'Check-in' },
  { to: '/reports', icon: BarChart3, label: 'Rapporten' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-noir-900/95 backdrop-blur-md border-t border-cream-200/[0.06] safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {primaryItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} className="flex-1">
            {({ isActive }) => (
              <span className={cn(
                'flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all duration-150',
                isActive ? 'text-amber' : 'text-cream-200/40 hover:text-cream-200/70'
              )}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-body font-medium">{label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
