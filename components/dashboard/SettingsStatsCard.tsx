'use client'

import { useApplications } from '@/lib/context/ApplicationsContext'
import { FileText, Users, Clock } from 'lucide-react'

export default function SettingsStatsCard() {
  const { totalCount, chosenCount, isLoading } = useApplications()

  const stats = [
    {
      label: 'Total Applications',
      value: totalCount,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Shortlisted Candidates',
      value: chosenCount,
      icon: Users,
      color: 'green',
    },
    {
      label: 'Selection Rate',
      value: totalCount > 0 ? `${Math.round((chosenCount / totalCount) * 100)}%` : '0%',
      icon: Clock,
      color: 'purple',
    },
  ]

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Account Statistics
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
          }
          
          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

