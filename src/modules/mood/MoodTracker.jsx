import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/store/useAppStore'
import { formatRelative, formatDate } from '@/utils/dateHelpers'
import { cn } from '@/lib/utils'
import MoodChart from '@/components/charts/MoodChart'
import {
  Plus,
  Smile,
  Trash2,
  Edit3,
  Calendar,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const SCORE_EMOJIS = [
  { min: -5, max: -4, emoji: '😭', label: 'Verschrikkelijk' },
  { min: -3, max: -1, emoji: '😢', label: 'Slecht' },
  { min: 0, max: 0, emoji: '😐', label: 'Neutraal' },
  { min: 1, max: 3, emoji: '🙂', label: 'Goed' },
  { min: 4, max: 5, emoji: '😄', label: 'Geweldig' },
]

function getEmojiInfo(score) {
  return (
    SCORE_EMOJIS.find((e) => score >= e.min && score <= e.max) ?? SCORE_EMOJIS[2]
  )
}

function scoreColor(score) {
  if (score >= 3) return 'text-emerald-400'
  if (score >= 1) return 'text-amber-400'
  if (score === 0) return 'text-[#F5ECD7]/60'
  return 'text-red-400'
}

function scoreBg(score) {
  if (score >= 3) return 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
  if (score >= 1) return 'bg-amber-400/10 border-amber-400/30 text-amber-400'
  if (score === 0) return 'bg-[#F5ECD7]/5 border-[#F5ECD7]/20 text-[#F5ECD7]/60'
  return 'bg-red-400/10 border-red-400/30 text-red-400'
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-4 opacity-50">😐</div>
      <h3 className="font-playfair text-xl text-[#F5ECD7] mb-2">Nog geen stemmingen</h3>
      <p className="text-[#F5ECD7]/50 text-sm max-w-xs mb-6">
        Begin met bijhouden hoe je je voelt. Kleine notities maken een groot verschil.
      </p>
      <Button className="btn-primary" onClick={onAdd}>
        <Plus size={16} className="mr-2" />
        Eerste stemming loggen
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mood Entry Card
// ---------------------------------------------------------------------------
function MoodCard({ entry, onEdit, onDelete }) {
  const info = getEmojiInfo(entry.score)
  return (
    <div className="glass-card-hover p-4 group relative">
      <div className="flex items-start gap-3">
        {/* Score Badge */}
        <div
          className={cn(
            'flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0',
            scoreBg(entry.score)
          )}
        >
          <span className="text-xl leading-none">{info.emoji}</span>
          <span className="text-xs font-bold mt-0.5">{entry.score > 0 ? `+${entry.score}` : entry.score}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs text-[#F5ECD7]/40 flex items-center gap-1">
              <Calendar size={11} />
              {formatRelative(entry.createdAt)}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(entry)}
                className="p-1 rounded hover:bg-[#C97D3A]/20 text-[#C97D3A]"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => onDelete(entry)}
                className="p-1 rounded hover:bg-red-500/20 text-red-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <p className="text-xs font-medium text-[#F5ECD7]/70 mb-1">{info.label}</p>

          {entry.emotions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {entry.emotions.map((em) => (
                <Badge
                  key={em}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-[#C97D3A]/30 text-[#C97D3A]/80 bg-[#C97D3A]/5"
                >
                  {em}
                </Badge>
              ))}
            </div>
          )}

          {entry.note && (
            <p className="text-xs text-[#F5ECD7]/50 line-clamp-2">{entry.note}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mood Modal (Add / Edit)
// ---------------------------------------------------------------------------
function MoodModal({ open, onClose, entry, onSave, emotionTags = [] }) {
  const isEdit = Boolean(entry?.id)

  const [score, setScore] = useState(entry?.score ?? 0)
  const [emotions, setEmotions] = useState(entry?.emotions ?? [])
  const [note, setNote] = useState(entry?.note ?? '')

  // Sync on open
  useState(() => {
    setScore(entry?.score ?? 0)
    setEmotions(entry?.emotions ?? [])
    setNote(entry?.note ?? '')
  }, [entry, open])

  const toggleEmotion = (tag) => {
    setEmotions((prev) =>
      prev.includes(tag) ? prev.filter((e) => e !== tag) : [...prev, tag]
    )
  }

  const emojiInfo = getEmojiInfo(score)

  const handleSave = () => {
    onSave({
      ...(entry ?? {}),
      score,
      emotions,
      note: note.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#F5ECD7]">
            {isEdit ? 'Stemming bewerken' : 'Stemming loggen'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Score Slider */}
          <div>
            <Label className="label-base">Stemmingsscore</Label>
            <div className="flex flex-col items-center mt-4 mb-2">
              <span className="text-5xl mb-1">{emojiInfo.emoji}</span>
              <span className="text-sm text-[#F5ECD7]/70 mb-1">{emojiInfo.label}</span>
              <span
                className={cn('text-2xl font-bold font-playfair', scoreColor(score))}
              >
                {score > 0 ? `+${score}` : score}
              </span>
            </div>
            <Slider
              min={-5}
              max={5}
              step={1}
              value={[score]}
              onValueChange={([v]) => setScore(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-[#F5ECD7]/30 mt-1 px-1">
              <span>-5</span>
              <span>0</span>
              <span>+5</span>
            </div>
          </div>

          {/* Emotion Tags */}
          {emotionTags.length > 0 && (
            <div>
              <Label className="label-base">Emoties (selecteer alle die van toepassing zijn)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {emotionTags.map((tag) => {
                  const active = emotions.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEmotion(tag)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all text-left truncate',
                        active
                          ? 'bg-[#C97D3A]/20 border-[#C97D3A] text-[#C97D3A]'
                          : 'bg-[#1C1C1C] border-[#2a2a2a] text-[#F5ECD7]/60 hover:border-[#C97D3A]/40'
                      )}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <Label className="label-base">Notitie (optioneel)</Label>
            <Textarea
              className="input-base mt-1 min-h-[80px] resize-none"
              placeholder="Voeg een korte notitie toe…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>
            Annuleren
          </Button>
          <Button className="btn-primary" onClick={handleSave}>
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
            Stemming verwijderen
          </DialogTitle>
        </DialogHeader>
        <p className="text-[#F5ECD7]/70 text-sm py-2">
          Weet je zeker dat je deze stemming wilt verwijderen?
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
// Main MoodTracker Component
// ---------------------------------------------------------------------------
export default function MoodTracker() {
  const { moods, settings, addMood, updateMood, deleteMood } = useAppStore()
  const { toast } = useToast()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const emotionTags = settings?.emotionTags ?? []

  const sortedMoods = useMemo(
    () => [...(moods ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [moods]
  )

  const avgScore = useMemo(() => {
    if (!sortedMoods.length) return null
    const sum = sortedMoods.reduce((acc, m) => acc + m.score, 0)
    return (sum / sortedMoods.length).toFixed(1)
  }, [sortedMoods])

  const handleSave = (data) => {
    if (data.id) {
      updateMood(data.id, { ...data, updatedAt: new Date().toISOString() })
      toast({ title: 'Stemming bijgewerkt' })
    } else {
      addMood({
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      toast({ title: 'Stemming gelogd' })
    }
    setAddModalOpen(false)
    setEditEntry(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMood(deleteTarget.id)
    toast({ title: 'Stemming verwijderd', variant: 'destructive' })
    setDeleteTarget(null)
  }

  return (
    <div className="relative min-h-full pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Smile size={22} className="text-[#C97D3A]" />
          <h1 className="section-title">Stemmingstracker</h1>
        </div>
        <p className="section-subtitle">Volg je emotioneel welzijn over tijd.</p>
      </div>

      {/* Stats Row */}
      {sortedMoods.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-[#C97D3A]" />
            <span className="text-[#F5ECD7]/70 text-sm">
              Gemiddeld:{' '}
              <span className={cn('font-semibold', scoreColor(parseFloat(avgScore)))}>
                {avgScore > 0 ? `+${avgScore}` : avgScore}
              </span>
            </span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-[#F5ECD7]/70 text-sm">
              <span className="text-[#F5ECD7] font-semibold">{sortedMoods.length}</span> metingen
            </span>
          </div>
        </div>
      )}

      {/* Weekly Chart */}
      {sortedMoods.length > 0 && (
        <div className="glass-card p-4 mb-6">
          <h2 className="text-sm font-medium text-[#F5ECD7]/70 mb-3 uppercase tracking-wider">
            Weekoverzicht
          </h2>
          <MoodChart moods={sortedMoods} />
        </div>
      )}

      {/* Add Button */}
      {sortedMoods.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button className="btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Stemming loggen
          </Button>
        </div>
      )}

      {/* List */}
      {sortedMoods.length === 0 && <EmptyState onAdd={() => setAddModalOpen(true)} />}

      {sortedMoods.length > 0 && (
        <div className="space-y-3">
          {sortedMoods.map((entry) => (
            <MoodCard
              key={entry.id}
              entry={entry}
              onEdit={(e) => setEditEntry(e)}
              onDelete={(e) => setDeleteTarget(e)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {sortedMoods.length === 0 ? null : (
        <button
          onClick={() => setAddModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#C97D3A] hover:bg-[#C97D3A]/90 text-white shadow-lg shadow-[#C97D3A]/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
          aria-label="Stemming loggen"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Add Modal */}
      <MoodModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        entry={null}
        onSave={handleSave}
        emotionTags={emotionTags}
      />

      {/* Edit Modal */}
      <MoodModal
        open={Boolean(editEntry)}
        onClose={() => setEditEntry(null)}
        entry={editEntry}
        onSave={handleSave}
        emotionTags={emotionTags}
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
