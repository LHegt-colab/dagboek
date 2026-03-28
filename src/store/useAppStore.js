import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { generateSampleData } from '../data/sampleData'
import { defaultSettings } from '../data/defaultSettings'

const now = () => new Date().toISOString()

const makeEntry = (data) => ({
  ...data,
  id: data.id || uuidv4(),
  createdAt: data.createdAt || now(),
  updatedAt: data.updatedAt || now(),
})

const useAppStore = create(
  persist(
    (set, get) => ({
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
      seeded: false,

      // Seed with sample data on first load
      seedSampleData: () => {
        if (get().seeded) return
        const data = generateSampleData()
        set({ ...data, seeded: true })
      },

      // ── Journal ──────────────────────────────
      addJournalEntry: (data) => set((s) => ({ journal: [makeEntry(data), ...s.journal] })),
      updateJournalEntry: (id, data) => set((s) => ({
        journal: s.journal.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteJournalEntry: (id) => set((s) => ({ journal: s.journal.filter((e) => e.id !== id) })),

      // ── Moods ──────────────────────────────
      addMood: (data) => set((s) => ({ moods: [makeEntry(data), ...s.moods] })),
      updateMood: (id, data) => set((s) => ({
        moods: s.moods.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteMood: (id) => set((s) => ({ moods: s.moods.filter((e) => e.id !== id) })),

      // ── Schema Therapy ──────────────────────
      addSchemaEntry: (data) => set((s) => ({ schema: [makeEntry(data), ...s.schema] })),
      updateSchemaEntry: (id, data) => set((s) => ({
        schema: s.schema.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteSchemaEntry: (id) => set((s) => ({ schema: s.schema.filter((e) => e.id !== id) })),

      // ── Health: Sport ──────────────────────
      addSportEntry: (data) => set((s) => ({ healthSport: [makeEntry(data), ...s.healthSport] })),
      updateSportEntry: (id, data) => set((s) => ({
        healthSport: s.healthSport.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteSportEntry: (id) => set((s) => ({ healthSport: s.healthSport.filter((e) => e.id !== id) })),

      // ── Health: Nutrition ──────────────────
      addNutritionEntry: (data) => set((s) => ({ healthNutrition: [makeEntry(data), ...s.healthNutrition] })),
      updateNutritionEntry: (id, data) => set((s) => ({
        healthNutrition: s.healthNutrition.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteNutritionEntry: (id) => set((s) => ({ healthNutrition: s.healthNutrition.filter((e) => e.id !== id) })),

      // ── Health: Sleep ──────────────────────
      addSleepEntry: (data) => set((s) => ({ healthSleep: [makeEntry(data), ...s.healthSleep] })),
      updateSleepEntry: (id, data) => set((s) => ({
        healthSleep: s.healthSleep.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteSleepEntry: (id) => set((s) => ({ healthSleep: s.healthSleep.filter((e) => e.id !== id) })),

      // ── Health: Tension ──────────────────
      addTensionEntry: (data) => set((s) => ({ healthTension: [makeEntry(data), ...s.healthTension] })),
      updateTensionEntry: (id, data) => set((s) => ({
        healthTension: s.healthTension.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteTensionEntry: (id) => set((s) => ({ healthTension: s.healthTension.filter((e) => e.id !== id) })),

      // ── Triggers ──────────────────────────
      addTrigger: (data) => set((s) => ({ triggers: [makeEntry(data), ...s.triggers] })),
      updateTrigger: (id, data) => set((s) => ({
        triggers: s.triggers.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteTrigger: (id) => set((s) => ({ triggers: s.triggers.filter((e) => e.id !== id) })),

      // ── Relationships ──────────────────────
      addRelationship: (data) => set((s) => ({ relationships: [makeEntry(data), ...s.relationships] })),
      updateRelationship: (id, data) => set((s) => ({
        relationships: s.relationships.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteRelationship: (id) => set((s) => ({ relationships: s.relationships.filter((e) => e.id !== id) })),

      // ── Energy ────────────────────────────
      addEnergyEntry: (data) => set((s) => ({ energy: [makeEntry(data), ...s.energy] })),
      updateEnergyEntry: (id, data) => set((s) => ({
        energy: s.energy.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteEnergyEntry: (id) => set((s) => ({ energy: s.energy.filter((e) => e.id !== id) })),

      // ── Check-ins ─────────────────────────
      addCheckin: (data) => set((s) => ({ checkins: [makeEntry(data), ...s.checkins] })),
      updateCheckin: (id, data) => set((s) => ({
        checkins: s.checkins.map((e) => e.id === id ? { ...e, ...data, updatedAt: now() } : e),
      })),
      deleteCheckin: (id) => set((s) => ({ checkins: s.checkins.filter((e) => e.id !== id) })),

      // ── Settings ──────────────────────────
      updateSettings: (data) => set((s) => ({ settings: { ...s.settings, ...data } })),

      // ── Reset ─────────────────────────────
      resetAllData: () => set({
        journal: [], moods: [], schema: [],
        healthSport: [], healthNutrition: [], healthSleep: [], healthTension: [],
        triggers: [], relationships: [], energy: [], checkins: [],
        seeded: false,
      }),
      importData: (data) => set(data),
    }),
    {
      name: 'dagboek-store',
      partialize: (s) => ({
        journal: s.journal, moods: s.moods, schema: s.schema,
        healthSport: s.healthSport, healthNutrition: s.healthNutrition,
        healthSleep: s.healthSleep, healthTension: s.healthTension,
        triggers: s.triggers, relationships: s.relationships,
        energy: s.energy, checkins: s.checkins,
        settings: s.settings, seeded: s.seeded,
      }),
    }
  )
)

export default useAppStore
