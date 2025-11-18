import './globals.css'

import type { Metadata } from 'next'

import Providers from './providers'

import ThemeToggle from '@/components/ThemeToggle'



export const metadata: Metadata = {

  title: 'Winter TA Applications Dashboard',

  description: 'View your applications.',

}



export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html lang="en" suppressHydrationWarning>

      <body className="antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-white">

        <Providers>

          {children}

          <ThemeToggle />

        </Providers>

      </body>

    </html>

  )

}
