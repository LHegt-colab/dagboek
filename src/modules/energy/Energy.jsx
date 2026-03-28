import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/store/useAppStore'
import { formatRelative, formatDate } from '@/utils/dateHelpers'
import { cn } from '@/lib/utils'
import {
  Zap, Plus, Pencil, Trash2, Flame, Palette,
  Battery, Clock, BarChart2, Star
} from 'lucide-react'

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const ENTRY_TYPES = ['Flow Moment', 'Creatieve Activiteit', 'Energiebron']

const typeConfig = {
  'Flow Moment': {
    icon: Flame,
    color: 'bg-orange-900/50 text-orange-300 border-orange-800',
    accent: 'text-orange-400',
    bg: 'bg-orange-900/20',
  },
  'Creatieve Activiteit': {
    icon: Palette,
    color: 'bg-purple-900/50 text-purple-300 border-purple-800',
    accent: 'text-purple-400',
    bg: 'bg-purple-900/20',
  },
  'Energiebron': {
    icon: Battery,
    color: 'bg-green-900/50 text-green-300 border-green-800',
    accent: 'text-green-400',
    bg: 'bg-green-900/20',
  },
}

const getTypeConfig = (type) => typeConfig[type] || typeConfig['Flow Moment']

const energyLevelColor = (level) => {
  if (level >= 8) return 'bg-green-500'
  if (level >= 5) return 'bg-amber-500'
  return 'bg-red-500'
}

const energyLevelText = (level) => {
  if (level >= 8) return 'Hoog'
  if (level >= 5) return 'Gemiddeld'
  return 'Laag'
}

