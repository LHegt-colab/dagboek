import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, BookOpen, Moon, Zap, Plus, ArrowRight, TrendingUp, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import useAppStore from '@/store/useAppStore'
import { generateInsights, getCorrelationData } from '@/utils/insights'
import { getLastNDays, getDayKey } from '@/utils/dateHelpers'
import { parseISO } from 'date-fns'
import DashboardCard from '@/components/widgets/DashboardCard'
import InsightCard from '@/components/widgets/InsightCard'
import MoodChart from '@/components/charts/MoodChart'
import EnergyChart from '@/components/charts/EnergyChart'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function getMoodEmoji(score) {
  if (score >= 3) return '😄'
  if (score >= 1) return '🙂'
  if (score === 0) return '😐'
  if (score >= -2) return '😢'
  return '😭'
}

function getMoodColor(score) {
  if (score >= 1) return 'text-success'
  if (score === 0) return 'text-cream-200/50'
  return 'text-danger'
}

export default function Dashboard() {
  const { moods, journal, checkins, healthSleep, healthSport, energy, schema } = useAppStore()
  const today = format(new Date(), 'EEEE d MMMM', { locale: nl })

  const last7 = getLastNDays(7)
  const last7Keys = new Set(last7.map(getDayKey))

  const recentMoods = moods.filter((m) => last7Keys.has(getDayKey(parseISO(m.createdAt))))
  const avgMood = recentMoods.length
    ? (recentMoods.reduce((a, b) => a + b.score, 0) / recentMoods.length).toFixed(1)
    : null

  const recentSleep = healthSleep.filter((s) => last7Keys.has(getDayKey(parseISO(s.createdAt))))
  const avgSleep = recentSleep.length
    ? (recentSleep.reduce((a, b) => a + b.hours, 0) / recentSleep.length).toFixed(1)
    : null

  const recentEnergy = checkins.filter((c) => c.energyLevel && last7Keys.has(getDayKey(parseISO(c.createdAt))))
  const avgEnergy = recentEnergy.length
    ? (recentEnergy.reduce((a, b) => a + b.energyLevel, 0) / recentEnergy.length).toFixed(1)
    : null

  const journalStreak = useMemo(() => {
    if (!journal.length) return 0
    const days = [...new Set(journal.map((j) => getDayKey(parseISO(j.createdAt))))].sort().reverse()
    let streak = 0
    let cur = getDayKey(new Date())
    for (const d of days) {
      const diff = Math.round((new Date(cur + 'T00:00:00') - new Date(d + 'T00:00:00')) / 86400000)
      if (diff <= 1) { streak++; cur = d } else break
    }
    return streak
  }, [journal])

  const insights = useMemo(() => generateInsights({ moods, healthSleep, healthSport, journal, checkins }), [moods, healthSleep, healthSport, journal, checkins])

  const todayMorning = checkins.find((c) => c.checkType === 'morning' && getDayKey(parseISO(c.createdAt)) === getDayKey(new Date()))
  const todayEvening = checkins.find((c) => c.checkType === 'evening' && getDayKey(parseISO(c.createdAt)) === getDayKey(new Date()))
  const todayMood = moods.find((m) => getDayKey(parseISO(m.createdAt)) === getDayKey(new Date()))

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream-200">Goedemorgen</h1>
          <p className="text-sm text-cream-200/40 font-body mt-1 capitalize">{today}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/checkin">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Activity className="w-3.5 h-3.5" />
              Check-in
            </Button>
          </Link>
          <Link to="/mood">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" />
              Log stemming
            </Button>
          </Link>
        </div>
      </div>

      {/* Today status strip */}
      <div className="glass-card p-4">
        <p className="text-xs font-body font-medium text-cream-200/40 uppercase tracking-wider mb-3">Vandaag</p>
        <div className="flex flex-wrap gap-3">
          <StatusChip done={!!todayMorning} label="Ochtend check-in" to="/checkin" />
          <StatusChip done={!!todayEvening} label="Avond check-out" to="/checkin" />
          <StatusChip done={!!todayMood} label="Stemming gelogd" to="/mood" />
          {todayMood && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-noir-800 border border-cream-200/10">
              <span className="text-base">{getMoodEmoji(todayMood.score)}</span>
              <span className={cn('text-xs font-body font-medium', getMoodColor(todayMood.score))}>
                {todayMood.score > 0 ? '+' : ''}{todayMood.score}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Gem. Stemming"
          value={avgMood !== null ? (avgMood > 0 ? `+${avgMood}` : avgMood) : '—'}
          subtitle="7 dagen"
          icon={Heart}
          color={avgMood !== null && parseFloat(avgMood) >= 1 ? 'green' : avgMood !== null && parseFloat(avgMood) < 0 ? 'red' : 'amber'}
        />
        <DashboardCard
          title="Gem. Slaap"
          value={avgSleep !== null ? `${avgSleep}u` : '—'}
          subtitle="7 dagen"
          icon={Moon}
          color={avgSleep !== null && parseFloat(avgSleep) >= 7 ? 'green' : avgSleep !== null && parseFloat(avgSleep) < 6 ? 'red' : 'amber'}
        />
        <DashboardCard
          title="Energie"
          value={avgEnergy !== null ? `${avgEnergy}/10` : '—'}
          subtitle="7 dagen"
          icon={Zap}
          color="blue"
        />
        <DashboardCard
          title="Dagboek streak"
          value={journalStreak}
          subtitle={journalStreak === 1 ? 'dag' : 'dagen'}
          icon={BookOpen}
          color="amber"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-cream-200">Stemming trend</h3>
              <p className="text-xs text-cream-200/40 font-body">Afgelopen 14 dagen</p>
            </div>
            <Link to="/mood" className="text-xs text-amber hover:text-amber-light font-body flex items-center gap-1 transition-colors">
              Bekijk alles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {moods.length > 0 ? (
            <MoodChart moods={moods} days={14} height={130} />
          ) : (
            <EmptyChartState label="Nog geen stemmingen gelogd" />
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-cream-200">Energie trend</h3>
              <p className="text-xs text-cream-200/40 font-body">Afgelopen 14 dagen</p>
            </div>
            <Link to="/checkin" className="text-xs text-amber hover:text-amber-light font-body flex items-center gap-1 transition-colors">
              Bekijk alles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {checkins.length > 0 ? (
            <EnergyChart checkins={checkins} days={14} height={130} />
          ) : (
            <EmptyChartState label="Nog geen check-ins gedaan" />
          )}
        </div>
      </div>

      {/* Insights + Recent Journal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Insights */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-semibold text-cream-200">Inzichten</h3>
            <TrendingUp className="w-4 h-4 text-amber/60" />
          </div>
          {insights.length > 0 ? (
            <div className="space-y-2.5">
              {insights.map((i) => <InsightCard key={i.id} insight={i} />)}
            </div>
          ) : (
            <div className="glass-card p-5 text-center">
              <p className="text-sm text-cream-200/40 font-body">Log meer gegevens voor persoonlijke inzichten.</p>
            </div>
          )}
        </div>

        {/* Recent Journal */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-semibold text-cream-200">Recente dagboekentries</h3>
            <Link to="/journal" className="text-xs text-amber hover:text-amber-light font-body flex items-center gap-1 transition-colors">
              Alles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {journal.length > 0 ? (
            <div className="space-y-3">
              {journal.slice(0, 3).map((entry) => (
                <Link key={entry.id} to="/journal">
                  <div className="glass-card-hover p-4 cursor-pointer">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h4 className="font-display text-sm font-semibold text-cream-200 leading-snug">{entry.title || 'Naamloos'}</h4>
                      <span className="text-xs text-cream-200/30 font-body shrink-0">
                        {format(parseISO(entry.createdAt), 'd MMM', { locale: nl })}
                      </span>
                    </div>
                    <p className="text-xs text-cream-200/50 font-body line-clamp-2 leading-relaxed">{entry.content}</p>
                    {entry.tags?.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {entry.tags.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-amber/10 text-amber/70 font-body">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-cream-200/20 mx-auto" />
              <p className="text-sm text-cream-200/40 font-body">Begin met je eerste dagboekentry.</p>
              <Link to="/journal"><Button size="sm">Schrijf iets</Button></Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-display text-base font-semibold text-cream-200 mb-3">Snel loggen</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/journal', icon: BookOpen, label: 'Dagboek', color: 'amber' },
            { to: '/mood', icon: Heart, label: 'Stemming', color: 'red' },
            { to: '/health', icon: Activity, label: 'Gezondheid', color: 'green' },
            { to: '/schema', icon: TrendingUp, label: 'Schema', color: 'purple' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}>
              <div className="glass-card-hover p-4 flex flex-col items-center gap-2 cursor-pointer text-center">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center',
                  color === 'amber' ? 'bg-amber/10' : color === 'red' ? 'bg-danger/10' : color === 'green' ? 'bg-success/10' : 'bg-purple-500/10'
                )}>
                  <Icon className={cn('w-4 h-4',
                    color === 'amber' ? 'text-amber' : color === 'red' ? 'text-danger' : color === 'green' ? 'text-success' : 'text-purple-400'
                  )} />
                </div>
                <span className="text-xs font-body font-medium text-cream-200/70">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusChip({ done, label, to }) {
  return (
    <Link to={to}>
      <div className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body font-medium transition-all duration-150',
        done
          ? 'bg-success/10 border-success/20 text-success'
          : 'bg-noir-800 border-cream-200/10 text-cream-200/40 hover:border-cream-200/20 hover:text-cream-200/60'
      )}>
        <span className={cn('w-1.5 h-1.5 rounded-full', done ? 'bg-success' : 'bg-cream-200/20')} />
        {label}
      </div>
    </Link>
  )
}

function EmptyChartState({ label }) {
  return (
    <div className="h-[130px] flex items-center justify-center">
      <p className="text-xs text-cream-200/25 font-body">{label}</p>
    </div>
  )
}
