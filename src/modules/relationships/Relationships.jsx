import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
  Users, Plus, Pencil, Trash2, Heart, Zap,
  TrendingUp, TrendingDown, Minus, Star, MessageCircle
} from 'lucide-react'

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const INTERACTION_TYPES = ['Gesprek', 'Conflict', 'Steun', 'Sociaal', 'Werk', 'Anders']

const typeColor = (type) => {
  const map = {
    Gesprek:  'bg-blue-900/50 text-blue-300 border-blue-800',
    Conflict: 'bg-red-900/50 text-red-300 border-red-800',
    Steun:    'bg-green-900/50 text-green-300 border-green-800',
    Sociaal:  'bg-purple-900/50 text-purple-300 border-purple-800',
    Werk:     'bg-slate-700/50 text-slate-300 border-slate-600',
    Anders:   'bg-[#2a2a2a] text-[#F5ECD7]/60 border-[#3a3a3a]',
  }
  return map[type] || map.Anders
}

const impactColor = (val) => {
  if (val >= 3) return 'text-green-400'
  if (val >= 1) return 'text-green-300/70'
  if (val === 0) return 'text-[#F5ECD7]/40'
  if (val >= -2) return 'text-amber-400'
  return 'text-red-400'
}

const impactBadgeColor = (val) => {
  if (val >= 2) return 'bg-green-900/50 text-green-300 border-green-800'
  if (val >= 0) return 'bg-[#2a2a2a] text-[#F5ECD7]/60 border-[#3a3a3a]'
  return 'bg-red-900/50 text-red-300 border-red-800'
}

const signedVal = (v) => v > 0 ? `+${v}` : `${v}`

const ImpactIcon = ({ val, size = 'w-4 h-4' }) => {
  if (val >= 2) return <TrendingUp className={cn(size, 'text-green-400')} />
  if (val <= -2) return <TrendingDown className={cn(size, 'text-red-400')} />
  return <Minus className={cn(size, 'text-[#F5ECD7]/30')} />
}

// ─── Summary Stats ────────────────────────────────────────────────────────────

function SummaryStats({ entries }) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const thisMonth = entries.filter(e => new Date(e.date) >= startOfMonth)
  const avgImpact = thisMonth.length > 0
    ? (thisMonth.reduce((sum, e) => sum + (e.emotionalImpact || 0), 0) / thisMonth.length).toFixed(1)
    : null

  // Top energy giver: person with highest total energyDelta
  const personEnergy = {}
  entries.forEach(e => {
    if (e.personName) {
      personEnergy[e.personName] = (personEnergy[e.personName] || 0) + (e.energyDelta || 0)
    }
  })
  const topGiver = Object.entries(personEnergy).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="glass-card p-4 text-center">
        <p className="label-base mb-1">Interacties</p>
        <p className="font-['Playfair_Display'] text-2xl text-[#F5ECD7]">{thisMonth.length}</p>
        <p className="text-xs text-[#F5ECD7]/40 mt-0.5">deze maand</p>
      </div>
      <div className="glass-card p-4 text-center">
        <p className="label-base mb-1">Gem. Impact</p>
        {avgImpact !== null ? (
          <>
            <p className={cn('font-["Playfair_Display"] text-2xl', impactColor(parseFloat(avgImpact)))}>
              {avgImpact > 0 ? '+' : ''}{avgImpact}
            </p>
            <p className="text-xs text-[#F5ECD7]/40 mt-0.5">emotioneel</p>
          </>
        ) : (
          <p className="text-[#F5ECD7]/30 text-sm mt-2">—</p>
        )}
      </div>
      <div className="glass-card p-4 text-center">
        <p className="label-base mb-1">Energie Gever</p>
        {topGiver ? (
          <>
            <p className="font-['Playfair_Display'] text-base text-[#F5ECD7] truncate" title={topGiver[0]}>
              {topGiver[0]}
            </p>
            <p className="text-xs text-green-400 mt-0.5">{signedVal(topGiver[1])} energie</p>
          </>
        ) : (
          <p className="text-[#F5ECD7]/30 text-sm mt-2">—</p>
        )}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const emptyRelationship = {
  personName: '',
  interactionType: 'Gesprek',
  emotionalImpact: 0,
  energyDelta: 0,
  notes: '',
}

