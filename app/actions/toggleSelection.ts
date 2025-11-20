'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function toggleSelection(applicationId: string, subject: string) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  if (!userId) return { error: 'Not logged in' }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  const { data: existing } = await supabase
    .from('selections')
    .select('id')
    .eq('user_id', userId)
    .eq('application_id', applicationId)
    .eq('subject', subject)
    .single()

  if (existing) {
    await supabase.from('selections').delete().eq('id', existing.id)
  } else {
    await supabase.from('selections').insert({ user_id: userId, application_id: applicationId, subject })
  }

  revalidatePath('/dashboard/applications')
  revalidatePath('/dashboard/chosen')
  return { success: true }
}
