import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Allow caching for better performance
// Cache will be invalidated by revalidatePath in server actions
// When client requests with cache: 'no-store', it will bypass cache and fetch fresh data
export const revalidate = 30 // Revalidate every 30 seconds

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const { data: allSelections } = await supabase
      .from('selections')
      .select('application_id, subject, user_id, created_at')
      .order('created_at', { ascending: false })

    const mySelections = new Set<string>()
    const selectionData: Record<string, { subject: string; created_at: string }> = {}

    allSelections?.forEach((s) => {
      if (s.user_id === userId) {
        const key = `${s.application_id}::${s.subject}`
        mySelections.add(key)
        if (s.created_at) {
          selectionData[key] = {
            subject: s.subject,
            created_at: s.created_at,
          }
        }
      }
    })

    const response = NextResponse.json({
      applications: applications || [],
      selections: Array.from(mySelections),
      selectionData,
    })

    response.headers.set('Cache-Control', 'private, s-maxage=30, stale-while-revalidate=60')

    return response
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

