import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export function exportToPDF(title = 'Dagboek Rapport') {
  const printContent = document.getElementById('print-area')
  if (!printContent) { window.print(); return }

  const originalTitle = document.title
  document.title = `${title} — ${format(new Date(), 'd MMMM yyyy', { locale: nl })}`
  window.print()
  document.title = originalTitle
}

export function exportToJSON(data, filename = 'dagboek-export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try { resolve(JSON.parse(e.target.result)) }
      catch { reject(new Error('Ongeldig JSON bestand')) }
    }
    reader.onerror = () => reject(new Error('Bestand kon niet worden gelezen'))
    reader.readAsText(file)
  })
}
