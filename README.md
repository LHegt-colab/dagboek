# Dagboek — Persoonlijk Inzicht

Een complete persoonlijk dagboek- en zelfinsight-app gebouwd met React + Vite + Supabase.

**Live:** via Netlify
**Repo:** https://github.com/LHegt-colab/dagboek

---

## Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** Tailwind CSS + shadcn/ui componenten
- **State:** Zustand (localStorage persistentie)
- **Database:** Supabase (schema: `dagboek`)
- **Charts:** Chart.js via react-chartjs-2
- **Deploy:** Netlify
- **Fonts:** Playfair Display + DM Sans

## Modules

| Module | Route |
|--------|-------|
| Dashboard | `/` |
| Dagboek | `/journal` |
| Stemming | `/mood` |
| Check-in | `/checkin` |
| Schematherapie | `/schema` |
| Gezondheid | `/health` |
| Triggers & Gedachten | `/triggers` |
| Relaties | `/relationships` |
| Energie & Flow | `/energy` |
| Rapporten | `/reports` |
| Instellingen | `/settings` |

---

## Lokale setup

### 1. Clone de repo

```bash
git clone https://github.com/LHegt-colab/dagboek.git
cd dagboek
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Maak `.env.local` aan

```bash
cp .env.example .env.local
```

Vul in:
```
VITE_SUPABASE_URL=https://tvrvzxizradybqnfsqpn.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

### 4. Start de dev server

```bash
npm run dev
```

Open http://localhost:5173

---

## Supabase setup

Het project gebruikt een eigen schema `dagboek` (apart van het `public` schema).

De migratie is al toegepast. Tabellen:
- `dagboek.journal`
- `dagboek.moods`
- `dagboek.schema_therapy`
- `dagboek.health_sport`
- `dagboek.health_nutrition`
- `dagboek.health_sleep`
- `dagboek.health_tension`
- `dagboek.triggers`
- `dagboek.relationships`
- `dagboek.energy`
- `dagboek.checkins`
- `dagboek.settings`

---

## Netlify deploy

1. Verbind de GitHub repo in Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Voeg environment variables toe in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## Data & Privacy

Alle data wordt **lokaal opgeslagen** in je browser (localStorage). Er wordt niets automatisch naar Supabase verstuurd — de Supabase integratie is klaar voor toekomstige sync.

Data exporteren: ga naar **Instellingen → Export JSON**
