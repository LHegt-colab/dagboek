import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import Header from './Header'
import { Toaster } from '@/components/ui/toaster'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-noir-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto pb-6">
          <div key={pathname} className="page-enter h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </div>
  )
}
