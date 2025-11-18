import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'

import ApplicationsTable from '@/components/dashboard/ApplicationsTable'



export default async function ChosenPage() {

  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id



  if (!userId) return <div className="p-6">Please log in.</div>



  const supabase = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  const { data: selections } = await supabase

    .from('selections')

    .select('application_id, subject')

    .eq('user_id', userId)



  if (!selections || selections.length === 0) {

    return (

      <div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>

        <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow text-center text-gray-500">

          No candidates shortlisted yet.

        </div>

      </div>

    )

  }



  const appIds = Array.from(new Set(selections.map(s => s.application_id)))

  const selectionSet = new Set(selections.map(s => `${s.application_id}::${s.subject}`))



  const { data: applications } = await supabase

    .from('applications')

    .select('*')

    .in('id', appIds)

    .order('created_at', { ascending: false })



  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>

      <ApplicationsTable 

        applications={applications || []} 

        initialSelections={selectionSet} 

      />

    </div>

  )

}
