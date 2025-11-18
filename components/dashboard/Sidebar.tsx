'use client'



import Link from 'next/link'

import { usePathname } from 'next/navigation'



const navigation = [

  { name: 'Dashboard', href: '/dashboard' },

  { name: 'Applications', href: '/dashboard/applications' },

  { name: 'Shortlisted', href: '/dashboard/chosen' },

  { name: 'Settings', href: '/dashboard/settings' },

]



export default function Sidebar() {

  const pathname = usePathname()



  return (

    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-20 transition-colors duration-300">

      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">

        <div className="flex items-center gap-3">

          <svg className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">

            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 002.1 10.057a.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />

            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.438.227 2.945.227 4.53 0 5.927-2.604 9.16-8.153 11.269a.75.75 0 01-.6 0C6.604 25.97 4 22.736 4 16.809c0-1.605.096-3.133.234-4.589a48.863 48.863 0 017.558 3.24l.434.227.019.009.018-.008z" />

          </svg>

          

          <div className="flex flex-col justify-center">

            <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight leading-none">

              Winter <span className="text-blue-600 dark:text-blue-500">TA</span>

            </span>

            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase mt-0.5">

              Admin Portal

            </span>

          </div>

        </div>

      </div>

      

      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">

        {navigation.map((item) => {

          const isActive = pathname === item.href

          return (

            <Link

              key={item.name}

              href={item.href}

              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${

                isActive

                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'

                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'

              }`}

            >

              {item.name}

            </Link>

          )

        })}

      </nav>

    </aside>

  )

}