const formatMinutes = (mins) => {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}u ${m}m`
  if (h > 0) return `${h}u`
  return `${m}m`
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatsCard({ entries }) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const thisWeek = entries.filter(e => new Date(e.date) >= startOfWeek)

  const totalFlowMinutes = thisWeek
    .filter(e => e.entryType === 'Flow Moment')
    .reduce((sum, e) => sum + (e.durationMinutes || 0), 0)

  const avgEnergy = entries.length > 0
    ? (entries.reduce((sum, e) => sum + (e.energyLevel || 0), 0) / entries.length).toFixed(1)
    : null

  const typeCounts = ENTRY_TYPES.reduce((acc, type) => {
    acc[type] = entries.filter(e => e.entryType === type).length
    return acc
  }, {})

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="font-['Playfair_Display'] text-base text-[#F5ECD7]">Overzicht</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="label-base mb-1">Flow tijd</p>
          <p className="font-['Playfair_Display'] text-xl text-orange-400">
            {formatMinutes(totalFlowMinutes)}
          </p>
          <p className="text-xs text-[#F5ECD7]/30 mt-0.5">deze week</p>
        </div>
        <div className="text-center">
          <p className="label-base mb-1">Gem. energie</p>
          {avgEnergy !== null ? (
            <>
              <p className={cn('font-["Playfair_Display"] text-xl',
                parseFloat(avgEnergy) >= 7 ? 'text-green-400' :
                parseFloat(avgEnergy) >= 5 ? 'text-amber-400' : 'text-red-400'
              )}>
                {avgEnergy}/10
              </p>
              <p className="text-xs text-[#F5ECD7]/30 mt-0.5">alle tijd</p>
            </>
          ) : (
            <p className="text-[#F5ECD7]/30 text-base mt-1">—</p>
          )}
        </div>
        <div className="text-center">
          <p className="label-base mb-2">Per type</p>
          <div className="space-y-1">
            {ENTRY_TYPES.map(type => {
              const cfg = getTypeConfig(type)
              const Icon = cfg.icon
              return (
                <div key={type} className="flex items-center gap-1.5 justify-center">
                  <Icon className={cn('w-3 h-3', cfg.accent)} />
                  <span className="text-xs text-[#F5ECD7]/50">{typeCounts[type]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const emptyEntry = {
  entryType: 'Flow Moment',
  title: '',
  description: '',
  durationMinutes: 30,
  energyLevel: 7,
}

function EnergyModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptyEntry)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  const cfg = getTypeConfig(form.entryType)
  const Icon = cfg.icon

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl flex items-center gap-2">
            <Icon className={cn('w-5 h-5', cfg.accent)} />
            {initial ? 'Moment aanpassen' : 'Moment toevoegen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-base">Type</Label>
            <Select value={form.entryType} onValueChange={v => set('entryType', v)}>
              <SelectTrigger className="input-base mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7]">
                {ENTRY_TYPES.map(t => {
                  const c = getTypeConfig(t)
                  const TIcon = c.icon
                  return (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2">
                        <TIcon className={cn('w-3.5 h-3.5', c.accent)} />
                        {t}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="label-base">Titel</Label>
            <Input
              className="input-base mt-1"
              placeholder="Geef dit moment een naam..."
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div>
            <Label className="label-base">Beschrijving</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={3}
              placeholder="Wat deed je? Hoe voelde het? Waarom was dit waardevol?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div>
            <Label className="label-base">Duur (minuten)</Label>
            <Input
              type="number"
              className="input-base mt-1"
              min={1}
              max={480}
              placeholder="bijv. 45"
              value={form.durationMinutes}
              onChange={e => set('durationMinutes', parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label className="label-base">
              Energieniveau: {form.energyLevel}/10 ({energyLevelText(form.energyLevel)})
            </Label>
            <Slider
              className="mt-2"
              min={1} max={10} step={1}
              value={[form.energyLevel]}
              onValueChange={([v]) => set('energyLevel', v)}
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/40 mt-1">
              <span>1 Laag</span><span>10 Maximaal</span>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave} disabled={!form.title.trim()}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function EnergyCard({ entry, onEdit, onDelete }) {
  const cfg = getTypeConfig(entry.entryType)
  const Icon = cfg.icon

  return (
    <div className="glass-card-hover p-4 flex items-start gap-4 group">
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg)}>
        <Icon className={cn('w-5 h-5', cfg.accent)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-[#F5ECD7]">{entry.title}</span>
          <Badge className={cn('text-xs border', cfg.color)}>{entry.entryType}</Badge>
        </div>

        {/* Energy bar */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', energyLevelColor(entry.energyLevel))}
              style={{ width: `${(entry.energyLevel / 10) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#F5ECD7]/50 flex-shrink-0 w-10 text-right">
            {entry.energyLevel}/10
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#F5ECD7]/40">
          {entry.durationMinutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatMinutes(entry.durationMinutes)}
            </span>
          )}
          <span>{formatRelative(entry.date)}</span>
        </div>

        {entry.description && (
          <p className="text-xs text-[#F5ECD7]/40 mt-1 line-clamp-1">{entry.description}</p>
        )}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8" onClick={() => onEdit(entry)}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8 text-red-400 hover:text-red-300" onClick={() => onDelete(entry.id)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ─── Tab Section ──────────────────────────────────────────────────────────────

function TypeSection({ type, entries, onEdit, onDelete, onAdd }) {
  const cfg = getTypeConfig(type)
  const Icon = cfg.icon
  const filtered = entries.filter(e => e.entryType === type)

  const emptyMessages = {
    'Flow Moment': {
      title: 'Nog geen flow momenten',
      sub: 'Flow is de staat van volledige onderdompeling. Wanneer vergat je de tijd? Wat gaf je die diepe concentratie en voldoening?',
    },
    'Creatieve Activiteit': {
      title: 'Nog geen creatieve activiteiten',
      sub: 'Creativiteit voert je terug naar jezelf. Schrijven, tekenen, muziek, koken — elk creatief moment telt.',
    },
    'Energiebron': {
      title: 'Nog geen energiebronnen',
      sub: 'Wat laadt jou op? Een wandeling, een goed gesprek, muziek luisteren — ontdek je persoonlijke energiebronnen.',
    },
  }

  const msg = emptyMessages[type]

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <div className="glass-card p-8 text-center space-y-3">
          <Icon className={cn('w-10 h-10 mx-auto opacity-40', cfg.accent)} />
          <p className="font-['Playfair_Display'] text-base text-[#F5ECD7]">{msg.title}</p>
          <p className="text-[#F5ECD7]/50 text-sm max-w-xs mx-auto">{msg.sub}</p>
          <Button className="btn-primary mt-1" onClick={() => onAdd(type)}>
            <Plus className="w-4 h-4 mr-1" /> Toevoegen
          </Button>
        </div>
      ) : (
        <>
          <p className="section-subtitle">
            {filtered.length} {type.toLowerCase()}{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map(entry => (
            <EnergyCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Energy() {
  const { energy, addEnergyEntry, updateEnergyEntry, deleteEnergyEntry } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [defaultType, setDefaultType] = useState('Flow Moment')

  const entries = useMemo(() =>
    [...(energy || [])].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [energy]
  )

  const handleSave = (data) => {
    if (editing) {
      updateEnergyEntry(editing.id, data)
      toast({ title: 'Moment bijgewerkt', description: data.title })
    } else {
      addEnergyEntry(data)
      toast({ title: 'Moment gelogd', description: data.title })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => { deleteEnergyEntry(id); toast({ title: 'Verwijderd' }) }

  const handleAdd = (type = 'Flow Moment') => {
    setEditing(null)
    setDefaultType(type)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Zap className="w-7 h-7 text-[#C97D3A]" />
            Energie &amp; Flow
          </h1>
          <p className="section-subtitle mt-1">
            Ontdek wat je oplaadt, wat flow geeft en waar je creatieve kracht vandaan komt.
          </p>
        </div>
        <Button className="btn-primary flex-shrink-0" onClick={() => handleAdd()}>
          <Plus className="w-4 h-4 mr-1" /> Toevoegen
        </Button>
      </div>

      {/* Stats */}
      {entries.length > 0 && <StatsCard entries={entries} />}

      {/* Tabs */}
      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-5">
          <div className="flex justify-center gap-4">
            <Flame className="w-10 h-10 text-orange-400 opacity-50" />
            <Palette className="w-10 h-10 text-purple-400 opacity-50" />
            <Battery className="w-10 h-10 text-green-400 opacity-50" />
          </div>
          <div>
            <p className="font-['Playfair_Display'] text-xl text-[#F5ECD7]">
              Begin je energie dagboek
            </p>
            <p className="text-[#F5ECD7]/50 text-sm max-w-sm mx-auto mt-2">
              Weet jij wat jou oplaadt? Door flow momenten, creatieve activiteiten en energiebronnen
              bij te houden, ontdek je wat het beste bij je past.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => handleAdd('Flow Moment')}
              className="glass-card p-4 text-center hover:border-orange-800/50 transition-colors cursor-pointer"
            >
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-xs text-[#F5ECD7]/60">Flow Moment</p>
            </button>
            <button
              type="button"
              onClick={() => handleAdd('Creatieve Activiteit')}
              className="glass-card p-4 text-center hover:border-purple-800/50 transition-colors cursor-pointer"
            >
              <Palette className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-[#F5ECD7]/60">Creatief</p>
            </button>
            <button
              type="button"
              onClick={() => handleAdd('Energiebron')}
              className="glass-card p-4 text-center hover:border-green-800/50 transition-colors cursor-pointer"
            >
              <Battery className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-[#F5ECD7]/60">Energiebron</p>
            </button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="flow">
          <TabsList className="bg-[#141414] border border-[#2a2a2a] p-1 rounded-lg">
            <TabsTrigger
              value="flow"
              className="data-[state=active]:bg-orange-900/60 data-[state=active]:text-orange-300 text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors"
            >
              <Flame className="w-3.5 h-3.5 mr-1.5" />
              Flow
              <span className="ml-1.5 text-xs opacity-60">
                ({entries.filter(e => e.entryType === 'Flow Moment').length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="creatief"
              className="data-[state=active]:bg-purple-900/60 data-[state=active]:text-purple-300 text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors"
            >
              <Palette className="w-3.5 h-3.5 mr-1.5" />
              Creatief
              <span className="ml-1.5 text-xs opacity-60">
                ({entries.filter(e => e.entryType === 'Creatieve Activiteit').length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="bronnen"
              className="data-[state=active]:bg-green-900/60 data-[state=active]:text-green-300 text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors"
            >
              <Battery className="w-3.5 h-3.5 mr-1.5" />
              Bronnen
              <span className="ml-1.5 text-xs opacity-60">
                ({entries.filter(e => e.entryType === 'Energiebron').length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-6">
            <TypeSection
              type="Flow Moment"
              entries={entries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          </TabsContent>
          <TabsContent value="creatief" className="mt-6">
            <TypeSection
              type="Creatieve Activiteit"
              entries={entries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          </TabsContent>
          <TabsContent value="bronnen" className="mt-6">
            <TypeSection
              type="Energiebron"
              entries={entries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          </TabsContent>
        </Tabs>
      )}

      <EnergyModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing || { ...emptyEntry, entryType: defaultType }}
        onSave={handleSave}
      />
    </div>
  )
}
