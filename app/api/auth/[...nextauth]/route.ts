import NextAuth from 'next-auth'

import type { AuthOptions } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

import { createClient } from '@supabase/supabase-js'

// Validate NextAuth secret is set
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('NEXTAUTH_SECRET is required in production')
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [

    CredentialsProvider({

      name: 'Credentials',

      credentials: {

        username: { label: 'Username', type: 'text' },

        password: { label: 'Password', type: 'password' },

      },

      async authorize(credentials) {

        if (!credentials?.username || !credentials?.password) return null

        // Validate username input (prevent injection)
        const username = String(credentials.username).trim()
        if (username.length === 0 || username.length > 100) return null
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) return null // Only alphanumeric, dots, underscores, hyphens

        const email = `${username}@dashboard.local`



        const supabaseAdmin = createClient(

          process.env.NEXT_PUBLIC_SUPABASE_URL!,

          process.env.SUPABASE_SERVICE_ROLE_KEY!,

          { auth: { autoRefreshToken: false, persistSession: false } }

        )



        const { data, error } = await supabaseAdmin.auth.signInWithPassword({

          email: email,

          password: credentials.password,

        })



        if (error || !data.user) {

          console.error('Auth Error:', error?.message)

          return null

        }



        return {

          id: data.user.id,

          email: data.user.email,

          name: credentials.username,

        }

      },

    }),

  ],

  pages: { signIn: '/login' },

  callbacks: {

    async jwt({ token, user }) {

      if (user) token.id = user.id

      return token

    },

    async session({ session, token }) {

      if (session.user) session.user.id = token.id as string

      return session

    },

  },

}



const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
