'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Input validation helper
function validateInput(input: string, maxLength: number = 500): boolean {
  if (!input || typeof input !== 'string') return false
  if (input.length > maxLength) return false
  // Prevent SQL injection patterns and XSS
  const dangerousPatterns = /[<>'"\\;(){}[\]]/
  if (dangerousPatterns.test(input)) return false
  return true
}

export async function toggleSelection(applicationId: string, subject: string) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  if (!userId) return { error: 'Not logged in' }

  // Validate inputs
  if (!validateInput(applicationId, 100) || !validateInput(subject, 500)) {
    return { error: 'Invalid input data' }
  }

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
