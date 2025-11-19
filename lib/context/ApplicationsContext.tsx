'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Application = {
  id: string
  created_at: string
  student_name: string
  roll_number: string
  email: string
  reason: string | null
  internship: string | null
  selected_subjects: any[] | null
}

type ApplicationsContextType = {
  applications: Application[]
  selections: Set<string>
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  // Derived data
  totalCount: number
  recentApplications: Application[]
  chosenCount: number
  shortlistedApplications: Application[]
}

export const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined)

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [selections, setSelections] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Derived data - computed from applications and selections
  const totalCount = applications.length
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  
  // Get unique application IDs from selections
  const chosenApplicationIds = new Set(
    Array.from(selections).map((s) => s.split('::')[0])
  )
  const chosenCount = chosenApplicationIds.size
  
  // Filter applications that are shortlisted
  const shortlistedApplications = applications.filter((app) =>
    chosenApplicationIds.has(app.id)
  )

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/applications')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch applications: ${response.status}`)
      }

      const data = await response.json()
      console.log('ApplicationsContext - Fetched data:', {
        applicationsCount: data.applications?.length || 0,
        selectionsCount: data.selections?.length || 0
      })
      setApplications(data.applications || [])
      setSelections(new Set(data.selections || []))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Error fetching applications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
    
    // Auto-refresh every 30 seconds to get new applications in real-time
    const interval = setInterval(() => {
      fetchApplications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        selections,
        isLoading,
        error,
        refresh: fetchApplications,
        // Derived data
        totalCount,
        recentApplications,
        chosenCount,
        shortlistedApplications,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = useContext(ApplicationsContext)
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider')
  }
  return context
}

