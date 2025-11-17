import { getServerSession } from 'next-auth'

import LogoutButton from '@/components/auth/LogoutButton'

import Sidebar from '@/components/dashboard/Sidebar'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await getServerSession(authOptions)

  const user = session?.user



  return (

    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">

      {/* Sidebar */}

      <Sidebar />



      {/* Main Content Area */}

      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 z-10">

          <div className="flex justify-between items-center w-full">

            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">

              Welcome, <span className="capitalize">{user?.name || 'User'}</span>

            </h2>

            <div className="flex items-center gap-4">

              <LogoutButton />

            </div>

          </div>

        </header>

        

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">

          {children}

        </main>

      </div>

    </div>

  )

}
