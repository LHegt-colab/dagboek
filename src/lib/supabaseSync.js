import { supabase } from './supabaseClient'

// Maps Zustand store keys to Supabase table names
const TABLE_MAP = {
  journal: 'journal',
  moods: 'moods',
  schema: 'schema_therapy',
  healthSport: 'health_sport',
  healthNutrition: 'health_nutrition',
  healthSleep: 'health_sleep',
  healthTension: 'health_tension',
  triggers: 'triggers',
  relationships: 'relationships',
  energy: 'energy',
  checkins: 'checkins',
}

/**
 * Upsert a single entry to Supabase.
 * Silently skips when offline or not authenticated.
 */
export async function upsertEntry(storeKey, entry, userId) {
  if (!userId || !navigator.onLine) return
  const table = TABLE_MAP[storeKey]
  if (!table) return

  const { error } = await supabase.from(table).upsert({
    id: entry.id,
    user_id: userId,
    data: entry,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt || new Date().toISOString(),
  })

  if (error) console.error(`[sync] upsert ${table}:`, error.message)
}

/**
 * Delete a single entry from Supabase.
 */
export async function deleteEntry(storeKey, id, userId) {
  if (!userId || !navigator.onLine) return
  const table = TABLE_MAP[storeKey]
  if (!table) return

  const { error } = await supabase.from(table).delete().eq('id', id).eq('user_id', userId)
  if (error) console.error(`[sync] delete ${table}:`, error.message)
}

/**
 * Fetch all data from Supabase for the logged-in user.
 * Returns an object with the same keys as the Zustand store,
 * or null on error.
 */
export async function fetchAllFromSupabase(userId) {
  if (!userId) return null

  const results = {}

  await Promise.all(
    Object.entries(TABLE_MAP).map(async ([storeKey, table]) => {
      const { data, error } = await supabase
        .from(table)
        .select('data')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(`[sync] fetch ${table}:`, error.message)
        results[storeKey] = []
      } else {
        results[storeKey] = (data || []).map((row) => row.data)
      }
    })
  )

  return results
}

/**
 * Push all local store data to Supabase (used after first login with existing local data).
 */
export async function pushAllToSupabase(storeState, userId) {
  if (!userId || !navigator.onLine) return

  await Promise.all(
    Object.keys(TABLE_MAP).map(async (storeKey) => {
      const entries = storeState[storeKey] || []
      if (entries.length === 0) return

      const rows = entries.map((entry) => ({
        id: entry.id,
        user_id: userId,
        data: entry,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt || entry.createdAt,
      }))

      const table = TABLE_MAP[storeKey]
      const { error } = await supabase.from(table).upsert(rows)
      if (error) console.error(`[sync] push ${table}:`, error.message)
    })
  )
}
