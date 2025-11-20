'use client'

import { Download, RefreshCw, FileText } from 'lucide-react'

export default function SettingsTipsCard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Reference
      </h2>
      
      <div className="space-y-5">
        <div>
          <div className="flex items-start gap-3 mb-2">
            <Download className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Shortlisted CSV Export
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                On the <strong>Shortlisted</strong> page, use the simplified CSV button (next to "Sort By") to export:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700">
                <code className="text-xs text-gray-800 dark:text-gray-200">
                  Name, Roll Number, Email, Subjects
                </code>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Each student appears once with all their shortlisted subjects in a comma-separated list. Suitable for mailing and sharing with other faculty members.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Full CSV Export
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                For complete application details, use the CSV button in the Applications page table which includes:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700">
                <code className="text-xs text-gray-800 dark:text-gray-200">
                  Student Name, Roll Number, Email, Subjects, Reason, Internship, Submitted Date
                </code>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Data Refresh
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Data automatically refreshes every <strong>30 minutes</strong>. Click the refresh icon in the header for manual updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

