import { useState, useMemo, useRef } from 'react'
import { Download, FileJson, Printer, Calendar, TrendingUp, Moon, Activity, Heart } from 'lucide-react'
import { format, parseISO, subDays, startOfDay } from 'date-fns'
import { nl } from 'date-fns/locale'
import useAppStore from '@/store/useAppStore'
import { getCorrelationData, generateInsights } from '@/utils/insights'
import { getLastNDays, getDayKey } from '@/utils/dateHelpers'
import CorrelationChart from '@/components/charts/CorrelationChart'
import MoodChart from '@/components/charts/MoodChart'
import SleepChart from '@/components/charts/SleepChart'
import EnergyChart from '@/components/charts/EnergyChart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { exportToJSON } from '@/utils/exportPDF'
import { storage } from '@/utils/storage'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

const periodOptions = [
  { value: '7', label: '7 dagen' },
  { value: '14', label: '14 dagen' },
  { value: '30', label: '30 dagen' },
  { value: '90', label: '3 maanden' },
]

export default function Reports() {
  const [period, setPeriod] = useState('14')
  const days = parseInt(period)
  const printRef = useRef(null)
  const { toast } = useToast()

  const { moods, healthSleep, healthSport, journal, checkins, triggers, energy, relationships, schema } = useAppStore()

  const cutoff = startOfDay(subDays(new Date(), days))
  const filter = (arr) => arr.filter((e) => parseISO(e.createdAt) >= cutoff)

  const filteredMoods = filter(moods)
  const filteredSleep = filter(healthSleep)
  const filteredSport = filter(healthSport)
  const filteredJournal = filter(journal)
  const filteredCheckins = filter(checkins)
  const filteredTriggers = filter(triggers)
  const filteredEnergy = filter(energy)
  const filteredRelationships = filter(relationships)

  const avgMood = filteredMoods.length
    ? (filteredMoods.reduce((a, b) => a + b.score, 0) / filteredMoods.length).toFixed(2)
    : null
  const avgSleep = filteredSleep.length
    ? (filteredSleep.reduce((a, b) => a + b.hours, 0) / filteredSleep.length).toFixed(1)
    : null
  const sportDays = new Set(filteredSport.map((s) => getDayKey(parseISO(s.createdAt)))).size
  const journalDays = new Set(filteredJournal.map((j) => getDayKey(parseISO(j.createdAt)))).size

  const correlationData = useMemo(() => getCorrelationData(moods, healthSleep, healthSport, days), [moods, healthSleep, healthSport, days])
  const insights = useMemo(() => generateInsights({ moods, healthSleep, healthSport, journal, checkins }), [moods, healthSleep, healthSport, journal, checkins])

  // Emotion frequency
  const emotionFreq = useMemo(() => {
    const freq = {}
    filteredMoods.forEach((m) => m.emotionTags?.forEach((t) => { freq[t] = (freq[t] || 0) + 1 }))
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [filteredMoods])

  // Mood distribution
  const moodDist = useMemo(() => {
    const dist = { positive: 0, neutral: 0, negative: 0 }
    filteredMoods.forEach((m) => {
      if (m.score > 0) dist.positive++
      else if (m.score === 0) dist.neutral++
      else dist.negative++
    })
    return dist
  }, [filteredMoods])

  const handleExportJSON = () => {
    const data = storage.export()
    exportToJSON(data, `dagboek-export-${format(new Date(), 'yyyy-MM-dd')}.json`)
    toast({ title: 'Export gelukt', description: 'JSON bestand gedownload.' })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-8" id="print-area" ref={printRef}>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title">Rapporten & Analyse</h1>
          <p className="section-subtitle">Inzicht in je patronen en trends</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap no-print">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <FileJson className="w-3.5 h-3.5" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Gem. stemming" value={avgMood !== null ? (parseFloat(avgMood) > 0 ? `+${avgMood}` : avgMood) : '—'} icon={Heart} color={avgMood !== null && parseFloat(avgMood) >= 1 ? 'success' : avgMood !== null && parseFloat(avgMood) < 0 ? 'danger' : 'warning'} />
        <StatBox label="Gem. slaap" value={avgSleep !== null ? `${avgSleep}u` : '—'} icon={Moon} color={avgSleep !== null && parseFloat(avgSleep) >= 7 ? 'success' : 'warning'} />
        <StatBox label="Sportdagen" value={`${sportDays}d`} icon={Activity} color="info" />
        <StatBox label="Dagboekdagen" value={`${journalDays}d`} icon={TrendingUp} color="amber" />
      </div>

      {/* Auto-generated text insights */}
      {insights.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="font-display text-lg font-semibold text-cream-200 mb-4">Automatische inzichten</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {insights.map((insight) => (
              <div key={insight.id} className={cn('p-3.5 rounded-xl border',
                insight.type === 'success' ? 'bg-success/5 border-success/15' :
                insight.type === 'warning' ? 'bg-warning/5 border-warning/15' :
                'bg-info/5 border-info/15'
              )}>
                <p className="text-xs font-body font-semibold text-cream-200/80 mb-0.5">{insight.title}</p>
                <p className="text-xs font-body text-cream-200/50 leading-relaxed">{insight.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood trend chart */}
      {filteredMoods.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="font-display text-lg font-semibold text-cream-200 mb-1">Stemming trend</h2>
          <p className="text-xs text-cream-200/40 font-body mb-4">Dagelijks gemiddelde over {days} dagen</p>
          <MoodChart moods={moods} days={days} height={150} />
        </div>
      )}

      {/* Correlation chart */}
      {(filteredMoods.length > 0 || filteredSleep.length > 0) && (
        <div className="glass-card p-5">
          <h2 className="font-display text-lg font-semibold text-cream-200 mb-1">Correlatie: Stemming & Slaap</h2>
          <p className="text-xs text-cream-200/40 font-body mb-4">Overlap tussen slaap en stemmingspatronen</p>
          <CorrelationChart correlationData={correlationData} height={180} />
        </div>
      )}

      {/* Sleep + Energy charts side by side */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredSleep.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="font-display text-base font-semibold text-cream-200 mb-1">Slaap</h2>
            <p className="text-xs text-cream-200/40 font-body mb-4">Uren per nacht</p>
            <SleepChart sleepData={healthSleep} days={days} height={130} />
          </div>
        )}
        {filteredCheckins.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="font-display text-base font-semibold text-cream-200 mb-1">Energie</h2>
            <p className="text-xs text-cream-200/40 font-body mb-4">Dagelijks energieniveau (1-10)</p>
            <EnergyChart checkins={checkins} days={days} height={130} />
          </div>
        )}
      </div>

      {/* Emotion frequency + Mood distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {emotionFreq.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="font-display text-base font-semibold text-cream-200 mb-4">Meest voorkomende emoties</h2>
            <div className="space-y-2.5">
              {emotionFreq.map(([emotion, count]) => (
                <div key={emotion} className="flex items-center gap-3">
                  <span className="text-xs font-body text-cream-200/60 w-24 shrink-0 truncate">{emotion}</span>
                  <div className="flex-1 h-1.5 bg-noir-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber rounded-full transition-all duration-500"
                      style={{ width: `${(count / (emotionFreq[0]?.[1] || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-body text-cream-200/40 w-6 text-right">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredMoods.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="font-display text-base font-semibold text-cream-200 mb-4">Stemming verdeling</h2>
            <div className="space-y-3">
              {[
                { label: 'Positief (>0)', count: moodDist.positive, color: 'bg-success', total: filteredMoods.length },
                { label: 'Neutraal (0)', count: moodDist.neutral, color: 'bg-cream-200/30', total: filteredMoods.length },
                { label: 'Negatief (<0)', count: moodDist.negative, color: 'bg-danger', total: filteredMoods.length },
              ].map(({ label, count, color, total }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-body text-cream-200/60 w-28 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-noir-700 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                  </div>
                  <span className="text-xs font-body text-cream-200/40 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200/[0.06] flex justify-between text-xs font-body text-cream-200/40">
              <span>Totaal: {filteredMoods.length} metingen</span>
              <span>Periode: {days} dagen</span>
            </div>
          </div>
        )}
      </div>

      {/* Activity summary table */}
      <div className="glass-card p-5">
        <h2 className="font-display text-base font-semibold text-cream-200 mb-4">Activiteitsoverzicht</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Stemmingen', count: filteredMoods.length, icon: '❤️' },
            { label: 'Dagboekentries', count: filteredJournal.length, icon: '📓' },
            { label: 'Sportsessies', count: filteredSport.length, icon: '🏃' },
            { label: 'Slaaplogs', count: filteredSleep.length, icon: '🌙' },
            { label: 'Check-ins', count: filteredCheckins.length, icon: '☀️' },
            { label: 'Triggers', count: filteredTriggers.length, icon: '🔍' },
            { label: 'Relaties', count: filteredRelationships.length, icon: '👥' },
            { label: 'Energie logs', count: filteredEnergy.length, icon: '⚡' },
            { label: 'Schema logs', count: filter(schema).length, icon: '🧠' },
          ].map(({ label, count, icon }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-noir-800 border border-cream-200/[0.06]">
              <span className="text-lg">{icon}</span>
              <div>
                <p className="text-base font-display font-semibold text-cream-200">{count}</p>
                <p className="text-xs text-cream-200/40 font-body">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, icon: Icon, color }) {
  const colorMap = {
    success: 'text-success bg-success/10 border-success/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    info: 'text-info bg-info/10 border-info/20',
    amber: 'text-amber bg-amber/10 border-amber/20',
  }
  const iconColor = {
    success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-info', amber: 'text-amber',
  }
  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-body font-medium text-cream-200/40 uppercase tracking-wider leading-tight">{label}</p>
        <div className={cn('w-7 h-7 rounded-md flex items-center justify-center border', colorMap[color] || colorMap.amber)}>
          <Icon className={cn('w-3.5 h-3.5', iconColor[color] || 'text-amber')} />
        </div>
      </div>
      <p className={cn('font-display text-2xl font-semibold', iconColor[color] || 'text-amber')}>{value}</p>
    </div>
  )
}
