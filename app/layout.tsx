import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers' // <-- 1. IMPORT IT

export const metadata: Metadata = {
  title: 'Winter TA applications dashboard',
  description: 'View your applications.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers> {/* <-- 2. WRAP YOUR CHILDREN */}
      </body>
    </html>
  )
}