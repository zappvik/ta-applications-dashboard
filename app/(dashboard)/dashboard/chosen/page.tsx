import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'

import ApplicationsTable from '@/components/dashboard/ApplicationsTable'



export default async function ChosenPage() {

  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id



  if (!userId) return <div className="p-6">Please log in to view shortlisted candidates.</div>



  // Use Service Role to fetch User Metadata

  const supabaseAdmin = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  // 1. Get Selections from Metadata

  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)

  const chosenIds: string[] = user?.user_metadata?.selections || []



  if (chosenIds.length === 0) {

    return (

      <div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>

        <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow text-center text-gray-500">

          You haven't shortlisted any candidates yet. Go to the Applications page to select some.

        </div>

      </div>

    )

  }



  // 2. Fetch Application Data

  const { data: applications } = await supabaseAdmin

    .from('applications')

    .select('*')

    .in('id', chosenIds)

    .order('created_at', { ascending: false })



  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>

      <ApplicationsTable 

        applications={applications || []} 

        initialSelections={new Set(chosenIds)} 

      />

    </div>

  )

}

