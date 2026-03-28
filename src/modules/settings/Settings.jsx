import { useState, useRef } from 'react'
import { Save, Trash2, Upload, Download, AlertTriangle, Plus, X, RefreshCw } from 'lucide-react'
import useAppStore from '@/store/useAppStore'
import { defaultSettings } from '@/data/defaultSettings'
import { exportToJSON, importFromJSON } from '@/utils/exportPDF'
import { storage } from '@/utils/storage'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function Settings() {
  const { settings, updateSettings, resetAllData, seedSampleData, importData } = useAppStore()
  const { toast } = useToast()
  const [resetConfirm, setResetConfirm] = useState(false)
  const [newEmotion, setNewEmotion] = useState('')
  const [newMode, setNewMode] = useState({ label: '', description: '', color: '#C97D3A' })
  const [addModeOpen, setAddModeOpen] = useState(false)
  const fileInputRef = useRef(null)

  const handleSaveEmotion = () => {
    const trimmed = newEmotion.trim()
    if (!trimmed) return
    if (settings.emotionTags.includes(trimmed)) {
      toast({ title: 'Al bestaat', description: `"${trimmed}" staat al in de lijst.`, variant: 'destructive' })
      return
    }
    updateSettings({ emotionTags: [...settings.emotionTags, trimmed] })
    setNewEmotion('')
    toast({ title: 'Emotie toegevoegd', variant: 'success' })
  }

  const handleRemoveEmotion = (tag) => {
    updateSettings({ emotionTags: settings.emotionTags.filter((t) => t !== tag) })
  }

  const handleAddMode = () => {
    if (!newMode.label.trim()) return
    const mode = { id: newMode.label.toLowerCase().replace(/\s+/g, '_'), ...newMode }
    updateSettings({ schemaModes: [...settings.schemaModes, mode] })
    setNewMode({ label: '', description: '', color: '#C97D3A' })
    setAddModeOpen(false)
    toast({ title: 'Schema modus toegevoegd' })
  }

  const handleRemoveMode = (id) => {
    updateSettings({ schemaModes: settings.schemaModes.filter((m) => m.id !== id) })
  }

  const handleResetSettings = () => {
    updateSettings(defaultSettings)
    toast({ title: 'Instellingen hersteld', description: 'Standaardinstellingen teruggezet.' })
  }

  const handleExport = () => {
    const data = storage.export()
    exportToJSON(data, `dagboek-export-${format(new Date(), 'yyyy-MM-dd')}.json`)
    toast({ title: 'Data geëxporteerd', description: 'JSON bestand gedownload.' })
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importFromJSON(file)
      storage.import(data)
      importData(data)
      toast({ title: 'Import succesvol', description: 'Je data is hersteld.' })
    } catch {
      toast({ title: 'Import mislukt', description: 'Controleer het bestandsformaat.', variant: 'destructive' })
    }
    e.target.value = ''
  }

  const handleReset = () => {
    resetAllData()
    setResetConfirm(false)
    toast({ title: 'Data verwijderd', description: 'Alle data is gewist.', variant: 'destructive' })
  }

  const handleReseed = () => {
    resetAllData()
    setTimeout(() => { seedSampleData() }, 100)
    toast({ title: 'Voorbeelddata geladen', description: '14 dagen aan voorbeelddata toegevoegd.' })
  }

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="section-title">Instellingen</h1>
        <p className="section-subtitle">Pas de app aan naar jouw voorkeuren</p>
      </div>

      {/* Emotion tags */}
      <section className="glass-card p-5 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-cream-200">Emotie labels</h2>
          <p className="text-xs text-cream-200/40 font-body mt-0.5">Beschikbaar bij stemmingslogs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.emotionTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleRemoveEmotion(tag)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-noir-800 border border-cream-200/10 text-cream-200/60 hover:border-danger/40 hover:text-danger/70 transition-colors group"
            >
              {tag}
              <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newEmotion}
            onChange={(e) => setNewEmotion(e.target.value)}
            placeholder="Nieuwe emotie..."
            className="flex-1"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveEmotion() } }}
          />
          <Button onClick={handleSaveEmotion} disabled={!newEmotion.trim()} size="sm">
            <Plus className="w-3.5 h-3.5" />
            Voeg toe
          </Button>
        </div>
      </section>

      {/* Schema modes */}
      <section className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-cream-200">Schema modi</h2>
            <p className="text-xs text-cream-200/40 font-body mt-0.5">Beschikbaar bij schematherapie logs</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAddModeOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            Modus
          </Button>
        </div>
        <div className="space-y-2">
          {settings.schemaModes.map((mode) => (
            <div key={mode.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-noir-800 border border-cream-200/[0.06]">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: mode.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-cream-200/80">{mode.label}</p>
                {mode.description && <p className="text-xs text-cream-200/40 font-body truncate">{mode.description}</p>}
              </div>
              <button onClick={() => handleRemoveMode(mode.id)} className="text-cream-200/20 hover:text-danger/60 transition-colors p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Journal prompts */}
      <section className="glass-card p-5 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-cream-200">Dagboek prompts</h2>
          <p className="text-xs text-cream-200/40 font-body mt-0.5">Reflectievragen voor je dagboek</p>
        </div>
        <div className="space-y-2">
          {settings.journalPrompts.map((prompt, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-noir-800 border border-cream-200/[0.06]">
              <span className="text-xs text-amber/60 font-body font-medium w-5 shrink-0">{i + 1}.</span>
              <p className="text-xs font-body text-cream-200/60 flex-1">{prompt}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Data management */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-cream-200">Datagegevens</h2>
          <p className="text-xs text-cream-200/40 font-body mt-0.5">Exporteer, importeer of verwijder je data</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <ActionCard
            title="Exporteer data"
            description="Download al je data als JSON bestand"
            icon={Download}
            action={<Button variant="outline" size="sm" onClick={handleExport}><Download className="w-3.5 h-3.5" />Export JSON</Button>}
          />
          <ActionCard
            title="Importeer data"
            description="Herstel data vanuit een eerder export"
            icon={Upload}
            action={
              <>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-3.5 h-3.5" />Import JSON
                </Button>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              </>
            }
          />
          <ActionCard
            title="Voorbeelddata laden"
            description="Laad 14 dagen voorbeelddata opnieuw"
            icon={RefreshCw}
            action={<Button variant="outline" size="sm" onClick={handleReseed}><RefreshCw className="w-3.5 h-3.5" />Herlaad</Button>}
          />
          <ActionCard
            title="Reset instellingen"
            description="Zet alle instellingen terug naar standaard"
            icon={RefreshCw}
            action={<Button variant="outline" size="sm" onClick={handleResetSettings}><RefreshCw className="w-3.5 h-3.5" />Reset</Button>}
          />
        </div>

        {/* Danger zone */}
        <div className="p-4 rounded-xl border border-danger/20 bg-danger/5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <h3 className="text-sm font-body font-semibold text-danger">Gevarenzone</h3>
          </div>
          <p className="text-xs font-body text-cream-200/50">Dit verwijdert <strong>alle</strong> opgeslagen data permanent. Dit kan niet ongedaan gemaakt worden.</p>
          <Button variant="destructive" size="sm" onClick={() => setResetConfirm(true)}>
            <Trash2 className="w-3.5 h-3.5" />
            Verwijder alle data
          </Button>
        </div>
      </section>

      {/* About */}
      <section className="glass-card p-5 space-y-2">
        <h2 className="font-display text-base font-semibold text-cream-200">Over</h2>
        <div className="text-xs font-body text-cream-200/40 space-y-1">
          <p>Dagboek — Persoonlijk Inzicht v1.0.0</p>
          <p>Data wordt lokaal opgeslagen in je browser (localStorage).</p>
          <p>Supabase schema: <code className="text-amber/60">dagboek</code></p>
        </div>
      </section>

      {/* Add Mode Dialog */}
      <Dialog open={addModeOpen} onOpenChange={setAddModeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe schema modus</DialogTitle>
            <DialogDescription>Voeg een eigen modus toe aan je schematherapie tracking.</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div>
              <Label>Naam</Label>
              <Input value={newMode.label} onChange={(e) => setNewMode((p) => ({ ...p, label: e.target.value }))} placeholder="bijv. Zelfbeschermende Modus" />
            </div>
            <div>
              <Label>Beschrijving</Label>
              <Input value={newMode.description} onChange={(e) => setNewMode((p) => ({ ...p, description: e.target.value }))} placeholder="Korte omschrijving..." />
            </div>
            <div>
              <Label>Kleur</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={newMode.color} onChange={(e) => setNewMode((p) => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-cream-200/10 bg-noir-800 cursor-pointer" />
                <span className="text-sm font-body text-cream-200/50">{newMode.color}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddModeOpen(false)}>Annuleer</Button>
            <Button onClick={handleAddMode} disabled={!newMode.label.trim()}>Toevoegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirm Dialog */}
      <Dialog open={resetConfirm} onOpenChange={setResetConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weet je het zeker?</DialogTitle>
            <DialogDescription>Al je dagboekdata, stemmingen, slaaplogs en andere gegevens worden permanent verwijderd.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetConfirm(false)}>Annuleer</Button>
            <Button variant="destructive" onClick={handleReset}>
              <Trash2 className="w-3.5 h-3.5" />
              Ja, verwijder alles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ActionCard({ title, description, icon: Icon, action }) {
  return (
    <div className="glass-card p-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-cream-200/40 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-body font-medium text-cream-200/80">{title}</p>
          <p className="text-xs font-body text-cream-200/40 mt-0.5">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
