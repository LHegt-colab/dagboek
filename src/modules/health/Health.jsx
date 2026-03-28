import { useState } from 'react'
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
import SleepChart from '@/components/charts/SleepChart'
import {
  Dumbbell, Utensils, Moon, Activity,
  Plus, Pencil, Trash2, X, ChevronRight,
  Clock, Zap, Heart, AlertCircle
} from 'lucide-react'

// ─── Sport Tab ────────────────────────────────────────────────────────────────

const INTENSITY_OPTIONS = ['Laag', 'Gemiddeld', 'Hoog']

const intensityColor = (intensity) => {
  if (intensity === 'Hoog') return 'bg-red-900/50 text-red-300 border-red-800'
  if (intensity === 'Gemiddeld') return 'bg-amber-900/50 text-amber-300 border-amber-800'
  return 'bg-green-900/50 text-green-300 border-green-800'
}

const emptySport = { activityName: '', durationMinutes: 30, intensity: 'Gemiddeld', notes: '' }

function SportModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptySport)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.activityName.trim()) return
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl">
            {initial ? 'Sport aanpassen' : 'Sport toevoegen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-base">Activiteit</Label>
            <Input
              className="input-base mt-1"
              placeholder="bijv. Hardlopen, Zwemmen, Yoga..."
              value={form.activityName}
              onChange={e => set('activityName', e.target.value)}
            />
          </div>
          <div>
            <Label className="label-base">Duur (minuten): {form.durationMinutes}</Label>
            <Slider
              className="mt-2"
              min={5} max={180} step={5}
              value={[form.durationMinutes]}
              onValueChange={([v]) => set('durationMinutes', v)}
            />
          </div>
          <div>
            <Label className="label-base">Intensiteit</Label>
            <Select value={form.intensity} onValueChange={v => set('intensity', v)}>
              <SelectTrigger className="input-base mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7]">
                {INTENSITY_OPTIONS.map(o => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="label-base">Notities</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={3}
              placeholder="Hoe voelde het? Bijzonderheden..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave} disabled={!form.activityName.trim()}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SportTab() {
  const { healthSport, addSportEntry, updateSportEntry, deleteSportEntry } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = (data) => {
    if (editing) {
      updateSportEntry(editing.id, data)
      toast({ title: 'Sport bijgewerkt', description: data.activityName })
    } else {
      addSportEntry(data)
      toast({ title: 'Sport toegevoegd', description: data.activityName })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => {
    deleteSportEntry(id)
    toast({ title: 'Verwijderd' })
  }
  const handleAdd = () => { setEditing(null); setModalOpen(true) }

  const entries = [...(healthSport || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-subtitle">
          {entries.length} activiteit{entries.length !== 1 ? 'en' : ''} gelogd
        </p>
        <Button className="btn-primary" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Toevoegen
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-3">
          <Dumbbell className="w-10 h-10 mx-auto text-[#C97D3A] opacity-50" />
          <p className="font-['Playfair_Display'] text-lg text-[#F5ECD7]">Nog geen sportactiviteiten</p>
          <p className="text-[#F5ECD7]/50 text-sm max-w-xs mx-auto">
            Houd je beweging bij. Van een korte wandeling tot een intensieve training — alles telt.
          </p>
          <Button className="btn-primary mt-2" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Eerste activiteit toevoegen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="glass-card-hover p-4 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#C97D3A]/20 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-5 h-5 text-[#C97D3A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-[#F5ECD7]">{entry.activityName}</span>
                  <Badge className={cn('text-xs border', intensityColor(entry.intensity))}>
                    {entry.intensity}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-[#F5ECD7]/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {entry.durationMinutes} min
                  </span>
                  <span>{formatRelative(entry.date)}</span>
                </div>
                {entry.notes && (
                  <p className="text-xs text-[#F5ECD7]/40 mt-1 truncate">{entry.notes}</p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8" onClick={() => handleEdit(entry)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(entry.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SportModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}

// ─── Voeding Tab ──────────────────────────────────────────────────────────────

const MEAL_TYPES = ['Ontbijt', 'Lunch', 'Avondeten', 'Snack']

const mealTypeColor = (type) => {
  const map = {
    Ontbijt: 'bg-blue-900/50 text-blue-300 border-blue-800',
    Lunch: 'bg-green-900/50 text-green-300 border-green-800',
    Avondeten: 'bg-purple-900/50 text-purple-300 border-purple-800',
    Snack: 'bg-orange-900/50 text-orange-300 border-orange-800',
  }
  return map[type] || 'bg-[#2a2a2a] text-[#F5ECD7]/60'
}

const moodColor = (val) => {
  if (val >= 3) return 'bg-green-900/50 text-green-300 border-green-800'
  if (val >= 0) return 'bg-amber-900/50 text-amber-300 border-amber-800'
  return 'bg-red-900/50 text-red-300 border-red-800'
}

const moodLabel = (val) => {
  if (val >= 4) return 'Uitstekend'
  if (val >= 2) return 'Goed'
  if (val >= 0) return 'Neutraal'
  if (val >= -2) return 'Minder'
  return 'Slecht'
}

const emptyVoeding = { mealType: 'Lunch', description: '', moodAfter: 0, notes: '' }

function VoedingModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptyVoeding)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.description.trim()) return
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl">
            {initial ? 'Maaltijd aanpassen' : 'Maaltijd toevoegen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-base">Type maaltijd</Label>
            <Select value={form.mealType} onValueChange={v => set('mealType', v)}>
              <SelectTrigger className="input-base mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7]">
                {MEAL_TYPES.map(o => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="label-base">Beschrijving</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={3}
              placeholder="Wat heb je gegeten of gedronken?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
          <div>
            <Label className="label-base">
              Gevoel erna: {form.moodAfter > 0 ? `+${form.moodAfter}` : form.moodAfter} ({moodLabel(form.moodAfter)})
            </Label>
            <Slider
              className="mt-2"
              min={-5} max={5} step={1}
              value={[form.moodAfter]}
              onValueChange={([v]) => set('moodAfter', v)}
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/40 mt-1">
              <span>-5 Slecht</span><span>0 Neutraal</span><span>+5 Uitstekend</span>
            </div>
          </div>
          <div>
            <Label className="label-base">Notities</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={2}
              placeholder="Hoe voelde je je bij de maaltijd? Bijzonderheden..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave} disabled={!form.description.trim()}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function VoedingTab() {
  const { healthNutrition, addNutritionEntry, updateNutritionEntry, deleteNutritionEntry } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = (data) => {
    if (editing) {
      updateNutritionEntry(editing.id, data)
      toast({ title: 'Maaltijd bijgewerkt' })
    } else {
      addNutritionEntry(data)
      toast({ title: 'Maaltijd toegevoegd' })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => { deleteNutritionEntry(id); toast({ title: 'Verwijderd' }) }
  const handleAdd = () => { setEditing(null); setModalOpen(true) }

  const entries = [...(healthNutrition || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-subtitle">{entries.length} maaltij{entries.length !== 1 ? 'den' : 'd'} gelogd</p>
        <Button className="btn-primary" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Toevoegen
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-3">
          <Utensils className="w-10 h-10 mx-auto text-[#C97D3A] opacity-50" />
          <p className="font-['Playfair_Display'] text-lg text-[#F5ECD7]">Nog geen maaltijden</p>
          <p className="text-[#F5ECD7]/50 text-sm max-w-xs mx-auto">
            Bewust eten begint bij bewust registreren. Hoe voelde je je na de maaltijd?
          </p>
          <Button className="btn-primary mt-2" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Eerste maaltijd toevoegen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="glass-card-hover p-4 flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#C97D3A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Utensils className="w-5 h-5 text-[#C97D3A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn('text-xs border', mealTypeColor(entry.mealType))}>
                    {entry.mealType}
                  </Badge>
                  <Badge className={cn('text-xs border', moodColor(entry.moodAfter))}>
                    {entry.moodAfter > 0 ? '+' : ''}{entry.moodAfter} {moodLabel(entry.moodAfter)}
                  </Badge>
                </div>
                <p className="text-[#F5ECD7] mt-1 text-sm line-clamp-2">{entry.description}</p>
                <p className="text-xs text-[#F5ECD7]/40 mt-1">{formatRelative(entry.date)}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8" onClick={() => handleEdit(entry)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(entry.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <VoedingModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}

// ─── Slaap Tab ────────────────────────────────────────────────────────────────

const sleepHoursColor = (hours) => {
  if (hours < 6) return 'text-red-400'
  if (hours < 7) return 'text-amber-400'
  return 'text-green-400'
}

const sleepQualityBadge = (q) => {
  if (q >= 8) return 'bg-green-900/50 text-green-300 border-green-800'
  if (q >= 5) return 'bg-amber-900/50 text-amber-300 border-amber-800'
  return 'bg-red-900/50 text-red-300 border-red-800'
}

const sleepQualityLabel = (q) => {
  if (q >= 8) return 'Uitstekend'
  if (q >= 6) return 'Goed'
  if (q >= 4) return 'Matig'
  return 'Slecht'
}

const emptySlaap = { hours: 7, quality: 7, bedtime: '22:30', wakeTime: '06:30', notes: '' }

function SlaapModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptySlaap)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl">
            {initial ? 'Slaap aanpassen' : 'Slaap toevoegen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-base">Uren geslapen: {form.hours}</Label>
            <Slider
              className="mt-2"
              min={0} max={12} step={0.5}
              value={[form.hours]}
              onValueChange={([v]) => set('hours', v)}
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/40 mt-1">
              <span>0u</span><span>6u</span><span>12u</span>
            </div>
          </div>
          <div>
            <Label className="label-base">Kwaliteit: {form.quality}/10 ({sleepQualityLabel(form.quality)})</Label>
            <Slider
              className="mt-2"
              min={1} max={10} step={1}
              value={[form.quality]}
              onValueChange={([v]) => set('quality', v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="label-base">Slaaptijd</Label>
              <Input
                type="time"
                className="input-base mt-1"
                value={form.bedtime}
                onChange={e => set('bedtime', e.target.value)}
              />
            </div>
            <div>
              <Label className="label-base">Wektijd</Label>
              <Input
                type="time"
                className="input-base mt-1"
                value={form.wakeTime}
                onChange={e => set('wakeTime', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="label-base">Notities</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={3}
              placeholder="Hoe sliep je? Dromen, verstoringen..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SlaapTab() {
  const { healthSleep, addSleepEntry, updateSleepEntry, deleteSleepEntry } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = (data) => {
    if (editing) {
      updateSleepEntry(editing.id, data)
      toast({ title: 'Slaap bijgewerkt' })
    } else {
      addSleepEntry(data)
      toast({ title: 'Slaap toegevoegd' })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => { deleteSleepEntry(id); toast({ title: 'Verwijderd' }) }
  const handleAdd = () => { setEditing(null); setModalOpen(true) }

  const entries = [...(healthSleep || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-4">
      {entries.length > 0 && (
        <SleepChart data={entries} />
      )}

      <div className="flex items-center justify-between">
        <p className="section-subtitle">{entries.length} nacht{entries.length !== 1 ? 'en' : ''} gelogd</p>
        <Button className="btn-primary" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Toevoegen
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-3">
          <Moon className="w-10 h-10 mx-auto text-[#C97D3A] opacity-50" />
          <p className="font-['Playfair_Display'] text-lg text-[#F5ECD7]">Nog geen slaapdata</p>
          <p className="text-[#F5ECD7]/50 text-sm max-w-xs mx-auto">
            Slaap is de basis van alles. Begin je slaappatroon te begrijpen door het bij te houden.
          </p>
          <Button className="btn-primary mt-2" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Eerste nacht toevoegen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="glass-card-hover p-4 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center flex-shrink-0">
                <span className={cn('text-lg font-bold font-["Playfair_Display"]', sleepHoursColor(entry.hours))}>
                  {entry.hours}u
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn('text-xs border', sleepQualityBadge(entry.quality))}>
                    {sleepQualityLabel(entry.quality)} ({entry.quality}/10)
                  </Badge>
                  {entry.bedtime && entry.wakeTime && (
                    <span className="text-xs text-[#F5ECD7]/40">
                      {entry.bedtime} – {entry.wakeTime}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#F5ECD7]/40 mt-1">{formatRelative(entry.date)}</p>
                {entry.notes && (
                  <p className="text-xs text-[#F5ECD7]/40 mt-0.5 truncate">{entry.notes}</p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8" onClick={() => handleEdit(entry)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(entry.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SlaapModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}

// ─── Lichaamsspanning Tab ─────────────────────────────────────────────────────

const BODY_PARTS = ['nek', 'schouders', 'borst', 'rug', 'maag', 'kaak', 'hoofd', 'armen', 'benen']

const tensionLevelBadge = (level) => {
  if (level >= 7) return 'bg-red-900/50 text-red-300 border-red-800'
  if (level >= 4) return 'bg-amber-900/50 text-amber-300 border-amber-800'
  return 'bg-green-900/50 text-green-300 border-green-800'
}

const tensionLevelLabel = (level) => {
  if (level >= 7) return 'Hoog'
  if (level >= 4) return 'Matig'
  return 'Laag'
}

const emptyTension = { level: 5, bodyParts: [], trigger: '', notes: '' }

function TensionModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptyTension)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleBodyPart = (part) => {
    set('bodyParts', form.bodyParts.includes(part)
      ? form.bodyParts.filter(p => p !== part)
      : [...form.bodyParts, part]
    )
  }

  const handleSave = () => {
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl">
            {initial ? 'Spanning aanpassen' : 'Lichaamsspanning loggen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="label-base">
              Spanningsniveau: {form.level}/10 ({tensionLevelLabel(form.level)})
            </Label>
            <Slider
              className="mt-2"
              min={1} max={10} step={1}
              value={[form.level]}
              onValueChange={([v]) => set('level', v)}
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/40 mt-1">
              <span>1 Ontspannen</span><span>10 Maximaal gespannen</span>
            </div>
          </div>
          <div>
            <Label className="label-base">Lichaamsdelen</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {BODY_PARTS.map(part => (
                <button
                  key={part}
                  type="button"
                  onClick={() => toggleBodyPart(part)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs border transition-colors capitalize',
                    form.bodyParts.includes(part)
                      ? 'bg-[#C97D3A] border-[#C97D3A] text-white'
                      : 'bg-[#141414] border-[#2a2a2a] text-[#F5ECD7]/60 hover:border-[#C97D3A]/50'
                  )}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="label-base">Trigger / Aanleiding</Label>
            <Input
              className="input-base mt-1"
              placeholder="Wat veroorzaakte de spanning?"
              value={form.trigger}
              onChange={e => set('trigger', e.target.value)}
            />
          </div>
          <div>
            <Label className="label-base">Notities</Label>
            <Textarea
              className="input-base mt-1 resize-none"
              rows={3}
              placeholder="Meer details over hoe je je voelde..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SpanningTab() {
  const { healthTension, addTensionEntry, updateTensionEntry, deleteTensionEntry } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = (data) => {
    if (editing) {
      updateTensionEntry(editing.id, data)
      toast({ title: 'Spanning bijgewerkt' })
    } else {
      addTensionEntry(data)
      toast({ title: 'Spanning gelogd' })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => { deleteTensionEntry(id); toast({ title: 'Verwijderd' }) }
  const handleAdd = () => { setEditing(null); setModalOpen(true) }

  const entries = [...(healthTension || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-subtitle">{entries.length} moment{entries.length !== 1 ? 'en' : ''} gelogd</p>
        <Button className="btn-primary" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Toevoegen
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-3">
          <Activity className="w-10 h-10 mx-auto text-[#C97D3A] opacity-50" />
          <p className="font-['Playfair_Display'] text-lg text-[#F5ECD7]">Geen spanning gelogd</p>
          <p className="text-[#F5ECD7]/50 text-sm max-w-xs mx-auto">
            Je lichaam spreekt. Leer luisteren naar spanning en ontdek patronen in waar en wanneer het ontstaat.
          </p>
          <Button className="btn-primary mt-2" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Spanning loggen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="glass-card-hover p-4 flex items-start gap-4 group">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm',
                entry.level >= 7 ? 'bg-red-900/40 text-red-300' :
                entry.level >= 4 ? 'bg-amber-900/40 text-amber-300' :
                'bg-green-900/40 text-green-300'
              )}>
                {entry.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn('text-xs border', tensionLevelBadge(entry.level))}>
                    {tensionLevelLabel(entry.level)} ({entry.level}/10)
                  </Badge>
                  {entry.trigger && (
                    <span className="text-xs text-[#F5ECD7]/60 truncate max-w-[200px]">{entry.trigger}</span>
                  )}
                </div>
                {entry.bodyParts && entry.bodyParts.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.bodyParts.map(part => (
                      <span key={part} className="px-2 py-0.5 rounded-full text-xs bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7]/50 capitalize">
                        {part}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-[#F5ECD7]/40 mt-1">{formatRelative(entry.date)}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8" onClick={() => handleEdit(entry)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(entry.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TensionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}

// ─── Main Health Component ────────────────────────────────────────────────────

export default function Health() {
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="section-title flex items-center gap-3">
          <Heart className="w-7 h-7 text-[#C97D3A]" />
          Fysieke Gezondheid
        </h1>
        <p className="section-subtitle mt-1">
          Houd je sport, voeding, slaap en lichamelijke spanning bij op één plek.
        </p>
      </div>

      <Tabs defaultValue="sport">
        <TabsList className="bg-[#141414] border border-[#2a2a2a] p-1 rounded-lg">
          <TabsTrigger value="sport" className="data-[state=active]:bg-[#C97D3A] data-[state=active]:text-white text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors">
            <Dumbbell className="w-4 h-4 mr-1.5" />
            Sport
          </TabsTrigger>
          <TabsTrigger value="voeding" className="data-[state=active]:bg-[#C97D3A] data-[state=active]:text-white text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors">
            <Utensils className="w-4 h-4 mr-1.5" />
            Voeding
          </TabsTrigger>
          <TabsTrigger value="slaap" className="data-[state=active]:bg-[#C97D3A] data-[state=active]:text-white text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors">
            <Moon className="w-4 h-4 mr-1.5" />
            Slaap
          </TabsTrigger>
          <TabsTrigger value="spanning" className="data-[state=active]:bg-[#C97D3A] data-[state=active]:text-white text-[#F5ECD7]/60 rounded-md px-4 py-1.5 text-sm transition-colors">
            <Activity className="w-4 h-4 mr-1.5" />
            Spanning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sport" className="mt-6">
          <SportTab />
        </TabsContent>
        <TabsContent value="voeding" className="mt-6">
          <VoedingTab />
        </TabsContent>
        <TabsContent value="slaap" className="mt-6">
          <SlaapTab />
        </TabsContent>
        <TabsContent value="spanning" className="mt-6">
          <SpanningTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
