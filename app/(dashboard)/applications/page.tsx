'use client'

import ApplicationsTable from '@/components/dashboard/ApplicationsTable'
import InstructionsBanner from '@/components/dashboard/InstructionsBanner'
import { useApplications } from '@/lib/context/ApplicationsContext'

export default function ApplicationsPage() {
  const { applications, selections, isLoading, error, refresh } = useApplications()

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading applications...</p>
        </div>
      </div>
    )
  }

  if (error && applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error: {error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">View Applications</h1>
      <p className="mt-2 mb-6 text-gray-600 dark:text-gray-300">
        Here is a list of all {applications?.length || 0} applications submitted.
        {error && <span className="text-red-600 dark:text-red-400 ml-2">(Error: {error})</span>}
        {isLoading && <span className="text-blue-600 dark:text-blue-400 ml-2">(Loading...)</span>}
      </p>

      <InstructionsBanner />

      <div className="mt-8">
        <ApplicationsTable />
      </div>
    </div>
  )
}
