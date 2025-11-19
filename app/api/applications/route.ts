import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
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
      .select('application_id, subject, user_id')

    const mySelections = new Set<string>()

    allSelections?.forEach((s) => {
      if (s.user_id === userId) {
        mySelections.add(`${s.application_id}::${s.subject}`)
      }
    })

    return NextResponse.json({
      applications: applications || [],
      selections: Array.from(mySelections),
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

