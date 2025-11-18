import { getServerSession } from 'next-auth'

import LogoutButton from '@/components/auth/LogoutButton'
import Sidebar from '@/components/dashboard/Sidebar'
import Breadcrumbs from '@/components/dashboard/Breadcrumbs'
import ThemeToggle from '@/components/ThemeToggle'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-black font-sans">
      <div className="hidden lg:flex lg:w-64 flex-shrink-0 z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center h-16 px-6">
            <Breadcrumbs />

            <div className="flex items-center gap-4">
              <span className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                {user?.name || 'Professor'}
              </span>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-black">{children}</main>
      </div>

      <ThemeToggle />
    </div>
  )
}
