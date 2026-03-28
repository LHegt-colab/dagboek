import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/store/useAppStore'
import { formatRelative, formatDate } from '@/utils/dateHelpers'
import { cn } from '@/lib/utils'
import {
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Zap,
  Heart,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function isMorning(entry) {
  return entry?.type === 'morning'
}

function scoreColor(score) {
  if (score >= 7) return 'text-emerald-400'
  if (score >= 4) return 'text-amber-400'
  return 'text-red-400'
}

// ---------------------------------------------------------------------------
// Status Card (Morning / Evening)
// ---------------------------------------------------------------------------
function StatusCard({ type, todayEntry, onStart, onEdit }) {
  const isMorn = type === 'morning'
  const Icon = isMorn ? Sun : Moon
  const title = isMorn ? 'Ochtend check-in' : 'Avond check-out'
  const subtitle = isMorn
    ? 'Stel je intentie en energie in voor de dag'
    : 'Reflecteer op je dag en sluit af'
  const done = Boolean(todayEntry)

  return (
    <div
      className={cn(
        'glass-card p-5 flex flex-col gap-3',
        done ? 'border-emerald-500/20' : 'border-[#2a2a2a]'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isMorn ? 'bg-amber-400/15' : 'bg-indigo-400/15'
          )}
        >
          <Icon size={18} className={isMorn ? 'text-amber-400' : 'text-indigo-400'} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair text-[#F5ECD7] text-sm font-semibold">{title}</h3>
          <p className="text-xs text-[#F5ECD7]/45 mt-0.5">{subtitle}</p>
        </div>
        {done ? (
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
        ) : (
          <Circle size={20} className="text-[#F5ECD7]/20 shrink-0" />
        )}
      </div>

      {done && todayEntry ? (
        <div className="space-y-2">
          {todayEntry.intention && (
            <p className="text-xs text-[#F5ECD7]/60 italic line-clamp-2">
              "{todayEntry.intention || todayEntry.reflection}"
            </p>
          )}
          {todayEntry.reflection && !todayEntry.intention && (
            <p className="text-xs text-[#F5ECD7]/60 italic line-clamp-2">
              "{todayEntry.reflection}"
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            {todayEntry.mood !== undefined && (
              <span className="flex items-center gap-1 text-xs text-[#F5ECD7]/50">
                <Heart size={11} className="text-pink-400" />
                Stemming:{' '}
                <span className={cn('font-medium', scoreColor(todayEntry.mood + 5))}>
                  {todayEntry.mood > 0 ? `+${todayEntry.mood}` : todayEntry.mood}
                </span>
              </span>
            )}
            {todayEntry.energy !== undefined && (
              <span className="flex items-center gap-1 text-xs text-[#F5ECD7]/50">
                <Zap size={11} className="text-amber-400" />
                Energie:{' '}
                <span className={cn('font-medium', scoreColor(todayEntry.energy))}>
                  {todayEntry.energy}/10
                </span>
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="btn-ghost text-xs h-7 px-3 mt-1"
            onClick={() => onEdit(todayEntry)}
          >
            <Edit3 size={12} className="mr-1" />
            Bewerken
          </Button>
        </div>
      ) : (
        <Button className="btn-primary w-full" onClick={onStart}>
          <Plus size={14} className="mr-2" />
          {isMorn ? 'Check-in starten' : 'Check-out starten'}
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Gratitude Inputs (3 items)
// ---------------------------------------------------------------------------
function GratitudeInputs({ values, onChange }) {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#C97D3A]/20 text-[#C97D3A] text-xs flex items-center justify-center shrink-0 font-medium">
            {i + 1}
          </span>
          <Input
            className="input-base flex-1"
            placeholder={`Dankbaar voor…`}
            value={values[i] ?? ''}
            onChange={(e) => {
              const next = [...values]
              next[i] = e.target.value
              onChange(next)
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Morning Modal
// ---------------------------------------------------------------------------
function MorningModal({ open, onClose, entry, onSave }) {
  const isEdit = Boolean(entry?.id)

  const [intention, setIntention] = useState(entry?.intention ?? '')
  const [gratitude, setGratitude] = useState(entry?.gratitude ?? ['', '', ''])
  const [mood, setMood] = useState(entry?.mood ?? 0)
  const [energy, setEnergy] = useState(entry?.energy ?? 5)

  useEffect(() => {
    if (open) {
      setIntention(entry?.intention ?? '')
      setGratitude(entry?.gratitude ?? ['', '', ''])
      setMood(entry?.mood ?? 0)
      setEnergy(entry?.energy ?? 5)
    }
  }, [entry?.id, open])

  const handleSave = () => {
    onSave({
      ...(entry ?? {}),
      type: 'morning',
      intention: intention.trim(),
      gratitude: gratitude.map((g) => g.trim()).filter(Boolean),
      mood,
      energy,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#F5ECD7] flex items-center gap-2">
            <Sun size={18} className="text-amber-400" />
            {isEdit ? 'Check-in bewerken' : 'Ochtend check-in'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Intention */}
          <div>
            <Label className="label-base">Intentie voor vandaag</Label>
            <Textarea
              className="input-base mt-1 min-h-[80px] resize-none"
              placeholder="Wat wil je vandaag bereiken of voelen?"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
            />
          </div>

          {/* Gratitude */}
          <div>
            <Label className="label-base">3 dingen dankbaar voor</Label>
            <div className="mt-2">
              <GratitudeInputs values={gratitude} onChange={setGratitude} />
            </div>
          </div>

          {/* Mood Slider */}
          <div>
            <Label className="label-base">
              Stemming nu:{' '}
              <span className="text-[#C97D3A] font-semibold">
                {mood > 0 ? `+${mood}` : mood}
              </span>
            </Label>
            <Slider
              min={-5}
              max={5}
              step={1}
              value={[mood]}
              onValueChange={([v]) => setMood(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/30 mt-1 px-1">
              <span>-5</span>
              <span>0</span>
              <span>+5</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <Label className="label-base">
              Energieniveau:{' '}
              <span className="text-[#C97D3A] font-semibold">{energy}/10</span>
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[energy]}
              onValueChange={([v]) => setEnergy(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/30 mt-1 px-1">
              <span>Uitgeput</span>
              <span>Vol energie</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>
            Annuleren
          </Button>
          <Button className="btn-primary" onClick={handleSave}>
            {isEdit ? 'Opslaan' : 'Check-in voltooien'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Evening Modal
// ---------------------------------------------------------------------------
function EveningModal({ open, onClose, entry, onSave }) {
  const isEdit = Boolean(entry?.id)

  const [reflection, setReflection] = useState(entry?.reflection ?? '')
  const [gratitude, setGratitude] = useState(entry?.gratitude ?? ['', '', ''])
  const [mood, setMood] = useState(entry?.mood ?? 0)
  const [energy, setEnergy] = useState(entry?.energy ?? 5)

  useEffect(() => {
    if (open) {
      setReflection(entry?.reflection ?? '')
      setGratitude(entry?.gratitude ?? ['', '', ''])
      setMood(entry?.mood ?? 0)
      setEnergy(entry?.energy ?? 5)
    }
  }, [entry?.id, open])

  const handleSave = () => {
    onSave({
      ...(entry ?? {}),
      type: 'evening',
      reflection: reflection.trim(),
      gratitude: gratitude.map((g) => g.trim()).filter(Boolean),
      mood,
      energy,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#F5ECD7] flex items-center gap-2">
            <Moon size={18} className="text-indigo-400" />
            {isEdit ? 'Check-out bewerken' : 'Avond check-out'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Reflection */}
          <div>
            <Label className="label-base">Reflectie op de dag</Label>
            <Textarea
              className="input-base mt-1 min-h-[80px] resize-none"
              placeholder="Hoe was je dag? Wat ging goed, wat kon beter?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>

          {/* Gratitude */}
          <div>
            <Label className="label-base">3 mooie momenten van vandaag</Label>
            <div className="mt-2">
              <GratitudeInputs values={gratitude} onChange={setGratitude} />
            </div>
          </div>

          {/* Mood Slider */}
          <div>
            <Label className="label-base">
              Stemming aan het einde van de dag:{' '}
              <span className="text-[#C97D3A] font-semibold">
                {mood > 0 ? `+${mood}` : mood}
              </span>
            </Label>
            <Slider
              min={-5}
              max={5}
              step={1}
              value={[mood]}
              onValueChange={([v]) => setMood(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/30 mt-1 px-1">
              <span>-5</span>
              <span>0</span>
              <span>+5</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <Label className="label-base">
              Energieniveau:{' '}
              <span className="text-[#C97D3A] font-semibold">{energy}/10</span>
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[energy]}
              onValueChange={([v]) => setEnergy(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/30 mt-1 px-1">
              <span>Uitgeput</span>
              <span>Vol energie</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>
            Annuleren
          </Button>
          <Button className="btn-primary" onClick={handleSave}>
            {isEdit ? 'Opslaan' : 'Check-out voltooien'}
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
          Weet je zeker dat je deze check-in/out wilt verwijderen?
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
// Recent Check-in Row
// ---------------------------------------------------------------------------
function RecentRow({ entry, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const isMorn = entry.type === 'morning'
  const Icon = isMorn ? Sun : Moon

  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
            isMorn ? 'bg-amber-400/15' : 'bg-indigo-400/15'
          )}
        >
          <Icon size={15} className={isMorn ? 'text-amber-400' : 'text-indigo-400'} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#F5ECD7]/75">
              {isMorn ? 'Ochtend check-in' : 'Avond check-out'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#F5ECD7]/55 flex items-center gap-1">
                <Calendar size={10} />
                {formatRelative(entry.createdAt)}
              </span>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1 rounded text-[#F5ECD7]/50 hover:text-[#F5ECD7]"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {entry.mood !== undefined && (
              <span className="text-xs text-[#F5ECD7]/45 flex items-center gap-1">
                <Heart size={10} className="text-pink-400" />
                {entry.mood > 0 ? `+${entry.mood}` : entry.mood}
              </span>
            )}
            {entry.energy !== undefined && (
              <span className="text-xs text-[#F5ECD7]/45 flex items-center gap-1">
                <Zap size={10} className="text-amber-400" />
                {entry.energy}/10
              </span>
            )}
          </div>

          {expanded && (
            <div className="mt-3 space-y-2 border-t border-[#2a2a2a] pt-3">
              {(entry.intention || entry.reflection) && (
                <p className="text-xs text-[#F5ECD7]/60 italic">
                  "{entry.intention || entry.reflection}"
                </p>
              )}
              {entry.gratitude?.length > 0 && (
                <div>
                  <p className="text-xs text-[#F5ECD7]/40 mb-1 uppercase tracking-wider">Dankbaarheid</p>
                  <ul className="space-y-0.5">
                    {entry.gratitude.map((g, i) => (
                      <li key={i} className="text-xs text-[#F5ECD7]/60 flex gap-2">
                        <span className="text-[#C97D3A]">{i + 1}.</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-[#F5ECD7]/[0.07]">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#C97D3A]/10 text-[#C97D3A] text-sm font-medium hover:bg-[#C97D3A]/20 active:bg-[#C97D3A]/30 transition-colors"
          onClick={() => onEdit(entry)}
        >
          <Edit3 size={15} />
          Bewerken
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
          onClick={() => onDelete(entry)}
        >
          <Trash2 size={15} />
          Verwijderen
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main CheckIn Component
// ---------------------------------------------------------------------------
export default function CheckIn() {
  const { checkins, addCheckin, updateCheckin, deleteCheckin } = useAppStore()
  const { toast } = useToast()

  const [morningModalOpen, setMorningModalOpen] = useState(false)
  const [eveningModalOpen, setEveningModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const sorted = useMemo(
    () => [...(checkins ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [checkins]
  )

  const todayMorning = useMemo(
    () => sorted.find((c) => c.type === 'morning' && isToday(c.date)),
    [sorted]
  )
  const todayEvening = useMemo(
    () => sorted.find((c) => c.type === 'evening' && isToday(c.date)),
    [sorted]
  )

  const recent = useMemo(() => sorted.slice(0, 14), [sorted])

  const handleSave = (data) => {
    if (data.id) {
      updateCheckin(data.id, { ...data, updatedAt: new Date().toISOString() })
      toast({ title: 'Check-in bijgewerkt' })
    } else {
      addCheckin({
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      toast({
        title:
          data.type === 'morning'
            ? 'Ochtend check-in voltooid'
            : 'Avond check-out voltooid',
      })
    }
    setMorningModalOpen(false)
    setEveningModalOpen(false)
    setEditEntry(null)
  }

  const handleEdit = (entry) => {
    setEditEntry(entry)
    if (entry.type === 'morning') {
      setMorningModalOpen(true)
    } else {
      setEveningModalOpen(true)
    }
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteCheckin(deleteTarget.id)
    toast({ title: 'Verwijderd', variant: 'destructive' })
    setDeleteTarget(null)
  }

  return (
    <div className="relative min-h-full pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Sun size={22} className="text-[#C97D3A]" />
          <h1 className="section-title">Dagelijkse check-in</h1>
        </div>
        <p className="section-subtitle">Begin en sluit elke dag bewust af.</p>
      </div>

      {/* Today Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatusCard
          type="morning"
          todayEntry={todayMorning}
          onStart={() => {
            setEditEntry(null)
            setMorningModalOpen(true)
          }}
          onEdit={handleEdit}
        />
        <StatusCard
          type="evening"
          todayEntry={todayEvening}
          onStart={() => {
            setEditEntry(null)
            setEveningModalOpen(true)
          }}
          onEdit={handleEdit}
        />
      </div>

      {/* Recent Check-ins */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wider text-[#F5ECD7]/40 mb-3 font-medium">
            Recente check-ins
          </h2>
          <div className="space-y-2">
            {recent.map((entry) => (
              <RecentRow
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={(e) => setDeleteTarget(e)}
              />
            ))}
          </div>
        </div>
      )}

      {recent.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="text-5xl mb-3 opacity-40">☀️</div>
          <p className="text-[#F5ECD7]/40 text-sm">Nog geen check-ins. Begin vandaag!</p>
        </div>
      )}

      {/* Morning Modal */}
      <MorningModal
        open={morningModalOpen}
        onClose={() => {
          setMorningModalOpen(false)
          setEditEntry(null)
        }}
        entry={editEntry?.type === 'morning' ? editEntry : null}
        onSave={handleSave}
      />

      {/* Evening Modal */}
      <EveningModal
        open={eveningModalOpen}
        onClose={() => {
          setEveningModalOpen(false)
          setEditEntry(null)
        }}
        entry={editEntry?.type === 'evening' ? editEntry : null}
        onSave={handleSave}
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
