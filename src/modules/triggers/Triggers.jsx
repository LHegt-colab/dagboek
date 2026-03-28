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
  Brain, Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  Filter, X, MessageSquare, Lightbulb, ArrowRight, AlertCircle
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const intensityColor = (val) => {
  if (val >= 8) return 'bg-red-900/50 text-red-300 border-red-800'
  if (val >= 5) return 'bg-amber-900/50 text-amber-300 border-amber-800'
  return 'bg-green-900/50 text-green-300 border-green-800'
}

const intensityLabel = (val) => {
  if (val >= 8) return 'Intens'
  if (val >= 5) return 'Matig'
  return 'Mild'
}

const emptyTrigger = {
  situation: '',
  emotion: '',
  emotionIntensity: 5,
  automaticThought: '',
  alternativeThought: '',
  outcome: '',
}

// ─── CBT Modal ────────────────────────────────────────────────────────────────

function TriggerModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptyTrigger)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.situation.trim()) return
    onSave({ ...form, date: form.date || new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-xl">
            {initial ? 'Gedachte aanpassen' : 'Gedachte loggen'}
          </DialogTitle>
          <p className="text-[#F5ECD7]/50 text-sm">
            Verken de verbinding tussen situatie, gedachte en gevoel.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2a2a2a]">
              <div className="w-7 h-7 rounded-full bg-[#C97D3A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-base text-[#F5ECD7]">Situatie</h3>
                <p className="text-xs text-[#F5ECD7]/40">Wat gebeurde er precies?</p>
              </div>
            </div>

            <div>
              <Label className="label-base">Situatie</Label>
              <Textarea
                className="input-base mt-1 resize-none"
                rows={3}
                placeholder="Beschrijf de situatie zo concreet mogelijk: waar, wanneer, wie was erbij..."
                value={form.situation}
                onChange={e => set('situation', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="label-base">Emotie</Label>
                <Input
                  className="input-base mt-1"
                  placeholder="bijv. Angst, Boosheid..."
                  value={form.emotion}
                  onChange={e => set('emotion', e.target.value)}
                />
              </div>
              <div>
                <Label className="label-base">
                  Intensiteit: {form.emotionIntensity}/10
                </Label>
                <Slider
                  className="mt-3"
                  min={1} max={10} step={1}
                  value={[form.emotionIntensity]}
                  onValueChange={([v]) => set('emotionIntensity', v)}
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2a2a2a]">
              <div className="w-7 h-7 rounded-full bg-[#C97D3A]/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-base text-[#F5ECD7]">Automatische Gedachte</h3>
                <p className="text-xs text-[#F5ECD7]/40">Welke gedachte schoot er direct door je hoofd?</p>
              </div>
            </div>

            <div>
              <Label className="label-base">Automatische gedachte</Label>
              <Textarea
                className="input-base mt-1 resize-none"
                rows={3}
                placeholder="Schrijf de gedachte op precies zoals die opkwam, ook al klinkt het irrationeel..."
                value={form.automaticThought}
                onChange={e => set('automaticThought', e.target.value)}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#2a2a2a]">
              <div className="w-7 h-7 rounded-full bg-[#C97D3A]/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-base text-[#F5ECD7]">Alternatieve Gedachte</h3>
                <p className="text-xs text-[#F5ECD7]/40">Wat is een meer evenwichtige kijk?</p>
              </div>
            </div>

            <div>
              <Label className="label-base">Alternatieve gedachte</Label>
              <Textarea
                className="input-base mt-1 resize-none"
                rows={3}
                placeholder="Herschrijf de gedachte realistischer. Wat zou je een vriend zeggen in deze situatie?"
                value={form.alternativeThought}
                onChange={e => set('alternativeThought', e.target.value)}
              />
            </div>

            <div>
              <Label className="label-base">Uitkomst / Inzicht</Label>
              <Textarea
                className="input-base mt-1 resize-none"
                rows={2}
                placeholder="Wat neem je hieruit mee? Hoe voel je je nu?"
                value={form.outcome}
                onChange={e => set('outcome', e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>Annuleren</Button>
          <Button className="btn-primary" onClick={handleSave} disabled={!form.situation.trim()}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Detail Expansion ─────────────────────────────────────────────────────────

function TriggerDetail({ entry }) {
  return (
    <div className="mt-3 space-y-3 border-t border-[#2a2a2a] pt-3">
      {entry.automaticThought && (
        <div className="space-y-1">
          <p className="label-base flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-[#C97D3A]" /> Automatische Gedachte
          </p>
          <p className="text-sm text-[#F5ECD7]/80 pl-5">{entry.automaticThought}</p>
        </div>
      )}
      {entry.alternativeThought && (
        <div className="space-y-1">
          <p className="label-base flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3 text-[#C97D3A]" /> Alternatieve Gedachte
          </p>
          <p className="text-sm text-[#F5ECD7]/80 pl-5">{entry.alternativeThought}</p>
        </div>
      )}
      {entry.outcome && (
        <div className="space-y-1">
          <p className="label-base flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-[#C97D3A]" /> Uitkomst
          </p>
          <p className="text-sm text-[#F5ECD7]/70 pl-5">{entry.outcome}</p>
        </div>
      )}
    </div>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function TriggerCard({ entry, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  const hasDetail = entry.automaticThought || entry.alternativeThought || entry.outcome

  return (
    <div className="glass-card p-4 space-y-2 group">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#C97D3A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Brain className="w-4 h-4 text-[#C97D3A]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {entry.emotion && (
              <Badge className="bg-[#2a2a2a] text-[#F5ECD7]/80 border-[#3a3a3a] text-xs capitalize">
                {entry.emotion}
              </Badge>
            )}
            {entry.emotionIntensity && (
              <Badge className={cn('text-xs border', intensityColor(entry.emotionIntensity))}>
                {intensityLabel(entry.emotionIntensity)} ({entry.emotionIntensity}/10)
              </Badge>
            )}
            <span className="text-xs text-[#F5ECD7]/55 ml-auto">{formatRelative(entry.createdAt)}</span>
          </div>
          <p className="text-sm text-[#F5ECD7] mt-1.5 line-clamp-2">{entry.situation}</p>

          {/* Intensity bar */}
          {entry.emotionIntensity && (
            <div className="mt-2 h-1 rounded-full bg-[#2a2a2a] overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  entry.emotionIntensity >= 8 ? 'bg-red-500' :
                  entry.emotionIntensity >= 5 ? 'bg-amber-500' : 'bg-green-500'
                )}
                style={{ width: `${(entry.emotionIntensity / 10) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {hasDetail && (
        <>
          {expanded && <TriggerDetail entry={entry} />}
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-[#C97D3A]/70 hover:text-[#C97D3A] transition-colors mt-1 pl-12"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Minder tonen</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> Details tonen</>
            )}
          </button>
        </>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-[#F5ECD7]/[0.07]">
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

export default function Triggers() {
  const { triggers, addTrigger, updateTrigger, deleteTrigger } = useAppStore()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [emotionFilter, setEmotionFilter] = useState('all')

  const entries = useMemo(() =>
    [...(triggers || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [triggers]
  )

  const uniqueEmotions = useMemo(() => {
    const set = new Set(entries.map(e => e.emotion).filter(Boolean))
    return Array.from(set).sort()
  }, [entries])

  const filtered = useMemo(() =>
    emotionFilter === 'all' ? entries : entries.filter(e => e.emotion === emotionFilter),
    [entries, emotionFilter]
  )

  const handleSave = (data) => {
    if (editing) {
      updateTrigger(editing.id, data)
      toast({ title: 'Gedachte bijgewerkt' })
    } else {
      addTrigger(data)
      toast({ title: 'Gedachte gelogd' })
    }
    setEditing(null)
  }

  const handleEdit = (entry) => { setEditing(entry); setModalOpen(true) }
  const handleDelete = (id) => { deleteTrigger(id); toast({ title: 'Verwijderd' }) }
  const handleAdd = () => { setEditing(null); setModalOpen(true) }

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Brain className="w-7 h-7 text-[#C97D3A]" />
            Triggers &amp; Gedachten
          </h1>
          <p className="section-subtitle mt-1">
            Cognitief dagboek — begrijp hoe situaties je denken en voelen beïnvloeden.
          </p>
        </div>
        <Button className="btn-primary flex-shrink-0" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Loggen
        </Button>
      </div>

      {/* Filter */}
      {uniqueEmotions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[#F5ECD7]/40 flex-shrink-0" />
          <button
            type="button"
            onClick={() => setEmotionFilter('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs border transition-colors',
              emotionFilter === 'all'
                ? 'bg-[#C97D3A] border-[#C97D3A] text-white'
                : 'bg-[#141414] border-[#2a2a2a] text-[#F5ECD7]/60 hover:border-[#C97D3A]/50'
            )}
          >
            Alle emoties
          </button>
          {uniqueEmotions.map(emotion => (
            <button
              key={emotion}
              type="button"
              onClick={() => setEmotionFilter(emotion)}
              className={cn(
                'px-3 py-1 rounded-full text-xs border transition-colors capitalize',
                emotionFilter === emotion
                  ? 'bg-[#C97D3A] border-[#C97D3A] text-white'
                  : 'bg-[#141414] border-[#2a2a2a] text-[#F5ECD7]/60 hover:border-[#C97D3A]/50'
              )}
            >
              {emotion}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {entries.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-4">
          <Brain className="w-12 h-12 mx-auto text-[#C97D3A] opacity-40" />
          <div>
            <p className="font-['Playfair_Display'] text-xl text-[#F5ECD7]">Begin je cognitieve dagboek</p>
            <p className="text-[#F5ECD7]/50 text-sm max-w-sm mx-auto mt-2">
              CGT helpt je patronen te herkennen tussen situaties, gedachten en gevoelens.
              Door automatische gedachten op te schrijven en te herformuleren, krijg je meer regie.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs text-[#F5ECD7]/50">
            <div className="glass-card p-3 text-center">
              <div className="w-6 h-6 rounded-full bg-[#C97D3A]/20 flex items-center justify-center mx-auto mb-1 text-[#C97D3A] font-bold text-xs">1</div>
              <p>Situatie beschrijven</p>
            </div>
            <div className="glass-card p-3 text-center">
              <div className="w-6 h-6 rounded-full bg-[#C97D3A]/20 flex items-center justify-center mx-auto mb-1 text-[#C97D3A] font-bold text-xs">2</div>
              <p>Gedachte herkennen</p>
            </div>
            <div className="glass-card p-3 text-center">
              <div className="w-6 h-6 rounded-full bg-[#C97D3A]/20 flex items-center justify-center mx-auto mb-1 text-[#C97D3A] font-bold text-xs">3</div>
              <p>Alternatief formuleren</p>
            </div>
          </div>
          <Button className="btn-primary" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Eerste gedachte loggen
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-8 text-center space-y-3">
          <Filter className="w-8 h-8 mx-auto text-[#F5ECD7]/20" />
          <p className="text-[#F5ECD7]/50 text-sm">Geen resultaten voor deze filter.</p>
          <Button variant="ghost" className="btn-ghost text-sm" onClick={() => setEmotionFilter('all')}>
            <X className="w-3.5 h-3.5 mr-1" /> Filter wissen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="section-subtitle">
            {filtered.length} van {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}
            {emotionFilter !== 'all' && ` — gefilterd op "${emotionFilter}"`}
          </p>
          {filtered.map(entry => (
            <TriggerCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TriggerModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}
