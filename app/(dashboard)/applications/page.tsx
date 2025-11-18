import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'

import ApplicationsTable from '@/components/dashboard/ApplicationsTable'

import InstructionsBanner from '@/components/dashboard/InstructionsBanner'



export default async function ApplicationsPage() {

  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id



  const supabase = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  const { data: applications } = await supabase

    .from('applications')

    .select('*')

    .order('created_at', { ascending: false })



  const { data: allSelections } = await supabase

    .from('selections')

    .select('application_id, subject, user_id')

    

  const mySelections = new Set<string>()

  const takenSelections = new Set<string>()



  allSelections?.forEach(s => {

    const key = `${s.application_id}::${s.subject}`

    if (s.user_id === userId) {

      mySelections.add(key)

    } else {

      takenSelections.add(key)

    }

  })



  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">

        View Applications

      </h1>

      <p className="mt-2 mb-6 text-gray-600 dark:text-gray-300">

        Here is a list of all {applications?.length || 0} applications submitted.

      </p>



      <InstructionsBanner />



      <div className="mt-8">

        <ApplicationsTable 

          applications={applications || []} 

          initialSelections={mySelections}

          takenSelections={takenSelections}

        />

      </div>

    </div>

  )

}
