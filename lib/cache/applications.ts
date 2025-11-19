import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

// Cached function to fetch applications
export const getCachedApplications = cache(async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  )

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  return applications || []
})

// Cached function to fetch selections
export const getCachedSelections = cache(async (userId: string) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  )

  const { data: allSelections } = await supabase
    .from('selections')
    .select('application_id, subject, user_id')

  const mySelections = new Set<string>()

  allSelections?.forEach((s) => {
    if (s.user_id === userId) {
      mySelections.add(`${s.application_id}::${s.subject}`)
    }
  })

  return mySelections
})

