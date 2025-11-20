'use client'

import ApplicationsTable from '@/components/dashboard/ApplicationsTable'
import { useApplications } from '@/lib/context/ApplicationsContext'

export default function ChosenPage() {
  const { shortlistedApplications, selections, selectionData, isLoading, error } = useApplications()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading shortlisted candidates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!shortlistedApplications || shortlistedApplications.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>
        <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow text-center text-gray-500">
          No candidates shortlisted yet.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>
      <ApplicationsTable 
        applications={shortlistedApplications} 
        initialSelections={selections} 
      />
    </div>
  )
}
