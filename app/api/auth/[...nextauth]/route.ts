import NextAuth from 'next-auth'

import type { AuthOptions } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

import { createClient } from '@supabase/supabase-js'



export const authOptions: AuthOptions = {

  providers: [

    CredentialsProvider({

      name: 'Credentials',

      credentials: {

        username: { label: 'Username', type: 'text' },

        password: { label: 'Password', type: 'password' },

      },

      async authorize(credentials) {

        if (!credentials?.username || !credentials?.password) return null



        // 1. Construct the "Ghost Email"

        // The user types "admin", we send "admin@dashboard.local"

        const email = `${credentials.username}@dashboard.local`



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

          name: credentials.username, // Return the clean username

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
