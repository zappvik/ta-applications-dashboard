'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import Sidebar from '@/components/dashboard/Sidebar'
import LogoutButton from '@/components/auth/LogoutButton'
import Breadcrumbs from '@/components/dashboard/Breadcrumbs'
import HamburgerButton from '@/components/dashboard/HamburgerButton'
import { ApplicationsProvider, useApplications } from '@/lib/context/ApplicationsContext'
import { useTheme } from 'next-themes'

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
  const pathnameRef = useRef(pathname)
  
  // Keep ref in sync with pathname
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

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
      if (link) {
        const href = link.getAttribute('href')
        // Only show loading if navigating to a different page
        if (href?.startsWith('/dashboard') && href !== pathnameRef.current) {
          setIsLoading(true)
        }
      }
    }

    document.addEventListener('click', handleNavigationClick)
    return () => document.removeEventListener('click', handleNavigationClick)
  }, [])

  // Only apply translate classes on mobile; desktop should always show sidebar
  const sidebarClasses = isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'

  return (
    <ApplicationsProvider>
      <DashboardContent
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebarClasses={sidebarClasses}
        handleLinkClick={handleLinkClick}
        isLoading={isLoading}
      >
        {children}
      </DashboardContent>
    </ApplicationsProvider>
  )
}

// Inner component that has access to ApplicationsProvider context
function DashboardContent({
  user,
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarClasses,
  handleLinkClick,
  isLoading,
  children,
}: {
  user: any
  isSidebarOpen: boolean
  setIsSidebarOpen: (state: boolean) => void
  sidebarClasses: string
  handleLinkClick: () => void
  isLoading: boolean
  children: React.ReactNode
}) {
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

            <div className="flex items-center gap-3">
              <HeaderActions user={user} />
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

// Header Actions Component
function HeaderActions({ user }: { user: any }) {
  const { refresh, totalCount, chosenCount, isLoading } = useApplications()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  if (!mounted) return null

  return (
    <>
      {/* Quick Stats - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {totalCount} Total
          </span>
        </div>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {chosenCount} Shortlisted
          </span>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing || isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh data"
      >
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Divider and User Name - Hidden on mobile */}
      <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
      <span className="hidden md:inline text-base font-semibold text-gray-900 dark:text-white capitalize">
        {user?.name || 'User'}
      </span>
      <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Logout - Always visible */}
      <LogoutButton />
    </>
  )
}

