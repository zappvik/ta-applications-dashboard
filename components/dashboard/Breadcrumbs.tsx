'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'



const routeNames: Record<string, string> = {

  '/dashboard': 'Overview',

  '/dashboard/applications': 'Applications',

  '/dashboard/chosen': 'Shortlisted',

  '/dashboard/settings': 'Settings',

  '/dashboard/admin/manage-users': 'Manage Professors',

}



export default function Breadcrumbs() {

  const pathname = usePathname()

  

  const currentPageName = routeNames[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'



  return (

    <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">

      <Link 

        href="/dashboard" 

        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"

      >

        Dashboard

      </Link>

      <span className="mx-2 opacity-50">/</span>

      <span className="capitalize select-none">

        {currentPageName}

      </span>

    </div>

  )

}

