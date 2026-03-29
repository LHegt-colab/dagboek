import { lazy, Suspense, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import useAppStore from './store/useAppStore'
import { fetchAllFromSupabase, pushAllToSupabase } from './lib/supabaseSync'
import Layout from '@/components/layout/Layout'
import Login from './pages/Login'

// Lazy-load all route-level modules
const Dashboard = lazy(() => import('@/modules/dashboard/Dashboard'))
const Journal = lazy(() => import('@/modules/journal/Journal'))
const MoodTracker = lazy(() => import('@/modules/mood/MoodTracker'))
const CheckIn = lazy(() => import('@/modules/checkin/CheckIn'))
const SchemaTherapy = lazy(() => import('@/modules/schema-therapy/SchemaTherapy'))
const Health = lazy(() => import('@/modules/health/Health'))
const Triggers = lazy(() => import('@/modules/triggers/Triggers'))
const Relationships = lazy(() => import('@/modules/relationships/Relationships'))
const Energy = lazy(() => import('@/modules/energy/Energy'))
const Reports = lazy(() => import('@/modules/reports/Reports'))
const Settings = lazy(() => import('@/modules/settings/Settings'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-noir-950">
      <div className="w-6 h-6 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()
  const { setUserId, importData, journal, moods, schema,
    healthSport, healthNutrition, healthSleep, healthTension,
    triggers, relationships, energy, checkins } = useAppStore()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (!user) {
      setUserId(null)
      syncedRef.current = false
      return
    }

    // Only sync once per login session
    if (syncedRef.current) return
    syncedRef.current = true

    setUserId(user.id)

    // Check if there's local data to push first
    const localData = { journal, moods, schema, healthSport, healthNutrition,
      healthSleep, healthTension, triggers, relationships, energy, checkins }
    const hasLocalData = Object.values(localData).some((arr) => arr.length > 0)

    if (hasLocalData) {
      // Push local data to Supabase, then load everything back
      pushAllToSupabase(localData, user.id).then(() =>
        fetchAllFromSupabase(user.id).then((data) => { if (data) importData(data) })
      )
    } else {
      // No local data — load from Supabase
      fetchAllFromSupabase(user.id).then((data) => { if (data) importData(data) })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (loading) return <PageLoader />
  if (!user) return <Login />

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="mood" element={<MoodTracker />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="schema" element={<SchemaTherapy />} />
          <Route path="health" element={<Health />} />
          <Route path="triggers" element={<Triggers />} />
          <Route path="relationships" element={<Relationships />} />
          <Route path="energy" element={<Energy />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
