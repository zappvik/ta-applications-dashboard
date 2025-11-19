'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import Sidebar from '@/components/dashboard/Sidebar'
import LogoutButton from '@/components/auth/LogoutButton'
import Breadcrumbs from '@/components/dashboard/Breadcrumbs'
import HamburgerButton from '@/components/dashboard/HamburgerButton'

export default function DashboardWrapper({
  children,
  user,
  isInitialMobileOpen = false,
}: {
  children: React.ReactNode
  user: any
  isInitialMobileOpen?: boolean
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isInitialMobileOpen)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  // Show loading immediately when link is clicked
  const handleLinkClick = () => {
    setIsSidebarOpen(false)
    setIsLoading(true)
  }

  // Hide loading when pathname changes (page has loaded)
  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // Global click handler for all navigation links
  useEffect(() => {
    const handleNavigationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      if (link && link.getAttribute('href')?.startsWith('/dashboard')) {
        setIsLoading(true)
      }
    }

    document.addEventListener('click', handleNavigationClick)
    return () => document.removeEventListener('click', handleNavigationClick)
  }, [])

  // Only apply translate classes on mobile; desktop should always show sidebar
  const sidebarClasses = isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'

  return (
    <div className="flex w-full h-screen bg-gray-50 dark:bg-black overflow-hidden font-sans">
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 lg:static transition-transform duration-300 transform lg:w-64 flex-shrink-0 ${sidebarClasses}`}
      >
        <Sidebar onLinkClick={handleLinkClick} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-30">
          <div className="flex justify-between items-center h-16 px-6">
            <div className="flex items-center gap-3">
              <HamburgerButton isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <Breadcrumbs />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                {user?.name || 'User'}
              </span>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

