// localStorage persistence helpers — Supabase-ready structure
const KEYS = {
  journal: 'diary_journal',
  moods: 'diary_moods',
  schema: 'diary_schema',
  healthSport: 'diary_health_sport',
  healthNutrition: 'diary_health_nutrition',
  healthSleep: 'diary_health_sleep',
  healthTension: 'diary_health_tension',
  triggers: 'diary_triggers',
  relationships: 'diary_relationships',
  energy: 'diary_energy',
  checkins: 'diary_checkins',
  settings: 'diary_settings',
}

export const storage = {
  get: (key) => {
    try {
      const raw = localStorage.getItem(KEYS[key] || key)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(KEYS[key] || key, JSON.stringify(value))
    } catch (e) { console.error('Storage write failed', e) }
  },
  remove: (key) => localStorage.removeItem(KEYS[key] || key),
  clear: () => Object.values(KEYS).forEach((k) => localStorage.removeItem(k)),
  export: () => {
    const data = {}
    Object.entries(KEYS).forEach(([k, v]) => {
      const raw = localStorage.getItem(v)
      data[k] = raw ? JSON.parse(raw) : null
    })
    return data
  },
  import: (data) => {
    Object.entries(data).forEach(([k, v]) => {
      if (KEYS[k] && v !== undefined) {
        localStorage.setItem(KEYS[k], JSON.stringify(v))
      }
    })
  },
}

export const STORAGE_KEYS = KEYS
