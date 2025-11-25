'use client'

import { MessageSquare } from 'lucide-react'

export default function FeatureRequestButton() {
  const handleFeedback = () => {
    const email = 'cb.sc.u4cse24522@cb.students.amrita.edu'
    const message = encodeURIComponent(
      'Hi Lohit! I would like to share some feedback about the TA Admin Portal. Could we chat for a few minutes when you are available?'
    )

    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}&message=${message}`
    window.open(teamsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Share Feedback
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Have feedback or a concern? Start a Teams chat with the developer instantly and we’ll work with you to get it resolved.
      </p>

      <button
        onClick={handleFeedback}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
      >
        <MessageSquare className="w-5 h-5" />
        Message Developer in Teams
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">
        Opens Microsoft Teams chat in a new tab
      </p>
    </div>
  )
}

