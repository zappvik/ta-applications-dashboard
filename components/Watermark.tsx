'use client'

import { usePathname } from 'next/navigation'

export default function Watermark() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  const baseClasses =
    'text-xs font-medium dark:text-gray-300 text-gray-500 tracking-wide opacity-90 pointer-events-none'

  const positionClasses = isLoginPage ? 'left-0 w-full text-center' : 'left-6 text-left'

  return (
    <div className={`fixed bottom-4 z-50 ${positionClasses}`}>
      <p className={baseClasses}>Built by Lohit for Team SE @ Amrita</p>
    </div>
  )
}
