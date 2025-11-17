'use server'



import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'



export async function updatePassword(password: string) {

  // 1. Verify the user is logged in via NextAuth

  const session = await getServerSession(authOptions)

  

  if (!session || !session.user || !(session.user as any).id) {

    return { error: 'You must be logged in to change your password.' }

  }



  const userId = (session.user as any).id



  // 2. Use Service Role Key to bypass RLS and update user

  const supabaseAdmin = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  const { error } = await supabaseAdmin.auth.admin.updateUserById(

    userId,

    { password: password }

  )



  if (error) {

    return { error: error.message }

  }



  return { success: true }

}

