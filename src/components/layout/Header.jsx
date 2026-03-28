import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { BookMarked } from 'lucide-react'

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

export default function Header() {
  const { pathname } = useLocation()
  const title = routeTitles[pathname] || 'Dagboek'
  const today = format(new Date(), 'EEEE d MMMM', { locale: nl })

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-noir-950/90 backdrop-blur-md border-b border-cream-200/[0.06] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center">
          <BookMarked className="w-3.5 h-3.5 text-amber" />
        </div>
        <div>
          <h1 className="font-display text-base font-semibold text-cream-200 leading-none">{title}</h1>
          <p className="text-[10px] text-cream-200/30 font-body mt-0.5 capitalize">{today}</p>
        </div>
      </div>
    </header>
  )
}
