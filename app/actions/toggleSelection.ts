'use server'



import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'

import { revalidatePath } from 'next/cache'



export async function toggleSelection(applicationId: string) {

  const session = await getServerSession(authOptions)

  const userId = (session?.user as any)?.id



  if (!userId) return { error: 'Not logged in' }



  // Use Service Role to modify User Metadata

  const supabaseAdmin = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  // 1. Get current user data

  const { data: { user }, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId)

  

  if (fetchError || !user) return { error: 'User not found' }



  // 2. Get existing selections (or empty array)

  const currentSelections: string[] = user.user_metadata?.selections || []

  let newSelections = []



  // 3. Toggle logic

  if (currentSelections.includes(applicationId)) {

    // Remove

    newSelections = currentSelections.filter(id => id !== applicationId)

  } else {

    // Add

    newSelections = [...currentSelections, applicationId]

  }



  // 4. Save back to metadata

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {

    user_metadata: { ...user.user_metadata, selections: newSelections }

  })



  if (updateError) return { error: updateError.message }



  revalidatePath('/dashboard/applications')

  revalidatePath('/dashboard/chosen')

  return { success: true }

}

