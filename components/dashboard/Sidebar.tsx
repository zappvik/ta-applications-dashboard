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

    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-20">

      {/* Header - Height locked to h-16 */}

      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">

        <div className="flex items-center gap-3 overflow-hidden">

          {/* Icon */}

          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">

            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />

            </svg>

          </div>

          {/* Text Stack */}

          <div className="flex flex-col min-w-0 justify-center">

            <span className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate">

              Winter TA

            </span>

            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1 truncate">

              Applications

            </span>

          </div>

        </div>

      </div>

      

      {/* Navigation */}

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">

        {navigation.map((item) => {

          const isActive = pathname === item.href

          return (

            <Link

              key={item.name}

              href={item.href}

              className={`block py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${

                isActive

                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'

                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'

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
