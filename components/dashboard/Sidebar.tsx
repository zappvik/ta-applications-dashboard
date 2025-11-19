'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Logo from '@/components/Logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Applications', href: '/dashboard/applications' },
  { name: 'Shortlisted', href: '/dashboard/chosen' },
  { name: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-20">
      <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex-shrink-0 box-border">
        <Logo size="md" showText={true} />
      </div>

      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
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
