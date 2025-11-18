'use client'



import { signOut } from 'next-auth/react'



export default function LogoutButton() {

  return (

    <button

      onClick={() => signOut({ callbackUrl: '/login' })}

      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-900 dark:hover:text-red-400 transition-all duration-200"

    >

      <span>Logout</span>

      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />

      </svg>

    </button>

  )

}
