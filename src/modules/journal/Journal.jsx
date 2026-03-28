import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/store/useAppStore'
import { formatRelative, formatDate } from '@/utils/dateHelpers'
import { cn } from '@/lib/utils'
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  Edit3,
  Shuffle,
  X,
  Tag,
  Calendar,
  ChevronRight,
  FileText,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6 opacity-40"
      >
        <rect x="20" y="15" width="80" height="90" rx="6" fill="#1C1C1C" stroke="#C97D3A" strokeWidth="1.5" />
        <rect x="30" y="35" width="60" height="3" rx="1.5" fill="#F5ECD7" opacity="0.3" />
        <rect x="30" y="45" width="50" height="3" rx="1.5" fill="#F5ECD7" opacity="0.2" />
        <rect x="30" y="55" width="55" height="3" rx="1.5" fill="#F5ECD7" opacity="0.2" />
        <rect x="30" y="65" width="40" height="3" rx="1.5" fill="#F5ECD7" opacity="0.15" />
        <circle cx="60" cy="22" r="4" fill="#C97D3A" opacity="0.6" />
        <line x1="20" y1="28" x2="100" y2="28" stroke="#C97D3A" strokeWidth="1" opacity="0.4" />
      </svg>
      <h3 className="font-playfair text-xl text-[#F5ECD7] mb-2">Nog geen dagboekentries</h3>
      <p className="text-[#F5ECD7]/50 text-sm max-w-xs mb-6">
        Begin vandaag met schrijven. Jouw gedachten en ervaringen verdienen een plek.
      </p>
      <Button className="btn-primary" onClick={onAdd}>
        <Plus size={16} className="mr-2" />
        Eerste entry schrijven
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Entry Card
// ---------------------------------------------------------------------------
function EntryCard({ entry, onClick, onDelete }) {
  const preview = entry.content?.slice(0, 180) + (entry.content?.length > 180 ? '…' : '')

  return (
    <div
      className="glass-card-hover p-5 cursor-pointer group relative"
      onClick={() => onClick(entry)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-playfair text-[#F5ECD7] text-base font-semibold leading-snug flex-1 line-clamp-1">
          {entry.title || 'Naamloos'}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-[#F5ECD7]/40 flex items-center gap-1">
            <Calendar size={11} />
            {formatRelative(entry.date)}
          </span>
          <button
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-red-400"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(entry)
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {entry.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-2 py-0 border-[#C97D3A]/40 text-[#C97D3A] bg-[#C97D3A]/5"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <p className="text-[#F5ECD7]/55 text-sm leading-relaxed line-clamp-3">{preview}</p>

      <ChevronRight
        size={16}
        className="absolute right-4 bottom-4 text-[#F5ECD7]/20 group-hover:text-[#C97D3A] transition-colors"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Entry Modal (Add / Edit)
// ---------------------------------------------------------------------------
function EntryModal({ open, onClose, entry, onSave, prompts = [] }) {
  const isEdit = Boolean(entry?.id)

  const [title, setTitle] = useState(entry?.title ?? '')
  const [content, setContent] = useState(entry?.content ?? '')
  const [tagsRaw, setTagsRaw] = useState(entry?.tags?.join(', ') ?? '')
  const [prompt, setPrompt] = useState('')

  // Reset when entry changes
  const resetForm = (e) => {
    setTitle(e?.title ?? '')
    setContent(e?.content ?? '')
    setTagsRaw(e?.tags?.join(', ') ?? '')
    setPrompt('')
  }

  // Keep form in sync when modal opens with a new entry
  useState(() => {
    resetForm(entry)
  }, [entry, open])

  const handleRandomPrompt = () => {
    if (!prompts.length) return
    const p = prompts[Math.floor(Math.random() * prompts.length)]
    setPrompt(p)
  }

  const handleSave = () => {
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    onSave({
      ...(entry ?? {}),
      title: title.trim(),
      content: content.trim(),
      tags,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#F5ECD7]">
            {isEdit ? 'Entry bewerken' : 'Nieuwe dagboekentry'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <div>
            <Label className="label-base">Titel</Label>
            <Input
              className="input-base mt-1"
              placeholder="Geef je entry een titel…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Reflection Prompt */}
          {prompts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="label-base">Reflectievraag (optioneel)</Label>
                <button
                  type="button"
                  onClick={handleRandomPrompt}
                  className="flex items-center gap-1 text-xs text-[#C97D3A] hover:text-[#C97D3A]/80 transition-colors"
                >
                  <Shuffle size={13} />
                  Willekeurige vraag
                </button>
              </div>
              {prompt && (
                <div className="bg-[#C97D3A]/10 border border-[#C97D3A]/30 rounded-lg p-3 text-sm text-[#F5ECD7]/80 italic flex items-start gap-2">
                  <span className="flex-1">{prompt}</span>
                  <button onClick={() => setPrompt('')} className="text-[#F5ECD7]/40 hover:text-[#F5ECD7]">
                    <X size={14} />
                  </button>
                </div>
              )}
              {!prompt && (
                <p className="text-xs text-[#F5ECD7]/30 mt-1">
                  Klik op "Willekeurige vraag" voor inspiratie.
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div>
            <Label className="label-base">Inhoud</Label>
            <Textarea
              className="input-base mt-1 min-h-[200px] resize-y"
              placeholder="Schrijf hier je gedachten…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <Label className="label-base flex items-center gap-1">
              <Tag size={11} />
              Tags (komma-gescheiden)
            </Label>
            <Input
              className="input-base mt-1"
              placeholder="bijv. werk, emotie, inzicht"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
            />
            {tagsRaw && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tagsRaw
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] border-[#C97D3A]/40 text-[#C97D3A] bg-[#C97D3A]/5"
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" className="btn-ghost" onClick={onClose}>
            Annuleren
          </Button>
          <Button
            className="btn-primary"
            onClick={handleSave}
            disabled={!title.trim() && !content.trim()}
          >
            {isEdit ? 'Opslaan' : 'Toevoegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Delete Confirmation Modal
// ---------------------------------------------------------------------------
function DeleteModal({ open, onClose, onConfirm, entryTitle }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#141414] border border-[#2a2a2a] text-[#F5ECD7] max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-playfair text-lg text-[#F5ECD7]">Entry verwijderen</DialogTitle>
        </DialogHeader>
        <p className="text-[#F5ECD7]/70 text-sm py-2">
          Weet je zeker dat je{' '}
          <span className="text-[#F5ECD7] font-medium">"{entryTitle}"</span> wilt verwijderen? Dit
          kan niet ongedaan worden gemaakt.
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
// Main Journal Component
// ---------------------------------------------------------------------------
export default function Journal() {
  const { journal, settings, addJournalEntry, updateJournalEntry, deleteJournalEntry } =
    useAppStore()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const prompts = settings?.journalPrompts ?? []

  // Filtered entries
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return [...(journal ?? [])].sort((a, b) => new Date(b.date) - new Date(a.date))
    return [...(journal ?? [])]
      .filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.content?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [journal, search])

  const handleSave = (data) => {
    if (data.id) {
      updateJournalEntry({ ...data, updatedAt: new Date().toISOString() })
      toast({ title: 'Entry bijgewerkt', description: data.title || 'Naamloos' })
    } else {
      addJournalEntry({
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      toast({ title: 'Entry toegevoegd', description: data.title || 'Naamloos' })
    }
    setAddModalOpen(false)
    setEditEntry(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteJournalEntry(deleteTarget.id)
    toast({ title: 'Entry verwijderd', variant: 'destructive' })
    setDeleteTarget(null)
  }

  return (
    <div className="relative min-h-full pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={22} className="text-[#C97D3A]" />
          <h1 className="section-title">Dagboek</h1>
        </div>
        <p className="section-subtitle">Schrijf, reflecteer en groei.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5ECD7]/30 pointer-events-none"
        />
        <Input
          className="input-base pl-9"
          placeholder="Zoek in entries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5ECD7]/40 hover:text-[#F5ECD7]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Stats row */}
      {journal?.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <FileText size={14} className="text-[#C97D3A]" />
            <span className="text-[#F5ECD7]/70 text-sm">
              <span className="text-[#F5ECD7] font-semibold">{journal.length}</span> entries
            </span>
          </div>
          {search && (
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Search size={14} className="text-[#C97D3A]" />
              <span className="text-[#F5ECD7]/70 text-sm">
                <span className="text-[#F5ECD7] font-semibold">{filtered.length}</span> resultaten
              </span>
            </div>
          )}
        </div>
      )}

      {/* Entry List */}
      {filtered.length === 0 && !search && <EmptyState onAdd={() => setAddModalOpen(true)} />}

      {filtered.length === 0 && search && (
        <div className="flex flex-col items-center py-16 text-center">
          <Search size={36} className="text-[#F5ECD7]/20 mb-3" />
          <p className="text-[#F5ECD7]/50 text-sm">Geen entries gevonden voor "{search}"</p>
          <button
            onClick={() => setSearch('')}
            className="mt-3 text-xs text-[#C97D3A] hover:underline"
          >
            Zoekopdracht wissen
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onClick={(e) => setEditEntry(e)}
              onDelete={(e) => setDeleteTarget(e)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#C97D3A] hover:bg-[#C97D3A]/90 text-white shadow-lg shadow-[#C97D3A]/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
        aria-label="Nieuwe entry toevoegen"
      >
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      <EntryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        entry={null}
        onSave={handleSave}
        prompts={prompts}
      />

      {/* Edit Modal */}
      <EntryModal
        open={Boolean(editEntry)}
        onClose={() => setEditEntry(null)}
        entry={editEntry}
        onSave={handleSave}
        prompts={prompts}
      />

      {/* Delete Confirmation */}
      <DeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        entryTitle={deleteTarget?.title || 'Naamloos'}
      />
    </div>
  )
}
