import './globals.css'

import type { Metadata } from 'next'

import Providers from './providers'
import Watermark from '@/components/Watermark'

export const metadata: Metadata = {
  title: 'TA Admin Portal',
  description: 'View your applications.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900 dark:bg-[#020617] dark:text-white transition-colors duration-200 ease-in-out relative overflow-x-hidden">
        <Providers>
          <div className="relative z-10 min-h-screen">
            {children}
            <Watermark />
          </div>
        </Providers>
      </body>
    </html>
  )
}
