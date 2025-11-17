import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { supabase } from '@/lib/supabase'

import { redirect } from 'next/navigation'

import UsersTable from '@/components/dashboard/UsersTable'



export default async function ManageUsersPage() {

  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role

  if (userRole !== 'admin') redirect('/dashboard')

  

  const { data } = await supabase.from('professors').select('*').order('created_at', { ascending: false })

  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Professors</h1>

      <p className="mt-2 text-gray-600 dark:text-gray-300">Admin only access.</p>

      <div className="mt-8"><UsersTable users={data || []} /></div>

    </div>

  )

}
