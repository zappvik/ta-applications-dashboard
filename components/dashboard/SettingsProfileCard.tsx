'use client'

import { UserCog } from 'lucide-react'

export default function SettingsProfileCard({ user }: { user: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Profile Information
      </h2>
      
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <UserCog className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Username
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {user?.name || 'Not available'}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-all">
                {user?.email || 'Not available'}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User ID
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono break-all">
                {user?.id || 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

