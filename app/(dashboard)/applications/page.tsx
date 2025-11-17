import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'

import ApplicationsTable from '@/components/dashboard/ApplicationsTable'

import InstructionsBanner from '@/components/dashboard/InstructionsBanner' // Import



async function getData() {

  const supabase = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )

  const { data: applications } = await supabase

    .from('applications')

    .select('*')

    .order('created_at', { ascending: false })

  return applications || []

}



async function getUserSelections(userId: string) {

  const supabase = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )

  const { data: { user } } = await supabase.auth.admin.getUserById(userId)

  return user?.user_metadata?.selections || []

}



export default async function ApplicationsPage() {

  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id

  

  const applications = await getData()

  const selections = userId ? await getUserSelections(userId) : []



  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">

        View Applications

      </h1>

      <p className="mt-2 mb-6 text-gray-600 dark:text-gray-300">

        Here is a list of all {applications.length} applications submitted.

      </p>



      {/* Added Instructions Banner */}

      <InstructionsBanner />



      <div className="mt-8">

        <ApplicationsTable 

          applications={applications} 

          initialSelections={new Set(selections)} 

        />

      </div>

    </div>

  )

}
