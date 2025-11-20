'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import LogoutButton from '@/components/auth/LogoutButton'
import HamburgerButton from '@/components/dashboard/HamburgerButton'
import { ApplicationsProvider, useApplications } from '@/lib/context/ApplicationsContext'

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
  
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  const handleLinkClick = (href?: string) => {
    setIsSidebarOpen(false)
    if (href && href !== pathname) {
      setIsLoading(true)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (isLoading) {
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(fallbackTimer)
    }
  }, [isLoading])

  useEffect(() => {
    const handleNavigationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      if (link) {
        const href = link.getAttribute('href')
        if (href?.startsWith('/dashboard') && href !== pathnameRef.current) {
          setIsLoading(true)
        }
      }
    }

    document.addEventListener('click', handleNavigationClick)
    return () => document.removeEventListener('click', handleNavigationClick)
  }, [])

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
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-30 h-16">
          <div className="flex justify-between items-center h-full px-3 sm:px-6 box-border">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
              <HamburgerButton isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="min-w-0 flex-1 overflow-hidden">
                <HeaderBreadcrumbs onLinkClick={handleLinkClick} />
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
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

function HeaderBreadcrumbs({ onLinkClick }: { onLinkClick: (href?: string) => void }) {
  const pathname = usePathname()
  
  const routeNames: Record<string, string> = {
    '/dashboard': 'Home',
    '/dashboard/applications': 'Applications',
    '/dashboard/chosen': 'Shortlisted',
    '/dashboard/settings': 'Settings',
    '/dashboard/admin/manage-users': 'Manage Professors',
  }

  const segments: Array<{ path: string; name: string }> = []
  const pathParts = pathname.split('/').filter(Boolean)
  
  segments.push({ path: '/dashboard', name: 'Dashboard' })
  
  const currentName = routeNames[pathname] || pathParts[pathParts.length - 1]?.replace(/-/g, ' ') || 'Page'
  segments.push({ path: pathname, name: currentName })

  return (
    <nav className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2 min-w-0">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          return (
            <li key={`${segment.path}-${index}`} className="flex items-center min-w-0">
              {index > 0 && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400 dark:text-gray-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-white capitalize truncate">
                  {segment.name}
                </span>
              ) : (
                <Link
                  href={segment.path}
                  onClick={(e) => {
                    if (segment.path === pathname) {
                      e.preventDefault()
                      return
                    }
                    onLinkClick(segment.path)
                  }}
                  className="font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize truncate"
                >
                  {index === 0 ? 'Dashboard' : segment.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function HeaderActions({ user }: { user: any }) {
  const { refresh, isLoading } = useApplications()
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

      <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
      <span className="hidden md:inline text-base font-semibold text-gray-900 dark:text-white capitalize">
        {user?.name || 'User'}
      </span>
      <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

      <LogoutButton />
    </>
  )
}
