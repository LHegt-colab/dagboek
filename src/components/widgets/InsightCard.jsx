import { Moon, Activity, Flame, Heart, Sun, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap = { moon: Moon, activity: Activity, flame: Flame, heart: Heart, sun: Sun }
const typeMap = {
  warning: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/15' },
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5', border: 'border-success/15' },
  info: { icon: Info, color: 'text-info', bg: 'bg-info/5', border: 'border-info/15' },
}

export default function InsightCard({ insight }) {
  const Icon = iconMap[insight.icon] || Info
  const style = typeMap[insight.type] || typeMap.info

  return (
    <div className={cn('flex gap-3 p-3.5 rounded-xl border transition-all duration-150', style.bg, style.border)}>
      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', style.color)} />
      <div className="min-w-0">
        <p className="text-xs font-body font-semibold text-cream-200/80">{insight.title}</p>
        <p className="text-xs font-body text-cream-200/50 mt-0.5 leading-relaxed">{insight.body}</p>
      </div>
    </div>
  )
}
