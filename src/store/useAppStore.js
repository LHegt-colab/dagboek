import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { defaultSettings } from '../data/defaultSettings'
import { upsertEntry, deleteEntry } from '../lib/supabaseSync'

const now = () => new Date().toISOString()

const makeEntry = (data) => ({
  ...data,
  id: data.id || uuidv4(),
  createdAt: data.createdAt || now(),
  updatedAt: data.updatedAt || now(),
})

const useAppStore = create(
  persist(
    (set, get) => {
      // Helpers that call Supabase in the background (fire-and-forget)
      const up = (storeKey, entry) => {
        const { userId } = get()
        if (userId) upsertEntry(storeKey, entry, userId)
      }
      const del = (storeKey, id) => {
        const { userId } = get()
        if (userId) deleteEntry(storeKey, id, userId)
      }

      return {
        // Auth
        userId: null,
        setUserId: (id) => set({ userId: id }),

        // State
        journal: [],
        moods: [],
        schema: [],
        healthSport: [],
        healthNutrition: [],
        healthSleep: [],
        healthTension: [],
        triggers: [],
        relationships: [],
        energy: [],
        checkins: [],
        settings: defaultSettings,

        // ── Journal ──────────────────────────────
        addJournalEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ journal: [entry, ...s.journal] }))
          up('journal', entry)
        },
        updateJournalEntry: (id, data) => {
          set((s) => ({
            journal: s.journal.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().journal.find((e) => e.id === id)
          if (updated) up('journal', updated)
        },
        deleteJournalEntry: (id) => {
          set((s) => ({ journal: s.journal.filter((e) => e.id !== id) }))
          del('journal', id)
        },

        // ── Moods ──────────────────────────────
        addMood: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ moods: [entry, ...s.moods] }))
          up('moods', entry)
        },
        updateMood: (id, data) => {
          set((s) => ({
            moods: s.moods.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().moods.find((e) => e.id === id)
          if (updated) up('moods', updated)
        },
        deleteMood: (id) => {
          set((s) => ({ moods: s.moods.filter((e) => e.id !== id) }))
          del('moods', id)
        },

        // ── Schema Therapy ──────────────────────
        addSchemaEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ schema: [entry, ...s.schema] }))
          up('schema', entry)
        },
        updateSchemaEntry: (id, data) => {
          set((s) => ({
            schema: s.schema.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().schema.find((e) => e.id === id)
          if (updated) up('schema', updated)
        },
        deleteSchemaEntry: (id) => {
          set((s) => ({ schema: s.schema.filter((e) => e.id !== id) }))
          del('schema', id)
        },

        // ── Health: Sport ──────────────────────
        addSportEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ healthSport: [entry, ...s.healthSport] }))
          up('healthSport', entry)
        },
        updateSportEntry: (id, data) => {
          set((s) => ({
            healthSport: s.healthSport.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().healthSport.find((e) => e.id === id)
          if (updated) up('healthSport', updated)
        },
        deleteSportEntry: (id) => {
          set((s) => ({ healthSport: s.healthSport.filter((e) => e.id !== id) }))
          del('healthSport', id)
        },

        // ── Health: Nutrition ──────────────────
        addNutritionEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ healthNutrition: [entry, ...s.healthNutrition] }))
          up('healthNutrition', entry)
        },
        updateNutritionEntry: (id, data) => {
          set((s) => ({
            healthNutrition: s.healthNutrition.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().healthNutrition.find((e) => e.id === id)
          if (updated) up('healthNutrition', updated)
        },
        deleteNutritionEntry: (id) => {
          set((s) => ({ healthNutrition: s.healthNutrition.filter((e) => e.id !== id) }))
          del('healthNutrition', id)
        },

        // ── Health: Sleep ──────────────────────
        addSleepEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ healthSleep: [entry, ...s.healthSleep] }))
          up('healthSleep', entry)
        },
        updateSleepEntry: (id, data) => {
          set((s) => ({
            healthSleep: s.healthSleep.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().healthSleep.find((e) => e.id === id)
          if (updated) up('healthSleep', updated)
        },
        deleteSleepEntry: (id) => {
          set((s) => ({ healthSleep: s.healthSleep.filter((e) => e.id !== id) }))
          del('healthSleep', id)
        },

        // ── Health: Tension ──────────────────
        addTensionEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ healthTension: [entry, ...s.healthTension] }))
          up('healthTension', entry)
        },
        updateTensionEntry: (id, data) => {
          set((s) => ({
            healthTension: s.healthTension.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().healthTension.find((e) => e.id === id)
          if (updated) up('healthTension', updated)
        },
        deleteTensionEntry: (id) => {
          set((s) => ({ healthTension: s.healthTension.filter((e) => e.id !== id) }))
          del('healthTension', id)
        },

        // ── Triggers ──────────────────────────
        addTrigger: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ triggers: [entry, ...s.triggers] }))
          up('triggers', entry)
        },
        updateTrigger: (id, data) => {
          set((s) => ({
            triggers: s.triggers.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().triggers.find((e) => e.id === id)
          if (updated) up('triggers', updated)
        },
        deleteTrigger: (id) => {
          set((s) => ({ triggers: s.triggers.filter((e) => e.id !== id) }))
          del('triggers', id)
        },

        // ── Relationships ──────────────────────
        addRelationship: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ relationships: [entry, ...s.relationships] }))
          up('relationships', entry)
        },
        updateRelationship: (id, data) => {
          set((s) => ({
            relationships: s.relationships.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().relationships.find((e) => e.id === id)
          if (updated) up('relationships', updated)
        },
        deleteRelationship: (id) => {
          set((s) => ({ relationships: s.relationships.filter((e) => e.id !== id) }))
          del('relationships', id)
        },

        // ── Energy ────────────────────────────
        addEnergyEntry: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ energy: [entry, ...s.energy] }))
          up('energy', entry)
        },
        updateEnergyEntry: (id, data) => {
          set((s) => ({
            energy: s.energy.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().energy.find((e) => e.id === id)
          if (updated) up('energy', updated)
        },
        deleteEnergyEntry: (id) => {
          set((s) => ({ energy: s.energy.filter((e) => e.id !== id) }))
          del('energy', id)
        },

        // ── Check-ins ─────────────────────────
        addCheckin: (data) => {
          const entry = makeEntry(data)
          set((s) => ({ checkins: [entry, ...s.checkins] }))
          up('checkins', entry)
        },
        updateCheckin: (id, data) => {
          set((s) => ({
            checkins: s.checkins.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
          }))
          const updated = get().checkins.find((e) => e.id === id)
          if (updated) up('checkins', updated)
        },
        deleteCheckin: (id) => {
          set((s) => ({ checkins: s.checkins.filter((e) => e.id !== id) }))
          del('checkins', id)
        },

        // ── Settings ──────────────────────────
        updateSettings: (data) => set((s) => ({ settings: { ...s.settings, ...data } })),

        // ── Reset ─────────────────────────────
        resetAllData: () => {
          localStorage.removeItem('dagboek-store-v2')
          set({
            journal: [], moods: [], schema: [],
            healthSport: [], healthNutrition: [], healthSleep: [], healthTension: [],
            triggers: [], relationships: [], energy: [], checkins: [],
          })
        },

        importData: (data) => set(data),
      }
    },
    {
      name: 'dagboek-store-v2',
      partialize: (s) => ({
        journal: s.journal, moods: s.moods, schema: s.schema,
        healthSport: s.healthSport, healthNutrition: s.healthNutrition,
        healthSleep: s.healthSleep, healthTension: s.healthTension,
        triggers: s.triggers, relationships: s.relationships,
        energy: s.energy, checkins: s.checkins,
        settings: s.settings,
        // userId is NOT persisted — comes from Supabase session on every load
      }),
    }
  )
)

export default useAppStore