function RelationshipModal({ open, onClose, initial, onSave, previousPersons }) {
  const [form, setForm] = useState(initial || emptyRelationship)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.personName.trim()) return
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl">
            {initial ? 'Interactie aanpassen' : 'Interactie loggen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-base">Persoon</Label>
            <Input
              className="input-base mt-1"
              placeholder="Naam van de persoon..."
              value={form.personName}
              onChange={e => set('personName', e.target.value)}
              list="persons-datalist"
            />
            {previousPersons.length > 0 && (
              <datalist id="persons-datalist">
                {previousPersons.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            )}
          </div>

          <div>
            <Label className="label-base">Type interactie</Label>
            <Select value={form.interactionType} onValueChange={v => set('interactionType', v)}>
              <SelectTrigger className="input-base mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7]">
                {INTERACTION_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="label-base">
              Emotionele impact: {signedVal(form.emotionalImpact)}
            </Label>
            <Slider
              className="mt-2"
              min={-5} max={5} step={1}
              value={[form.emotionalImpact]}
              onValueChange={([v]) => set('emotionalImpact', v)}
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/40 mt-1">
              <span>-5 Zwaar</span><span>0 Neutraal</span><span>+5 Positief</span>
            </div>
          </div>

          <div>
            <Label className="label-base">
              Energie delta: {signedVal(form.energyDelta)}
            </Label>
            <Slider
              className="mt-2"
              min={-5} max={5} step={1}
              value={[form.energyDelta]}
              onValueChange={([v]) => set('energyDelta', v)}
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/40 mt-1">
              <span>-5 Uitgeput</span><span>0 Gelijk</span><span>+5 Opgeladen</span>
            </div>
          </div>

          <div>
            <Label className="label-base">Notities</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={3}
              placeholder="Wat werd er besproken? Hoe voelde het?"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave} disabled={!form.personName.trim()}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function RelationshipCard({ entry, onEdit, onDelete }) {
  return (
    <div className="glass-card-hover p-4 flex items-start gap-4 group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#C97D3A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[#C97D3A] font-bold text-sm">
          {(entry.personName || '?').charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Top row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-[#F5ECD7]">{entry.personName}</span>
          <Badge className={cn('text-xs border', typeColor(entry.interactionType))}>
            {entry.interactionType}
          </Badge>
        </div>

        {/* Impact indicators */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#F5ECD7]/40" />
            <span className={cn('text-sm font-medium', impactColor(entry.emotionalImpact))}>
              {signedVal(entry.emotionalImpact)}
            </span>
            <span className="text-xs text-[#F5ECD7]/30">emotie</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#F5ECD7]/40" />
            <span className={cn('text-sm font-medium', impactColor(entry.energyDelta))}>
              {signedVal(entry.energyDelta)}
            </span>
            <span className="text-xs text-[#F5ECD7]/30">energie</span>
          </div>
          <ImpactIcon val={entry.emotionalImpact} />
        </div>

        {entry.notes && (
          <p className="text-xs text-[#F5ECD7]/40 mt-1.5 line-clamp-1">{entry.notes}</p>
        )}
        <p className="text-xs text-[#F5ECD7]/30 mt-1">{formatRelative(entry.createdAt)}</p>
      </div>

      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-[#F5ECD7]/[0.07]">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#C97D3A]/10 text-[#C97D3A] text-sm font-medium hover:bg-[#C97D3A]/20 active:bg-[#C97D3A]/30 transition-colors"
          onClick={() => onEdit(entry)}
        >
          <Pencil className="w-4 h-4" />
          Bewerken
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 className="w-4 h-4" />
          Verwijderen
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Relationships() {
  const { relationships, addRelationship, updateRelationship, deleteRelationship } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const entries = useMemo(() =>
    [...(relationships || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [relationships]
  )

  const previousPersons = useMemo(() => {
    const names = new Set(entries.map(e => e.personName).filter(Boolean))
    return Array.from(names).sort()
  }, [entries])

  const handleSave = (data) => {
    if (editing) {
      updateRelationship(editing.id, data)
      toast({ title: 'Interactie bijgewerkt' })
    } else {
      addRelationship(data)
      toast({ title: 'Interactie gelogd', description: `Met ${data.personName}` })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => { deleteRelationship(id); toast({ title: 'Verwijderd' }) }
  const handleAdd = () => { setEditing(null); setModalOpen(true) }

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Users className="w-7 h-7 text-[#C97D3A]" />
            Relaties
          </h1>
          <p className="section-subtitle mt-1">
            Hoe beïnvloeden de mensen om je heen je energie en emoties?
          </p>
        </div>
        <Button className="btn-primary flex-shrink-0" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Loggen
        </Button>
      </div>

      {/* Stats */}
      {entries.length > 0 && <SummaryStats entries={entries} />}

      {/* List */}
      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-4">
          <Users className="w-12 h-12 mx-auto text-[#C97D3A] opacity-40" />
          <div>
            <p className="font-['Playfair_Display'] text-xl text-[#F5ECD7]">Nog geen interacties gelogd</p>
            <p className="text-[#F5ECD7]/50 text-sm max-w-sm mx-auto mt-2">
              Relaties vormen een grote invloed op je welzijn. Ontdek wie je energie geeft,
              wie je uitput, en welke patronen er spelen in je sociale omgeving.
            </p>
          </div>
          <Button className="btn-primary" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Eerste interactie loggen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="section-subtitle">
            {entries.length} interactie{entries.length !== 1 ? 's' : ''} gelogd
          </p>
          {entries.map(entry => (
            <RelationshipCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <RelationshipModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing}
        onSave={handleSave}
        previousPersons={previousPersons}
      />
    </div>
  )
}
