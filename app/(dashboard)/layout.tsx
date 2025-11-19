import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import DashboardWrapper from '@/components/dashboard/DashboardWrapper'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return <DashboardWrapper user={user}>{children}</DashboardWrapper>
}
