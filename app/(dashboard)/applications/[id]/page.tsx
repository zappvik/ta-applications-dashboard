import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Function to fetch a single application
async function getApplication(id: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching application:', error)
    return null
  }
  return data
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const app = await getApplication(params.id)

  if (!app) {
    notFound()
  }

  // Helper to format subjects (handling jsonb)
  const formatSubjects = (subjects: any) => {
    if (!subjects) return 'None selected'
    if (Array.isArray(subjects)) return subjects.join(', ')
    if (typeof subjects === 'object') return JSON.stringify(subjects)
    return String(subjects)
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        ← Back to List
      </Link>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Application Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Submitted on {new Date(app.created_at).toLocaleString()}
          </p>
        </div>

        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
            {/* Student Name */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Student Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {app.student_name}
              </dd>
            </div>

            {/* Roll Number */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Roll Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {app.roll_number}
              </dd>
            </div>

            {/* Email */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {app.email}
              </dd>
            </div>

            {/* Internship */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Internship Details
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {app.internship || 'N/A'}
              </dd>
            </div>

            {/* Selected Subjects */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Selected Subjects
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {formatSubjects(app.selected_subjects)}
              </dd>
            </div>

            {/* Reason */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reason
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {app.reason || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

