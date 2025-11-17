import { supabase } from '@/lib/supabase'

import Link from 'next/link'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'



async function getDashboardData() {

  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id



  const supabaseAdmin = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  const { count, error: countError } = await supabase

    .from('applications')

    .select('*', { count: 'exact', head: true })



  const { data: recentApps, error: listError } = await supabase

    .from('applications')

    .select('id, student_name, email, created_at')

    .order('created_at', { ascending: false })

    .limit(5)



  let chosenCount = 0

  if (userId) {

    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)

    chosenCount = user?.user_metadata?.selections?.length || 0

  }



  if (countError || listError) {

    console.error('Error fetching dashboard data')

  }



  return { 

    total: count || 0, 

    recent: recentApps || [],

    chosenCount

  }

}



export default async function DashboardPage() {

  const { total, recent, chosenCount } = await getDashboardData()



  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">

        Dashboard Overview

      </h1>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">

            Total Applications

          </h3>

          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">

            {total}

          </p>

        </div>



        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">

            Shortlisted

          </h3>

          <p className="mt-2 text-4xl font-bold text-green-600 dark:text-green-400">

            {chosenCount}

          </p>

          <p className="text-xs text-gray-400 mt-1">Candidates shortlisted by you</p>

        </div>

      </div>



      <div className="mt-8">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">

            Recent Activity

          </h2>

          <Link href="/dashboard/applications" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">

            View All &rarr;

          </Link>

        </div>



        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">

          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

            <thead className="bg-gray-50 dark:bg-gray-700">

              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>

              </tr>

            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">

              {recent.length > 0 ? (

                recent.map((app) => (

                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{app.student_name}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.email}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{new Date(app.created_at).toLocaleDateString()}</td>

                  </tr>

                ))

              ) : (

                <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No applications yet.</td></tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}
