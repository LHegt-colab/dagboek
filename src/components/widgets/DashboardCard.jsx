import { cn } from '@/lib/utils'

export default function DashboardCard({ title, value, subtitle, icon: Icon, trend, color = 'amber', children, className }) {
  const colorMap = {
    amber: { bg: 'bg-amber/10', border: 'border-amber/20', text: 'text-amber', icon: 'text-amber' },
    blue: { bg: 'bg-info/10', border: 'border-info/20', text: 'text-info', icon: 'text-info' },
    green: { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success', icon: 'text-success' },
    red: { bg: 'bg-danger/10', border: 'border-danger/20', text: 'text-danger', icon: 'text-danger' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'text-purple-400' },
  }
  const c = colorMap[color] || colorMap.amber

  return (
    <div className={cn('glass-card-hover p-5', className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-body font-medium text-cream-200/40 uppercase tracking-wider">{title}</p>
          {value !== undefined && (
            <div className="flex items-baseline gap-2 mt-1">
              <span className={cn('font-display text-2xl font-semibold', c.text)}>{value}</span>
              {subtitle && <span className="text-xs text-cream-200/40 font-body">{subtitle}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', c.bg, 'border', c.border)}>
            <Icon className={cn('w-4 h-4', c.icon)} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <p className={cn('text-xs font-body', trend >= 0 ? 'text-success' : 'text-danger')}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)} vs vorige week
        </p>
      )}
      {children}
    </div>
  )
}
