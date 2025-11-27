import LoginForm from '@/components/auth/LoginForm'
import Watermark from '@/components/Watermark'
import LoginRedirect from '@/components/auth/LoginRedirect'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main className="relative">
      <LoginRedirect />
      <LoginForm />
      <Watermark />
    </main>
  )
}