import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import useAppStore from '@/store/useAppStore'

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
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const { seedSampleData, seeded } = useAppStore()

  useEffect(() => {
    if (!seeded) seedSampleData()
  }, [seeded, seedSampleData])

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
