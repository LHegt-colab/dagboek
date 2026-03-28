import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/store/useAppStore'
import { formatRelative, formatDate } from '@/utils/dateHelpers'
import { cn } from '@/lib/utils'
import {
  Brain,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  Shield,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Fallback schema modes if settings are empty
// ---------------------------------------------------------------------------
const DEFAULT_MODES = [
  {
    id: 'vulnerable-child',
    name: 'Kwetsbaar kind',
    description: 'Gevoelens van angst, verdriet, schaamte of verlatenheid.',
    color: '#60a5fa',
  },
  {
    id: 'angry-child',
    name: 'Boos kind',
    description: 'Intense woede of frustratie als reactie op niet-vervulde behoeften.',
    color: '#f87171',
  },
  {
    id: 'impulsive-child',
    name: 'Impulsief kind',
    description: 'Handelen vanuit directe impulsen zonder nadenken.',
    color: '#fb923c',
  },
  {
    id: 'punishing-parent',
    name: 'Straffende ouder',
    description: 'Harde zelfkritiek en zelfbestraffing.',
    color: '#a855f7',
  },
  {
    id: 'demanding-parent',
    name: 'Eisende ouder',
    description: 'Hoge, onrealistische eisen aan jezelf stellen.',
    color: '#ec4899',
  },
  {
    id: 'detached-protector',
    name: 'Afstandelijke beschermer',
    description: 'Emotionele afsluiting ter bescherming.',
    color: '#94a3b8',
  },
  {
    id: 'compliant-surrenderer',
    name: 'Gehoorzame onderwerper',
    description: 'Toegeven aan anderen om conflict te vermijden.',
    color: '#34d399',
  },
  {
    id: 'healthy-adult',
    name: 'Gezonde volwassene',
    description: 'Gebalanceerde, zorgzame en rationele modus.',
    color: '#C97D3A',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function intensityColor(intensity) {
  if (intensity >= 8) return 'text-red-400'
  if (intensity >= 5) return 'text-amber-400'
  return 'text-emerald-400'
}

function intensityBg(intensity) {
  if (intensity >= 8) return 'bg-red-400/10 border-red-400/30'
  if (intensity >= 5) return 'bg-amber-400/10 border-amber-400/30'
  return 'bg-emerald-400/10 border-emerald-400/30'
}

// ---------------------------------------------------------------------------
// Introduction Card
// ---------------------------------------------------------------------------
function IntroCard() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="glass-card p-5 mb-6 border-[#C97D3A]/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-[#C97D3A] shrink-0 mt-0.5" />
          <h2 className="font-playfair text-[#F5ECD7] text-sm font-semibold">
            Over schema-modi
          </h2>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[#F5ECD7]/40 hover:text-[#F5ECD7] transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 text-sm text-[#F5ECD7]/65 leading-relaxed">
          <p>
            Schema-therapie gaat ervan uit dat we in verschillende <em>modi</em> kunnen
            verkeren — emotionele toestanden die ons denken, voelen en gedrag sturen.
          </p>
          <p>
            Door je huidige modus te herkennen, kun je bewuster reageren in plaats van
            automatisch te handelen vanuit oude patronen.
          </p>
          <p>
            Het doel is om steeds vaker vanuit de{' '}
            <span className="text-[#C97D3A] font-medium">Gezonde Volwassene</span> te
            handelen: zorgzaam voor jezelf en anderen, terwijl je grenzen bewaakt.
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <Brain size={48} className="text-[#F5ECD7]/20 mb-4" />
      <h3 className="font-playfair text-xl text-[#F5ECD7] mb-2">
        Nog geen schema-momenten
      </h3>
      <p className="text-[#F5ECD7]/50 text-sm max-w-xs mb-6">
        Registreer momenten waarop je een schema-modus herkent. Bewustwording is de
        eerste stap naar verandering.
      </p>
      <Button className="btn-primary" onClick={onAdd}>
        <Plus size={16} className="mr-2" />
        Eerste moment loggen
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Schema Entry Card
// ---------------------------------------------------------------------------
function SchemaCard({ entry, modes, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const mode = modes.find((m) => m.id === entry.modeId) ?? modes[0]

  return (
    <div className="glass-card-hover p-4 group">
      <div className="flex items-start gap-3">
        {/* Mode dot + intensity */}
        <div className="flex flex-col items-center gap-1 shrink-0 w-12">
          <div
            className="w-3 h-3 rounded-full mt-1"
            style={{ backgroundColor: mode?.color ?? '#C97D3A' }}
          />
          <div
            className={cn(
              'text-xs font-bold px-1.5 py-0.5 rounded border',
              intensityBg(entry.intensity),
              intensityColor(entry.intensity)
            )}
          >
            {entry.intensity}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <Badge
              variant="outline"
              style={{
                borderColor: `${mode?.color ?? '#C97D3A'}50`,
                color: mode?.color ?? '#C97D3A',
                backgroundColor: `${mode?.color ?? '#C97D3A'}10`,
              }}
              className="text-[11px] px-2 py-0 font-medium"
            >
              {mode?.name ?? 'Onbekend'}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#F5ECD7]/35 flex items-center gap-1">
                <Calendar size={10} />
                {formatRelative(entry.date)}
              </span>
              <button
                onClick={() => onEdit(entry)}
                className="ml-1 p-1 rounded hover:bg-[#C97D3A]/20 text-[#C97D3A] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 size={12} />
              </button>
              <button
                onClick={() => onDelete(entry)}
                className="p-1 rounded hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {entry.thought && (
            <p className="text-sm text-[#F5ECD7]/70 line-clamp-2 leading-relaxed">
              {entry.thought}
            </p>
          )}

          {/* Expandable details */}
          {(entry.feeling || entry.behavior || entry.healthyAdult) && (
            <>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 text-xs text-[#F5ECD7]/35 hover:text-[#C97D3A] flex items-center gap-1 transition-colors"
              >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {expanded ? 'Minder tonen' : 'Meer tonen'}
              </button>

              {expanded && (
                <div className="mt-3 space-y-3 border-t border-[#2a2a2a] pt-3">
                  {entry.feeling && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#F5ECD7]/30 mb-1">
                        Gevoel
                      </p>
                      <p className="text-sm text-[#F5ECD7]/65">{entry.feeling}</p>
                    </div>
                  )}
                  {entry.behavior && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#F5ECD7]/30 mb-1">
                        Gedrag
                      </p>
                      <p className="text-sm text-[#F5ECD7]/65">{entry.behavior}</p>
                    </div>
                  )}
                  {entry.healthyAdult && (
                    <div className="bg-[#C97D3A]/5 border border-[#C97D3A]/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Shield size={12} className="text-[#C97D3A]" />
                        <p className="text-xs uppercase tracking-wider text-[#C97D3A]">
                          Reactie Gezonde Volwassene
                        </p>
                      </div>
                      <p className="text-sm text-[#F5ECD7]/75">{entry.healthyAdult}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mode Selector (Radio-style cards)
// ---------------------------------------------------------------------------
function ModeSelectorGrid({ modes, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {modes.map((mode) => {
        const selected = value === mode.id
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={cn(
              'flex items-start gap-2 p-3 rounded-lg border text-left transition-all',
              selected
                ? 'border-opacity-80 bg-opacity-10'
                : 'border-[#2a2a2a] bg-[#1C1C1C] hover:border-[#3a3a3a]'
            )}
            style={
              selected
                ? {
                    borderColor: mode.color,
                    backgroundColor: `${mode.color}15`,
                  }
                : {}
            }
          >
            <div
              className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
              style={{ backgroundColor: mode.color }}
            />
            <div className="min-w-0">
              <p
                className="text-sm font-medium leading-tight"
                style={{ color: selected ? mode.color : '#F5ECD7' }}
              >
                {mode.name}
              </p>
              <p className="text-xs text-[#F5ECD7]/45 mt-0.5 leading-snug">
                {mode.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Schema Entry Modal (Add / Edit)
// ---------------------------------------------------------------------------
function SchemaModal({ open, onClose, entry, onSave, modes }) {
  const isEdit = Boolean(entry?.id)

  const [modeId, setModeId] = useState(entry?.modeId ?? modes[0]?.id ?? '')
  const [intensity, setIntensity] = useState(entry?.intensity ?? 5)
  const [thought, setThought] = useState(entry?.thought ?? '')
  const [feeling, setFeeling] = useState(entry?.feeling ?? '')
  const [behavior, setBehavior] = useState(entry?.behavior ?? '')
  const [healthyAdult, setHealthyAdult] = useState(entry?.healthyAdult ?? '')

  useState(() => {
    setModeId(entry?.modeId ?? modes[0]?.id ?? '')
    setIntensity(entry?.intensity ?? 5)
    setThought(entry?.thought ?? '')
    setFeeling(entry?.feeling ?? '')
    setBehavior(entry?.behavior ?? '')
    setHealthyAdult(entry?.healthyAdult ?? '')
  }, [entry, open])

  const selectedMode = modes.find((m) => m.id === modeId)

  const handleSave = () => {
    onSave({
      ...(entry ?? {}),
      modeId,
      intensity,
      thought: thought.trim(),
      feeling: feeling.trim(),
      behavior: behavior.trim(),
      healthyAdult: healthyAdult.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#F5ECD7] flex items-center gap-2">
            <Brain size={18} className="text-[#C97D3A]" />
            {isEdit ? 'Schema-moment bewerken' : 'Schema-moment loggen'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Mode Selector */}
          <div>
            <Label className="label-base">Welke modus herken je?</Label>
            <div className="mt-3">
              <ModeSelectorGrid modes={modes} value={modeId} onChange={setModeId} />
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <Label className="label-base">
              Intensiteit:{' '}
              <span className={cn('font-semibold', intensityColor(intensity))}>
                {intensity}/10
              </span>
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[intensity]}
              onValueChange={([v]) => setIntensity(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/30 mt-1 px-1">
              <span>Laag</span>
              <span>Hoog</span>
            </div>
          </div>

          {/* Thought */}
          <div>
            <Label className="label-base">Gedachte / overtuiging</Label>
            <Textarea
              className="input-base mt-1 min-h-[80px] resize-none"
              placeholder="Welke gedachte of overtuiging speelt er?"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
          </div>

          {/* Feeling */}
          <div>
            <Label className="label-base">Gevoel</Label>
            <Textarea
              className="input-base mt-1 min-h-[60px] resize-none"
              placeholder="Wat voel je in je lichaam en emotioneel?"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
          </div>

          {/* Behavior */}
          <div>
            <Label className="label-base">Gedrag</Label>
            <Textarea
              className="input-base mt-1 min-h-[60px] resize-none"
              placeholder="Hoe gedraag je je vanuit deze modus?"
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
            />
          </div>

          {/* Healthy Adult Response */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Shield size={13} className="text-[#C97D3A]" />
              <Label className="label-base text-[#C97D3A]">
                Reactie Gezonde Volwassene
              </Label>
            </div>
            <Textarea
              className="mt-1 min-h-[90px] resize-none rounded-lg bg-[#1C1C1C] text-[#F5ECD7]/90 placeholder:text-[#F5ECD7]/25 text-sm leading-relaxed border border-[#C97D3A]/40 focus:border-[#C97D3A] focus:outline-none focus:ring-1 focus:ring-[#C97D3A]/50 transition-colors p-3"
              placeholder="Hoe zou jouw Gezonde Volwassene op deze situatie reageren?"
              value={healthyAdult}
              onChange={(e) => setHealthyAdult(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>
            Annuleren
          </Button>
          <Button
            className="btn-primary"
            onClick={handleSave}
            disabled={!modeId}
          >
            {isEdit ? 'Opslaan' : 'Loggen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Delete Confirmation Modal
// ---------------------------------------------------------------------------
function DeleteModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-playfair text-lg text-[#F5ECD7]">
            Verwijderen
          </DialogTitle>
        </DialogHeader>
        <p className="text-[#F5ECD7]/70 text-sm py-2">
          Weet je zeker dat je dit schema-moment wilt verwijderen?
        </p>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>
            Annuleren
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            Verwijderen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Main SchemaTherapy Component
// ---------------------------------------------------------------------------
export default function SchemaTherapy() {
  const { schema, settings, addSchemaEntry, updateSchemaEntry, deleteSchemaEntry } =
    useAppStore()
  const { toast } = useToast()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [filterMode, setFilterMode] = useState('all')

  const modes = settings?.schemaModes?.length
    ? settings.schemaModes
    : DEFAULT_MODES

  const sortedEntries = useMemo(
    () => [...(schema ?? [])].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [schema]
  )

  const filtered = useMemo(() => {
    if (filterMode === 'all') return sortedEntries
    return sortedEntries.filter((e) => e.modeId === filterMode)
  }, [sortedEntries, filterMode])

  // Mode frequency for stats
  const modeCounts = useMemo(() => {
    const counts = {}
    sortedEntries.forEach((e) => {
      counts[e.modeId] = (counts[e.modeId] ?? 0) + 1
    })
    return counts
  }, [sortedEntries])

  const topMode = useMemo(() => {
    const entries = Object.entries(modeCounts)
    if (!entries.length) return null
    const [modeId] = entries.sort((a, b) => b[1] - a[1])[0]
    return modes.find((m) => m.id === modeId)
  }, [modeCounts, modes])

  const handleSave = (data) => {
    if (data.id) {
      updateSchemaEntry({ ...data, updatedAt: new Date().toISOString() })
      toast({ title: 'Schema-moment bijgewerkt' })
    } else {
      addSchemaEntry({
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      toast({ title: 'Schema-moment gelogd' })
    }
    setAddModalOpen(false)
    setEditEntry(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteSchemaEntry(deleteTarget.id)
    toast({ title: 'Verwijderd', variant: 'destructive' })
    setDeleteTarget(null)
  }

  return (
    <div className="relative min-h-full pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Brain size={22} className="text-[#C97D3A]" />
          <h1 className="section-title">Schema-therapie</h1>
        </div>
        <p className="section-subtitle">Herken patronen en reageer als Gezonde Volwassene.</p>
      </div>

      {/* Intro Card */}
      <IntroCard />

      {/* Stats */}
      {sortedEntries.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Brain size={14} className="text-[#C97D3A]" />
            <span className="text-[#F5ECD7]/70 text-sm">
              <span className="text-[#F5ECD7] font-semibold">{sortedEntries.length}</span> momenten
            </span>
          </div>
          {topMode && (
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: topMode.color }}
              />
              <span className="text-[#F5ECD7]/70 text-sm">
                Meest: <span className="text-[#F5ECD7] font-medium">{topMode.name}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filter + Add Row */}
      {sortedEntries.length > 0 && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Filter size={14} className="text-[#F5ECD7]/40 shrink-0" />
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="input-base h-9 text-sm w-52">
                <SelectValue placeholder="Filter op modus" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7]">
                <SelectItem value="all" className="text-sm hover:bg-[#2a2a2a]">
                  Alle modi
                </SelectItem>
                {modes.map((mode) => (
                  <SelectItem
                    key={mode.id}
                    value={mode.id}
                    className="text-sm hover:bg-[#2a2a2a]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: mode.color }}
                      />
                      {mode.name}
                      {modeCounts[mode.id] && (
                        <span className="text-xs text-[#F5ECD7]/40">
                          ({modeCounts[mode.id]})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="btn-primary shrink-0" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Moment loggen
          </Button>
        </div>
      )}

      {/* Filtered empty */}
      {filtered.length === 0 && sortedEntries.length > 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <Filter size={32} className="text-[#F5ECD7]/20 mb-2" />
          <p className="text-[#F5ECD7]/45 text-sm">
            Geen momenten gevonden voor dit filter.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="mt-2 text-xs text-[#C97D3A] hover:underline"
          >
            Filter wissen
          </button>
        </div>
      )}

      {/* Empty State */}
      {sortedEntries.length === 0 && <EmptyState onAdd={() => setAddModalOpen(true)} />}

      {/* Entry List */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <SchemaCard
              key={entry.id}
              entry={entry}
              modes={modes}
              onEdit={(e) => setEditEntry(e)}
              onDelete={(e) => setDeleteTarget(e)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {sortedEntries.length > 0 && (
        <button
          onClick={() => setAddModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#C97D3A] hover:bg-[#C97D3A]/90 text-white shadow-lg shadow-[#C97D3A]/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
          aria-label="Schema-moment loggen"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Add Modal */}
      <SchemaModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        entry={null}
        onSave={handleSave}
        modes={modes}
      />

      {/* Edit Modal */}
      <SchemaModal
        open={Boolean(editEntry)}
        onClose={() => setEditEntry(null)}
        entry={editEntry}
        onSave={handleSave}
        modes={modes}
      />

      {/* Delete Confirmation */}
      <DeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
