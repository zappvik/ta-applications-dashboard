'use client'

import { MessageSquare } from 'lucide-react'

export default function FeatureRequestButton() {
  const handleFeatureRequest = () => {
    const email = 'cb.sc.u4cse24522@cb.students.amrita.edu'
    const message = encodeURIComponent(
      'Hello, I would like to suggest a feature enhancement for the TA Applications Dashboard. Could we discuss this further?'
    )
    
    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}&message=${message}`
    window.open(teamsUrl, '_blank')
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Have a Feature Idea?
      </h2>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        We're always looking to improve! Share your suggestions or feature requests with our development team.
      </p>
      
      <button
        onClick={handleFeatureRequest}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
      >
        <MessageSquare className="w-5 h-5" />
        Request Feature from Developer
      </button>
      
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">
        Opens Microsoft Teams chat in a new tab
      </p>
    </div>
  )
}

